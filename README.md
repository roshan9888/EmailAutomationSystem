The assignment is to build a tool that will parse and check the emails in a Google email ID, and respond to the e-mails based on the context using AI. Use BullMQ as the tasks scheduler This is a server-based application built with TypeScript and Express. It uses various packages such as Cohere for AI functionalities, googleapis for Google APIs, and axios for HTTP requests and bullMQ to process queues.

<img width="1391" alt="image" src="https://github.com/roshan9888/EmailAutomationSystem/assets/100696071/320eb674-c9d7-46fb-a5b6-b362928acaf3">

Using this Email id for SignIn.All the unread emails will be read by the google apis and Cohere will categorize it and generate response accordingly.
![image](https://github.com/roshan9888/EmailAutomationSystem/assets/100696071/fdeeebe8-8776-4888-8deb-b79a15449c25)

Example for categorization:
examples: [
          { text: 'I am very interested in your product.', label: 'Interested' },
          { text: 'I would love to know more about your services.', label: 'Interested' },
          { text: 'Can you provide more information?', label: 'More information' },
          { text: 'I need more details about your offerings.', label: 'More information' },
          { text: 'I am not interested.', label: 'Not Interested' },
          { text: 'Please remove me from your mailing list.', label: 'Not Interested' },
        ],

Example for response generate prompt for categorize emails
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
