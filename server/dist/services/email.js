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
Object.defineProperty(exports, "__esModule", { value: true });
exports.readOutlookEmails = void 0;
exports.readGmailEmails = readGmailEmails;
const googleapis_1 = require("googleapis");
function readGmailEmails(authClient) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const gmail = googleapis_1.google.gmail({ version: 'v1', auth: authClient });
            // List unread messages
            const res = yield gmail.users.messages.list({
                userId: 'me',
                q: 'is:unread'
            });
            console.log('Gmail API Response:', res.data);
            const messages = res.data.messages || [];
            const emails = [];
            // Fetch detailed email data for each message
            for (const message of messages) {
                const messageId = message.id;
                if (messageId) {
                    const { data } = yield gmail.users.messages.get({
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
        }
        catch (error) {
            console.error('Error reading Gmail emails:', error);
            throw error;
        }
    });
}
const readOutlookEmails = (client) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield client.api('/me/mailFolders/inbox/messages').filter('isRead eq false').get();
        return res.value;
    }
    catch (error) {
        console.error('Error reading Outlook emails:', error);
        throw error;
    }
});
exports.readOutlookEmails = readOutlookEmails;
