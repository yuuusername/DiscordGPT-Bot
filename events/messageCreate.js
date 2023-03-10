const { Events, EmbedBuilder } = require('discord.js');
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
const { channel } = require('diagnostics_channel');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const historyDbFilePath = path.join(__dirname, 'history.json');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		const token = process.env.DISCORD_TOKEN;
		if (message.channelId == process.env.DISCORD_CHANNEL_ID && !message.author.bot && !message.system) {
			let content = message.content;
			let author = message.author;
			let nickname = message.member.nickname || author.username;
			let id = author.id;
			let cleanMessage = content.replace(/<@(\d+)>/gi, ($0, $1) => {
			return `<@${nickname}>`;
			});
			let historyLength = 20;
			let currentMessage = {role: "user", content: cleanMessage};
			let currentAuthor = {role: "system", content: `${nickname}:`}
			let history = [];
			try {
			  const dbData = await readFileAsync(historyDbFilePath, { encoding: 'utf8' });
			  history = JSON.parse(dbData);
			} catch (error) {
			  if (error.code !== 'ENOENT') {
				console.error(error);
			  }
			}

			if (!Array.isArray(history)) {
				history = [];
			}

			// To add date to the message //
			// let d = new Date(message.createdTimestamp);
			// let date = new Intl.DateTimeFormat('en-GB', { 
			// 	year: 'numeric',
			// 	month: '2-digit',
			// 	day: '2-digit',
			// 	hour: '2-digit',
			// 	minute: '2-digit',
			// 	second: '2-digit',
			// 	hour12: false
			// }).format(d);
			//let timestamp = `[${date}]`;

			const desiredLength = 500;
			while (`${cleanMessage}`.length > desiredLength) {
			cleanMessage = `${cleanMessage}`.slice(0, -1);
			}
			let conversation = prompt(message, nickname);
			conversation = conversation.concat(history);
			conversation.push(prompt(message, nickname)[prompt.length - 1]);
			conversation.push(currentAuthor);
			conversation.push(currentMessage);
			let completionIndex = 3;
			let responseSent = false;
			while (completionIndex != 0 && !responseSent) {
				message.channel.sendTyping();
				completionIndex--;
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
					await writeFileAsync(historyDbFilePath, JSON.stringify(history), { encoding: 'utf8' });
					} catch (error) {
					console.error(error);
					}
					let [messageResponse] = await Promise.all([
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
						}),
					]);
					responseSent = true;
					return messageResponse;
				} catch (err) {
					console.error(err);
					const errorEmbed = new EmbedBuilder()
						.setColor(0xFF0000)
						.setTitle('There was an error D:')
						.setDescription(completionIndex == 0
							? `${err}. Try searching the error code on [OpenAI Support](https://help.openai.com/en/). Check your [API usage](https://platform.openai.com/account/usage).`
							: `${err}. I'll try again ${completionIndex} more time/s in 5 seconds!`);
						const errorMessage = await message.channel.send({embeds: [errorEmbed]});
						if (completionIndex > 0) {
						  await new Promise(resolve => setTimeout(resolve, 5000));
						  setTimeout(() => errorMessage.delete(), 5000);
						}
				}
			}
		}
	},
};