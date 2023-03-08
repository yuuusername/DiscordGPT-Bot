const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		console.log(`Need to invite your bot? Here you go: https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=274877991936&scope=bot`)
	},
};
