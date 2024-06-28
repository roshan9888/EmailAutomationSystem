"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors = require("cors");
const cookieParser = require("cookie-parser");
const google_1 = require("./auth/google");
const outlook_1 = require("./auth/outlook");
const emailQueue_1 = require("./queues/emailQueue");
dotenv_1.default.config();
const app = (0, express_1.default)();
// app.get('/auth/google', (req, res) => {
//   res.redirect(getGoogleAuthURL());
// });
app.use(express_1.default.json());
app.use(cookieParser());
app.use(cors({
    origin: "*",
    credentials: true,
}));
app.get('/auth/google', (req, res) => {
    const url = (0, google_1.getGoogleAuthURL)();
    console.log("Redirect url", url);
    res.redirect((0, google_1.getGoogleAuthURL)());
});
app.get('/auth/google/callback', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const code = req.query.code; // Extract authorization code
        if (!code) {
            throw new Error('Authorization code is missing');
        }
        console.log('Authorization code:', code);
        // Exchange code for tokens
        const client = yield (0, google_1.getGoogleTokens)(code);
        console.log("Here is the client:", client);
        // Add job to email queue
        yield emailQueue_1.emailqueue.add('processEmail', {
            emailService: 'Gmail',
            emailAccount: 'roshan816000@gmail.com', // Replace with actual email if needed
            client,
        });
        res.json({ message: 'Google Authentication successful!' });
    }
    catch (error) {
        console.error('Error getting Google tokens:', error);
        res.status(500).send('Authentication failed');
    }
}));
app.get('/auth/outlook', (req, res) => {
    res.redirect((0, outlook_1.getOutlookAuthURL)());
});
app.get('/auth/outlook/callback', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const code = req.query.code; // Extract authorization code
        // Exchange code for client (tokens)
        const client = yield (0, outlook_1.getOutlookTokens)(code);
        console.log("Here is the Outlook client:", client);
        // Add job to email queue
        yield emailQueue_1.emailqueue.add('processEmail', {
            emailService: 'Outlook',
            emailAccount: 'roshan816000@gmail.com', // Replace with actual email if needed
            client,
        });
        res.send('Outlook Authentication successful! You can close this window.');
    }
    catch (error) {
        console.error('Error getting Outlook tokens:', error);
        res.status(500).send('Error during Outlook Authentication');
    }
}));
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // Listen to worker events
    emailQueue_1.emailWorker.on('completed', (job) => {
        console.log(`Job ${job.id} has been completed`);
    });
    emailQueue_1.emailWorker.on('failed', (job, err) => {
        if (job && job.id) {
            console.error(`Job ${job.id} has failed with error: ${err}`);
        }
        else {
            console.error(`An error occurred in emailWorker: ${err}`);
        }
    });
    console.log('Email worker is started');
});
