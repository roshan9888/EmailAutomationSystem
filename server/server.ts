import express from 'express';
import dotenv from 'dotenv';
const cors = require("cors");
const cookieParser = require("cookie-parser");
import { getGoogleAuthURL, getGoogleTokens } from './auth/google';
import { getOutlookAuthURL, getOutlookTokens } from './auth/outlook';
import { emailqueue, emailWorker } from './queues/emailQueue';
import oauth2Client from './auth/google';
dotenv.config();
const app = express();

// app.get('/auth/google', (req, res) => {
//   res.redirect(getGoogleAuthURL());
// });
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);

app.get('/auth/google',(req,res)=>{
  const url=getGoogleAuthURL();
  console.log("Redirect url",url);
  res.redirect(getGoogleAuthURL());
});

app.get('/auth/google/callback', async (req, res) => {
  try {
    const code = req.query.code as string; // Extract authorization code
    if (!code) {
      throw new Error('Authorization code is missing');
    }
    console.log('Authorization code:', code);

    // Exchange code for tokens
    const client = await getGoogleTokens(code);
    console.log("Here is the client:", client);

    // Add job to email queue
    await emailqueue.add('processEmail', {
      emailService: 'Gmail',
      emailAccount: 'roshan816000@gmail.com', // Replace with actual email if needed
      client,
    });
    res.json({ message: 'Google Authentication successful!'});
  } catch (error) {
    console.error('Error getting Google tokens:', error);
    res.status(500).send('Authentication failed');
  }
});

app.get('/auth/outlook', (req, res) => {
  res.redirect(getOutlookAuthURL());
});

app.get('/auth/outlook/callback', async (req, res) => {
  try {
    const code = req.query.code as string; // Extract authorization code

    // Exchange code for client (tokens)
    const client = await getOutlookTokens(code);
    console.log("Here is the Outlook client:", client);

    // Add job to email queue
    await emailqueue.add('processEmail', {
      emailService: 'Outlook',
      emailAccount: 'roshan816000@gmail.com', // Replace with actual email if needed
      client,
    });

    res.send('Outlook Authentication successful! You can close this window.');
  } catch (error) {
    console.error('Error getting Outlook tokens:', error);
    res.status(500).send('Error during Outlook Authentication');
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Listen to worker events
  emailWorker.on('completed', (job) => {
    console.log(`Job ${job.id} has been completed`);
  });

  emailWorker.on('failed', (job, err) => {
    if (job && job.id) {
      console.error(`Job ${job.id} has failed with error: ${err}`);
    } else {
      console.error(`An error occurred in emailWorker: ${err}`);
    }
  });

  console.log('Email worker is started');
});
