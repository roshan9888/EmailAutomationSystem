import { Queue, Worker } from 'bullmq';
import { readGmailEmails, readOutlookEmails } from '../services/email';
import { categorizeEmail, generateResponse } from '../services/openai';
import { sendGmailResponse, sendOutlookResponse } from '../services/sendEmail';
// import { OAuth2Client } from 'google-auth-library';
// import { Client } from '@microsoft/microsoft-graph-client';
import IORedis from 'ioredis';
import redisConfig from '../redisConfig';
import {oauth2Client} from '../auth/google';
import {getClient} from '../auth/outlook'

const connection = new IORedis(redisConfig);
const emailqueue = new Queue('email', { connection });

const emailWorker = new Worker('email', async (job) => {
  try {
    const { emailService, emailAccount,client } = job.data;
    console.log(`Processing job for ${emailService} email account: ${emailAccount}`);

    let emails;

    if (emailService === 'Gmail') {
      emails = await readGmailEmails(oauth2Client);
      console.log('Received emails from Gmail:', emails);
    } else if (emailService === 'Outlook') {
        const client = getClient();
      emails = await readOutlookEmails(client);
      console.log('Received emails from Outlook:', emails);
    }

    if (!Array.isArray(emails) || emails.length === 0) {
      throw new Error('No emails found or emails is not an array');
    }

    for (const email of emails) {
      const fromHeader = email.payload.headers.find((header: { name: string; value: string }) => header.name === 'From');
    const recipientAddress = fromHeader ? fromHeader.value : 'Unknown';
    console.log(recipientAddress);
      const emailText = email.snippet; // Adjust based on actual email object structure
      // const emailreceipent=email.from;
      const category = await categorizeEmail(emailText);
      const response = await generateResponse(category,recipientAddress,emailText);
       
      if (emailService === 'Gmail') {
        // Access subject from headers
        console.log(`Email Account:,${emailAccount}`);
        const subject = email.payload.headers.find((header: any) => header.name === 'Subject')?.value || 'No Subject';
        const senderaddress=email.payload.headers.find((header:any)=> header.name==='From')?.value || 'No Sender';
        console.log(`sender email address:${senderaddress}`);
        await sendGmailResponse(senderaddress, 'Re: ' + subject, response);
      } else if (emailService === 'Outlook') {
        // Adjust as per Outlook email handling
        await sendOutlookResponse(client, emailAccount, 'Re: ' + email.subject, response);
      }
    }
  } catch (error) {
    console.error('Error processing email:', error);
    throw error; // Optional: re-throw the error to ensure proper handling
  }
}, { connection });

export { emailqueue, emailWorker };
