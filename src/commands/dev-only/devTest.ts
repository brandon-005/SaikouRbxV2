import { Command } from 'discord.js';

const command: Command = {
	config: {
		commandName: 'test2',
		commandAliases: ['test2'],
		commandDescription: 'Used for testing.',
		userPermissions: ['MANAGE_MESSAGES'],
	},
	run: async (bot, message, args) => {
		message.channel.send('Yo');
	},
};

export = command;
