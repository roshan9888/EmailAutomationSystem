import { google } from 'googleapis';
import oauth2Client from '../auth/google';
import { Client } from '@microsoft/microsoft-graph-client';

export const sendGmailResponse = async (to: string, subject: string, body: string) => {
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  const email = [
    'Content-Type: text/plain; charset="UTF-8"\r\n',
    'MIME-Version: 1.0\r\n',
    `From: "Roshan Kumar" <roshan8560001@gmail.com>\r\n`,
    `To: ${to}\r\n`,
    `Subject: ${subject}\r\n\r\n`,
    `${body}\r\n`,
  ].join('');

  const base64EncodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  try {
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: base64EncodedEmail,
      },
    });
    console.log('Message sent:', response.data);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const sendOutlookResponse = async (client: Client, to: string, subject: string, body: string) => {
  await client.api('/me/sendMail').post({
    message: {
      subject,
      body: {
        contentType: 'Text',
        content: body,
      },
      toRecipients: [
        {
          emailAddress: {
            address: to,
          },
        },
      ],
    },
  });
};