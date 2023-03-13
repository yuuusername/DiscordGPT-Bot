const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const { promisify } = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remember')
		.setDescription(`Whisper something important for me to remember!`)
		.addStringOption(option =>
			option.setName('input')
				.setDescription('What do you want me to remember?')
				.setRequired(true)
				.setMaxLength(1000)),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		const rememberMessage = interaction.options.getString('input')
		let memoryLength = 20;
		let memoryBank = [];
		const initMessage = {
			role: "system",
			content: `You need to remember the following:`
		}
		const memoryBankFilePath = path.join(__dirname, 'memoryBank.json');
			try {
			  const dbData = await readFileAsync(memoryBankFilePath, { encoding: 'utf8' });
			  memoryBank = JSON.parse(dbData);
			} catch (error) {
				memoryBank.push(initMessage);
			  if (error.code !== 'ENOENT') {
				console.error(error);
			  }
			}
			const newMemory = {
				role: "system",
				content: `${rememberMessage}`
			}
			memoryBank.push(newMemory);
			if (memoryBank.length > memoryLength) {
			memoryBank = memoryBank.slice(memoryBank.length - memoryLength);
			}
			try {
			await writeFileAsync(memoryBankFilePath, JSON.stringify(memoryBank), { encoding: 'utf8' });
			} catch (error) {
			console.error(error);
			}
			if (!Array.isArray(memoryBank)) {
				memoryBank = [];
			}

			await interaction.editReply(`I'll remember that ${rememberMessage}`);
		//return interaction.reply({ content: `I'll remember that ${rememberMessage}`, ephemeral: true});
	},
};