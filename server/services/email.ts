// import { google, gmail_v1 } from 'googleapis';
// import { oauth2Client } from '../auth/google';
// import { Client } from '@microsoft/microsoft-graph-client';
// import {OAuth2Client} from 'google-auth-library';

// export async function readGmailEmails(authClient: OAuth2Client): Promise<gmail_v1.Schema$Message[]> {
//     try {
//       const gmail = google.gmail({ version: 'v1', auth: authClient });
  
//       // List unread messages
//       const res = await gmail.users.messages.list({
//         userId: 'me',
//         q: 'is:unread'
//       });
  
//       console.log('Gmail API Response:', res.data);
  
//       const messages = res.data.messages || [];
//       const emails: gmail_v1.Schema$Message[] = [];
  
//       // Fetch detailed email data for each message
//       for (const message of messages) {
//         const messageId = message.id;
//         if (messageId) {
//           const { data } = await gmail.users.messages.get({
//             userId: 'me',
//             id: messageId,
//             auth: authClient
//           });
  
//           if (data) {
//             emails.push(data);
//           }
//         }
//       }
//       return emails;
//     } catch (error) {
//       console.error('Error reading Gmail emails:', error);
//       throw error;
//     }
//   }


// export const readOutlookEmails = async (client: Client) => {
//   try {
//     const res = await client.api('/me/mailFolders/inbox/messages').filter('isRead eq false').get();
//     return res.value;
//   } catch (error) {
//     console.error('Error reading Outlook emails:', error);
//     throw error;
//   }
// };



import { google, gmail_v1 } from 'googleapis';
import { oauth2Client } from '../auth/google';
import { Client } from '@microsoft/microsoft-graph-client';
import { OAuth2Client } from 'google-auth-library';

// Helper function to get date 24 hours ago in YYYY/MM/DD format
const getDate24HoursAgo = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

export async function readGmailEmails(authClient: OAuth2Client): Promise<gmail_v1.Schema$Message[]> {
  try {
    const gmail = google.gmail({ version: 'v1', auth: authClient });
    const date24HoursAgo = getDate24HoursAgo();
  
    // List unread messages from the last 24 hours
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: `is:unread after:${date24HoursAgo}`
    });
  
    console.log('Gmail API Response:', res.data);
  
    const messages = res.data.messages || [];
    const emails: gmail_v1.Schema$Message[] = [];
  
    // Fetch detailed email data for each message
    for (const message of messages) {
      const messageId = message.id;
      if (messageId) {
        const { data } = await gmail.users.messages.get({
          userId: 'me',
          id: messageId,
          auth: authClient
        });
  
        if (data) {
          emails.push(data);
        }
      }
    }
    return emails;
  } catch (error) {
    console.error('Error reading Gmail emails:', error);
    throw error;
  }
}

export const readOutlookEmails = async (client: Client) => {
  try {
    const date24HoursAgo = new Date();
    date24HoursAgo.setDate(date24HoursAgo.getDate() - 1);

    // Filter emails from the last 24 hours
    const res = await client
      .api('/me/mailFolders/inbox/messages')
      .filter(`receivedDateTime ge ${date24HoursAgo.toISOString()} and isRead eq false`)
      .get();
      
    return res.value;
  } catch (error) {
    console.error('Error reading Outlook emails:', error);
    throw error;
  }
};


