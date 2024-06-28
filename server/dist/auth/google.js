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
exports.getGoogleTokens = exports.getGoogleAuthURL = exports.oauth2Client = void 0;
const google_auth_library_1 = require("google-auth-library");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.oauth2Client = new google_auth_library_1.OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
});
const getGoogleAuthURL = () => {
    const scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.send',
    ];
    const authUrl = exports.oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
    return authUrl;
};
exports.getGoogleAuthURL = getGoogleAuthURL;
const getGoogleTokens = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const { tokens } = yield exports.oauth2Client.getToken(code);
    console.log("Tokens", tokens);
    exports.oauth2Client.setCredentials(tokens);
    return exports.oauth2Client;
});
exports.getGoogleTokens = getGoogleTokens;
exports.default = exports.oauth2Client;
