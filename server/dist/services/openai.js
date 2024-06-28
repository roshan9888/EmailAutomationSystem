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
exports.generateResponse = exports.categorizeEmail = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiKey = process.env.COHERE_API_KEY;
// Function to categorize email using Cohere's classify API
const categorizeEmail = (emailContent) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Categorizing email content:', emailContent); // Log the email content
        const response = yield axios_1.default.post('https://api.cohere.ai/classify', {
            model: 'large',
            inputs: [emailContent],
            examples: [
                { text: 'I am very interested in your product.', label: 'Interested' },
                { text: 'I would love to know more about your services.', label: 'Interested' },
                { text: 'Can you provide more information?', label: 'More information' },
                { text: 'I need more details about your offerings.', label: 'More information' },
                { text: 'I am not interested.', label: 'Not Interested' },
                { text: 'Please remove me from your mailing list.', label: 'Not Interested' },
            ],
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Cohere-Version': '2022-12-06'
            }
        });
        const classification = response.data.classifications[0];
        const category = classification.prediction;
        const confidence = classification.confidence;
        console.log('Categorized email as:', category, 'with confidence:', confidence); // Log the category and confidence
        // Default to 'Default' category if confidence is below a certain threshold
        if (confidence < 0.7) {
            console.warn(`Low confidence (${confidence}) in categorization. Categorizing as 'Default'.`);
            return 'Default';
        }
        return category;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error('Error categorizing email:', error.response ? error.response.data : error.message);
        }
        else {
            console.error('Error categorizing email:', error);
        }
        throw error;
    }
});
exports.categorizeEmail = categorizeEmail;
// Function to generate response using Cohere's generate API
// export const generateResponse = async (category: string): Promise<string> => {
//   let prompt: string;
//   switch (category) {
//     case 'Interested':
//       prompt = 'Write a response to someone who is interested in our service and wants to know more. Offer to schedule a demo call.';
//       break;
//     case 'Not Interested':
//       prompt = 'Write a polite response to someone who is not interested in our service.';
//       break;
//     case 'More information':
//       prompt = 'Write a response to someone who wants more information about our service. Provide detailed information and offer to answer any questions.';
//       break;
//     case 'Default':
//       prompt = 'Write a general response to an email. Thank the sender for their message and offer to assist with any questions or provide more information.';
//       break;
//     default:
//       prompt = 'Write a response to an email.';
//   }
//   try {
//     console.log('Generating response for category:', category); // Log the category
//     const response = await axios.post(
//       'https://api.cohere.ai/generate',
//       {
//         model: 'command-xlarge-nightly',
//         prompt: prompt,
//         max_tokens: 100,
//       },
//       {
//         headers: {
//           'Authorization': `Bearer ${apiKey}`,
//           'Content-Type': 'application/json',
//           'Cohere-Version': '2022-12-06'
//         }
//       }
//     );
//     const reply = response.data.generations[0].text.trim();
//     console.log('Generated response:', reply); // Log the generated response
//     return reply;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error('Error generating response:', error.response ? error.response.data : error.message);
//     } else {
//       console.error('Error generating response:', error);
//     }
//     throw error;
//   }
// };
const generateResponse = (category, senderName, emailContent) => __awaiter(void 0, void 0, void 0, function* () {
    let prompt;
    console.log(senderName);
    console.log(emailContent);
    switch (category) {
        case 'Interested':
            prompt = `The following email was received from ${senderName}:\n"${emailContent}"\n\nWrite a response to someone who is interested in our service and wants to know more. Offer to schedule a demo call and in best regards write AI Automation Reponse.`;
            break;
        case 'Not Interested':
            prompt = `The following email was received from ${senderName}:\n"${emailContent}"\n\nWrite a polite response to someone who is not interested in our service and in best regards write AI Automation Reponse.`;
            break;
        case 'More information':
            prompt = `The following email was received from ${senderName}:\n"${emailContent}"\n\nWrite a response to someone who wants more information about our service. Provide detailed information and offer to answer any questions and in best regards write AI Automation Reponse.`;
            break;
        default:
            prompt = `The following email was received from ${senderName}:\n"${emailContent}"\n\nWrite a response to an email and in best regards write AI Automation Reponse.`;
    }
    try {
        console.log('Generating response for category:', category); // Log the category
        const response = yield axios_1.default.post('https://api.cohere.ai/generate', {
            model: 'command-xlarge-nightly',
            prompt: prompt,
            max_tokens: 100,
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Cohere-Version': '2022-12-06'
            }
        });
        const reply = response.data.generations[0].text.trim();
        console.log('Generated response:', reply); // Log the generated response
        return reply;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error('Error generating response:', error.response ? error.response.data : error.message);
        }
        else {
            console.error('Error generating response:', error);
        }
        throw error;
    }
});
exports.generateResponse = generateResponse;
// Example usage
const processEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const emailContent = email.snippet; // Adjust this based on how you access the email content
    console.log("receipent email address:", email.from);
    try {
        console.log('Processing email:', email);
        // Log the recipient address
        const recipientAddress = email.from;
        console.log(`Recipient address: ${recipientAddress}`);
        // Categorize the email using Cohere API
        const category = yield (0, exports.categorizeEmail)(emailContent);
        console.log(`Email categorized as: ${category}`);
        // Generate a response based on the category
        const response = yield (0, exports.generateResponse)(category, recipientAddress, emailContent);
        console.log(`Generated response for the email: ${response}`);
        // Send the response (add your email sending logic here)
        // await sendGmailResponse(email.from, 'Re: ' + email.subject, response);
    }
    catch (error) {
        console.error('Error processing email:', error);
    }
});
exports.default = processEmail;
