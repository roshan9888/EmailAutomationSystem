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
exports.sendOutlookResponse = exports.sendGmailResponse = void 0;
const googleapis_1 = require("googleapis");
const google_1 = __importDefault(require("../auth/google"));
const sendGmailResponse = (to, subject, body) => __awaiter(void 0, void 0, void 0, function* () {
    const gmail = googleapis_1.google.gmail({ version: 'v1', auth: google_1.default });
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
        const response = yield gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: base64EncodedEmail,
            },
        });
        console.log('Message sent:', response.data);
    }
    catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
});
exports.sendGmailResponse = sendGmailResponse;
const sendOutlookResponse = (client, to, subject, body) => __awaiter(void 0, void 0, void 0, function* () {
    yield client.api('/me/sendMail').post({
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
});
exports.sendOutlookResponse = sendOutlookResponse;
