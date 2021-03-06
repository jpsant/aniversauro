// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// index.js is used to setup and configure your bot

// Import required packages
const path = require('path');
const csv = require('csvtojson');
const validateContactList = require('./utils/contactListValidation');
const generateBirthdayMessage = require('./utils/generateBirthdayMessage');

// Note: Ensure you have a .env file and include the MicrosoftAppId and MicrosoftAppPassword.
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

const restify = require('restify');

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const { BotFrameworkAdapter } = require('botbuilder');

// This bot's main dialog.
const { ProactiveBot } = require('./bots/proactiveBot');

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights. See https://aka.ms/bottelemetry for telemetry 
    //       configuration instructions.
    console.error(`\n [onTurnError] unhandled error: ${ error }`);

    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${ error }`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Send a message to the user
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
};

// Create the main dialog.
const conversationReferences = {};
const bot = new ProactiveBot(conversationReferences);

// Create HTTP server.
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log(`\n${ server.name } listening to ${ server.url }`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});

// Listen for incoming activities and route them to your bot main dialog.
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (turnContext) => {
        // route to main dialog.
        await bot.run(turnContext);
    });
});

// Listen for incoming notifications and send proactive messages to users.
server.get('/api/notify', async (req, res) => {
    try {
        const message = await searchBirthday(res);
        if (message === undefined) {
            res.end();
            return;
        }
        for (const conversationReference of Object.values(conversationReferences)) {
            await adapter.continueConversation(conversationReference, async turnContext => {
                await turnContext.sendActivity(message);
            });
        }
        res.end();
        console.log(message);
      } catch (err) {
        console.log(err);
      }
});

const searchBirthday = async (res) => {
    let contacts = await csv().fromFile(`./contacts/list.csv`);
    const today = (new Date()).toLocaleDateString('pt-br', {day: '2-digit', month: '2-digit'});

    let birthdays =  contacts.filter(contact => contact.birthday === today);
    validateContactList(birthdays);

    if (birthdays.length < 1)
        return console.log("\nN??o h?? aniversariantes no dia de hoje.\n");

    const message = generateBirthdayMessage(birthdays);

    return message;
};