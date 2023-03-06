const { Events, Message, IntegrationApplication } = require('discord.js');
const lib = require('lib')({ 
	token: process.env.LIB_API_KEY, 
});
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
// Load local Database
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const prompt = require('./prompt.js');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const dbFilePath = path.join(__dirname, 'history.json');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		const token = process.env.DISCORD_TOKEN;
		if (message.channelId == process.env.DISCORD_CHANNEL_ID && !message.author.bot) {
			let content = message.content;
			let author = message.author;
			let username = author.username;
			let id = author.id;
			let cleanMessage = content.replace(/<@(\d+)>/gi, ($0, $1) => {
			return `<@${username}>`;
			});

			let kvKey = `discordgpt:messageHistory:!`;
			let historyLength = 10;
			
			
			let currentMessage = {role: "user", content: cleanMessage}
			console.log(currentMessage);
			let history = [];
			try {
			  const dbData = await readFileAsync(dbFilePath, { encoding: 'utf8' });
			  history = JSON.parse(dbData);
			} catch (error) {
			  if (error.code !== 'ENOENT') {
				console.error(error);
			  }
			}

			if (!Array.isArray(history)) {
				history = [];
			}

			let d = new Date(message.createdTimestamp);
			let date = new Intl.DateTimeFormat('en-GB', { 
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: false
			}).format(d);
			let timestamp = `[${date}]`;

			const desiredLength = 500;
			while (`${cleanMessage}`.length > desiredLength) {
			cleanMessage = `${cleanMessage}`.slice(0, -1);
			}
			let conversation = prompt(message, username);
			conversation = conversation.concat(history);
			conversation.push(currentMessage);
			// let completePrompt = [
			// prompt(message , username),
			// history.join('\n'),
			// conversation
			// ].join('\n');
			try {
				let completion = await openai.createChatCompletion({
					model: "gpt-3.5-turbo",
					messages: conversation
				});

				let response = completion.data.choices[0].message;
				console.log("THIS IS THE RESPONSE:" + response);
				conversation = conversation + response;
				history.push(currentMessage, response);
				if (history.length > historyLength) {
				  history = history.slice(history.length - historyLength);
				}
				try {
				  await writeFileAsync(dbFilePath, JSON.stringify(history), { encoding: 'utf8' });
				} catch (error) {
				  console.error(error);
				}
				console.log(response);
				let [messageResponse, kvResponse] = await Promise.all([
					message.channel.send({
					channel_id: `DISCORD_CHANNEL_ID`,
					content: [
						response.content
					].join('\n'),
					tts: false,
					allowedMentions: { // "allowed_mentions" with this parameter prevents a ping
						repliedUser: false
					},
					reply: {
						messageReference: message.id
						}
					}
					),
					lib.utils.kv['@0.1.16'].set({
					key: kvKey,
					value: history,
					ttl: 600
					})
				]);
				console.log(messageResponse)
				return messageResponse
			} catch (err) {
				console.error(err);
			}
		}
	},
};