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
			let nickname = message.member.nickname || author.username;
			let id = author.id;
			let cleanMessage = content.replace(/<@(\d+)>/gi, ($0, $1) => {
			return `<@${nickname}>`;
			});

			let kvKey = `discordgpt:messageHistory:!`;
			let historyLength = 20;
			
			
			let currentMessage = {role: "user", content: cleanMessage};
			let currentAuthor = {role: "system", content: `The next message is authored by ${nickname}:`}
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
			let conversation = prompt(message, nickname);
			conversation = conversation.concat(history);
			conversation.push(currentAuthor);
			conversation.push(currentMessage);
			try {
				let completion = await openai.createChatCompletion({
					model: "gpt-3.5-turbo",
					messages: conversation,
					temperature: 0,
					top_p: 0,
					max_tokens: 256,
					frequency_penalty: 0,
					presence_penalty: 0,
				});

				let response = completion.data.choices[0].message;
				conversation = conversation + response;
				history.push(currentAuthor, currentMessage, response);
				if (history.length > historyLength) {
				  history = history.slice(history.length - historyLength);
				}
				try {
				  await writeFileAsync(dbFilePath, JSON.stringify(history), { encoding: 'utf8' });
				} catch (error) {
				  console.error(error);
				}
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
				return messageResponse
			} catch (err) {
				console.error(err);
			}
		}
	},
};