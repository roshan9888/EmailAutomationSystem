// auth.ts

import { Client } from '@microsoft/microsoft-graph-client';
import { DeviceCodeCredential } from '@azure/identity';
import dotenv from 'dotenv';

dotenv.config();

let client: Client ;
const credential = new DeviceCodeCredential({
  clientId: process.env.OUTLOOK_CLIENT_ID!,
  tenantId: 'common',
});

export const getOutlookAuthURL = (): string => {
  return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${process.env.OUTLOOK_CLIENT_ID}&response_type=code&redirect_uri=${process.env.OUTLOOK_REDIRECT_URI}&response_mode=query&scope=Mail.Read Mail.Send offline_access`;
};

export const getOutlookTokens = async (code: string): Promise<Client> => {
  const tokenRequest = {
    code,
    redirectUri: process.env.OUTLOOK_REDIRECT_URI!,
    scopes: ['Mail.Read', 'Mail.Send'],
  };

  try {
    const authProvider = {
      getAccessToken: async () => (await credential.getToken(tokenRequest.scopes)).token,
    };

    client = Client.initWithMiddleware({ authProvider });
    // credential.setCredentials(client);
    
    if (!client) {
      throw new Error('Outlook client initialization failed.');
    }

    return client;
  } catch (error) {
    console.error('Error initializing Outlook client:', error);
    throw error;
  }
};

export const getClient = (): Client => {
  return client;
};
