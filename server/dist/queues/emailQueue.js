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
exports.emailWorker = exports.emailqueue = void 0;
const bullmq_1 = require("bullmq");
const email_1 = require("../services/email");
const openai_1 = require("../services/openai");
const sendEmail_1 = require("../services/sendEmail");
// import { OAuth2Client } from 'google-auth-library';
// import { Client } from '@microsoft/microsoft-graph-client';
const ioredis_1 = __importDefault(require("ioredis"));
const redisConfig_1 = __importDefault(require("../redisConfig"));
const google_1 = require("../auth/google");
const outlook_1 = require("../auth/outlook");
const connection = new ioredis_1.default(redisConfig_1.default);
const emailqueue = new bullmq_1.Queue('email', { connection });
exports.emailqueue = emailqueue;
const emailWorker = new bullmq_1.Worker('email', (job) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { emailService, emailAccount, client } = job.data;
        console.log(`Processing job for ${emailService} email account: ${emailAccount}`);
        let emails;
        if (emailService === 'Gmail') {
            emails = yield (0, email_1.readGmailEmails)(google_1.oauth2Client);
            console.log('Received emails from Gmail:', emails);
        }
        else if (emailService === 'Outlook') {
            const client = (0, outlook_1.getClient)();
            emails = yield (0, email_1.readOutlookEmails)(client);
            console.log('Received emails from Outlook:', emails);
        }
        if (!Array.isArray(emails) || emails.length === 0) {
            throw new Error('No emails found or emails is not an array');
        }
        for (const email of emails) {
            const fromHeader = email.payload.headers.find((header) => header.name === 'From');
            const recipientAddress = fromHeader ? fromHeader.value : 'Unknown';
            console.log(recipientAddress);
            const emailText = email.snippet; // Adjust based on actual email object structure
            // const emailreceipent=email.from;
            const category = yield (0, openai_1.categorizeEmail)(emailText);
            const response = yield (0, openai_1.generateResponse)(category, recipientAddress, emailText);
            if (emailService === 'Gmail') {
                // Access subject from headers
                console.log(`Email Account:,${emailAccount}`);
                const subject = ((_a = email.payload.headers.find((header) => header.name === 'Subject')) === null || _a === void 0 ? void 0 : _a.value) || 'No Subject';
                const senderaddress = ((_b = email.payload.headers.find((header) => header.name === 'From')) === null || _b === void 0 ? void 0 : _b.value) || 'No Sender';
                console.log(`sender email address:${senderaddress}`);
                yield (0, sendEmail_1.sendGmailResponse)(senderaddress, 'Re: ' + subject, response);
            }
            else if (emailService === 'Outlook') {
                // Adjust as per Outlook email handling
                yield (0, sendEmail_1.sendOutlookResponse)(client, emailAccount, 'Re: ' + email.subject, response);
            }
        }
    }
    catch (error) {
        console.error('Error processing email:', error);
        throw error; // Optional: re-throw the error to ensure proper handling
    }
}), { connection });
exports.emailWorker = emailWorker;
