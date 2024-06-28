"use strict";
// import { categorizeEmail, generateResponse } from './openai';
// Function to process incoming emails
// const processEmail = async (email: any) => {
//   const emailContent = email.body; // Adjust this based on how you access the email content
//   try {
//     // Categorize the email
//     const category = await categorizeEmail(emailContent);
//     console.log(`Email categorized as: ${category}`);
//     // Generate a response based on the category
//     const response = await generateResponse(category);
//     console.log(`Generated response: ${response}`);
//   } catch (error) {
//     console.error('Error processing email:', error);
//   }
// };
// const processEmail = async (email: any) => {
//   const emailContent = email.snippet; // Adjust this based on how you access the email content
//   console.log("receipent email address:",email.from);
//   try {
//     console.log('Processing email:', email);
//     // Log the recipient address
//     const recipientAddress = email.from;
//     console.log(`Recipient address: ${recipientAddress}`);
//     // Categorize the email using Cohere API
//     const category = await categorizeEmail(emailContent);
//     console.log(`Email categorized as: ${category}`);
//     // Generate a response based on the category
//     const response = await generateResponse(category,recipientAddress,emailContent);
//     console.log(`Generated response for the email: ${response}`);
//     // Send the response (add your email sending logic here)
//     // await sendGmailResponse(email.from, 'Re: ' + email.subject, response);
//   } catch (error) {
//     console.error('Error processing email:', error);
//   }
// };
// export default processEmail;
// export default processEmail;
