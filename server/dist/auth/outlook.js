"use strict";
// auth.ts
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
exports.getClient = exports.getOutlookTokens = exports.getOutlookAuthURL = void 0;
const microsoft_graph_client_1 = require("@microsoft/microsoft-graph-client");
const identity_1 = require("@azure/identity");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let client;
const credential = new identity_1.DeviceCodeCredential({
    clientId: process.env.OUTLOOK_CLIENT_ID,
    tenantId: 'common',
});
const getOutlookAuthURL = () => {
    return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${process.env.OUTLOOK_CLIENT_ID}&response_type=code&redirect_uri=${process.env.OUTLOOK_REDIRECT_URI}&response_mode=query&scope=Mail.Read Mail.Send offline_access`;
};
exports.getOutlookAuthURL = getOutlookAuthURL;
const getOutlookTokens = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenRequest = {
        code,
        redirectUri: process.env.OUTLOOK_REDIRECT_URI,
        scopes: ['Mail.Read', 'Mail.Send'],
    };
    try {
        const authProvider = {
            getAccessToken: () => __awaiter(void 0, void 0, void 0, function* () { return (yield credential.getToken(tokenRequest.scopes)).token; }),
        };
        client = microsoft_graph_client_1.Client.initWithMiddleware({ authProvider });
        // credential.setCredentials(client);
        if (!client) {
            throw new Error('Outlook client initialization failed.');
        }
        return client;
    }
    catch (error) {
        console.error('Error initializing Outlook client:', error);
        throw error;
    }
});
exports.getOutlookTokens = getOutlookTokens;
const getClient = () => {
    return client;
};
exports.getClient = getClient;
