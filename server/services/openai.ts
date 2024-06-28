import axios from 'axios';
import dotenv from 'dotenv';
import { sendGmailResponse } from '../services/sendEmail';
dotenv.config();

const apiKey = process.env.COHERE_API_KEY;

// Function to categorize email using Cohere's classify API
export const categorizeEmail = async (emailContent: string): Promise<string> => {
  try {
    console.log('Categorizing email content:', emailContent); // Log the email content
    const response = await axios.post(
      'https://api.cohere.ai/classify',
      {
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
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Cohere-Version': '2022-12-06'
        }
      }
    );

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
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error categorizing email:', error.response ? error.response.data : error.message);
    } else {
      console.error('Error categorizing email:', error);
    }
    throw error;
  }
};

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

export const generateResponse = async (category: string, senderName: string, emailContent: string): Promise<string> => {
  let prompt: string;
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
    const response = await axios.post(
      'https://api.cohere.ai/generate',
      {
        model: 'command-xlarge-nightly',
        prompt: prompt,
        max_tokens: 100,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Cohere-Version': '2022-12-06'
        }
      }
    );

    const reply = response.data.generations[0].text.trim();
    console.log('Generated response:', reply); // Log the generated response
    return reply;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error generating response:', error.response ? error.response.data : error.message);
    } else {
      console.error('Error generating response:', error);
    }
    throw error;
  }
};

// Example usage
const processEmail = async (email: any) => {
  const emailContent = email.snippet; // Adjust this based on how you access the email content
  console.log("receipent email address:",email.from);
  try {
    console.log('Processing email:', email);

    // Log the recipient address
    const recipientAddress = email.from;
    console.log(`Recipient address: ${recipientAddress}`);
    // Categorize the email using Cohere API
    const category = await categorizeEmail(emailContent);
    console.log(`Email categorized as: ${category}`);

    // Generate a response based on the category
    const response = await generateResponse(category,recipientAddress,emailContent);
    console.log(`Generated response for the email: ${response}`);

    // Send the response (add your email sending logic here)
    // await sendGmailResponse(email.from, 'Re: ' + email.subject, response);

  } catch (error) {
    console.error('Error processing email:', error);
  }
};

export default processEmail;
