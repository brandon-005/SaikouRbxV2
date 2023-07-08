import { Command } from 'discord.js';

const command: Command = {
	config: {
		commandName: 'test2',
		commandAliases: ['test2'],
		commandDescription: 'Used for testing.',
		userPermissions: 'ManageMessages',
	},
	run: async ({ interaction }) => {
		interaction.editReply({ content: 'success' });
	},
};

export = command;
