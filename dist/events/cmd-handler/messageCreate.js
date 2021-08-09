"use strict";
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const chalk_1 = require("chalk");
const constants_1 = require("../../utils/constants");
module.exports = async (bot, message) => {
    if (message.author.bot)
        return;
    const prefix = process.env.PREFIX || '?';
    const commandArguments = message.content.slice(prefix.length).trim().split(/ +/g);
    const inputtedCommand = commandArguments.shift().toLowerCase();
    const webhookClient = new discord_js_1.WebhookClient({ id: `${BigInt(String(process.env.WEBHOOK_ID))}`, token: `${process.env.WEBHOOK_TOKEN}` });
    if (message.content.startsWith(prefix)) {
        const commandFile = bot.commands.get(inputtedCommand) || bot.commands.get(bot.aliases.get(inputtedCommand));
        let neededPermissions = '';
        if (!commandFile)
            return;
        const { commandName, developerOnly, userPermissions, commandUsage, limitedChannel } = commandFile.config;
        /* --- DEVELOPER ONLY CONFIGURATION --- */
        if (!developerOnly && fs_1.readdirSync('dist/commands/dev-only').indexOf(`${commandName}.js`) > -1) {
            return console.error(`${chalk_1.redBright('ERROR!')} DevOnly config option not found in command "${commandName}".\n${chalk_1.redBright('ERROR!')} Add the following to your config options... ${chalk_1.bold('developerOnly: true/false')}`);
        }
        if (developerOnly === true && message.author.id !== '229142187382669312') {
            return message.channel.send('Developer only command.');
        }
        /* --- USER PERMISSIONS CONFIGURATION --- */
        if (!userPermissions && fs_1.readdirSync('dist/commands/staff-only').indexOf(`${commandName}.js`) > -1) {
            return console.error(`${chalk_1.redBright('ERROR!')} UserPermissions config not found in command "${commandName}".\n${chalk_1.redBright('ERROR!')} Add the following to your config options... \nUserPermissions: ${constants_1.DISCORD_PERMISSIONS}`);
        }
        if (userPermissions) {
            for (const permission of userPermissions) {
                const matchingPermissions = constants_1.DISCORD_PERMISSIONS.find((setUserPerm) => setUserPerm === permission);
                if (!message.member?.permissions.has(matchingPermissions)) {
                    neededPermissions += `${matchingPermissions}, `;
                }
            }
        }
        if (neededPermissions) {
            return message
                .reply({
                embeds: [
                    new discord_js_1.MessageEmbed() // prettier-ignore
                        .setTitle('🔐 Incorrect Permissions')
                        .setDescription(`**Command Name:** ${commandName}\n**Permissions Needed:** ${neededPermissions.substring(0, neededPermissions.length - 2)}`)
                        .setColor('#f94343')
                        .setFooter('Missing required permissions'),
                ],
                failIfNotExists: false,
            })
                .then((msg) => setTimeout(() => msg.delete(), constants_1.MESSAGE_TIMEOUT));
        }
        /* --- LIMITED CHANNEL CONFIGURATION --- */
        if (message.channel.type === 'GUILD_TEXT' && limitedChannel && limitedChannel.toLowerCase() !== 'none') {
            if (message.channel.name.match(limitedChannel) === null) {
                return message
                    .reply({
                    embeds: [
                        new discord_js_1.MessageEmbed() // prettier-ignore
                            .setTitle("📌 Can't use this channel!")
                            .setDescription(`The **${commandName}** command is limited to the **${message
                            .guild.channels.cache.filter((channel) => channel.name.match(limitedChannel))
                            .map((channel) => channel.toString())
                            .join(' or ')}** channel. Try relocating to that channel and trying again!`)
                            .setThumbnail('https://i.ibb.co/FD4CfKn/NoBolts.png')
                            .setColor(constants_1.EMBED_COLOURS.red),
                    ],
                    failIfNotExists: false,
                })
                    .then((msg) => setTimeout(() => msg.delete(), constants_1.MESSAGE_TIMEOUT))
                    .catch((err) => console.log(`Caught Error: ${err}`));
            }
        }
        if (message.channel.type === 'GUILD_TEXT' && !limitedChannel) {
            if (message.channel.name.match('🤖staff-cmds') === null) {
                return message
                    .reply({
                    embeds: [
                        new discord_js_1.MessageEmbed() // prettier-ignore
                            .setTitle("📌 Can't use this channel!")
                            .setDescription(`The **${commandName}** command is limited to the **${message.guild.channels.cache.filter((channel) => channel.name.match('🤖staff-cmds')).map((channel) => channel.toString())}** channel. Try relocating to that channel and trying again!`)
                            .setThumbnail('https://i.ibb.co/FD4CfKn/NoBolts.png')
                            .setColor(constants_1.EMBED_COLOURS.red),
                    ],
                    failIfNotExists: false,
                })
                    .then((msg) => setTimeout(() => msg.delete(), constants_1.MESSAGE_TIMEOUT));
            }
        }
        /* --- COMMAND USAGES CONFIGURATION --- */
        if (commandUsage) {
            const usageArray = commandUsage.split(/[ ]+/);
            const usageObject = {};
            for (const eachUsage of usageArray) {
                if (eachUsage.startsWith('<') && eachUsage.endsWith('>'))
                    usageObject[eachUsage] = true;
                else if (eachUsage.startsWith('[') && eachUsage.endsWith(']'))
                    usageObject[eachUsage] = false;
                else
                    return console.error(`${chalk_1.redBright('ERROR!')} usage config argument is neither required <> or optional []\n${chalk_1.redBright('ERROR!')} Usage argument content: "${eachUsage}"`);
            }
            if (commandArguments.length < commandUsage.length) {
                if (Object.values(usageObject)[commandArguments.length] === true) {
                    return message
                        .reply({
                        embeds: [
                            new discord_js_1.MessageEmbed() //
                                .setTitle('📋 Incorrect Usage!')
                                .setDescription(`Improper usage for the **${commandName}** command, please refer below.\n\n\`\`\`Usage: ${prefix}${commandName} ${commandUsage}\n\n${Object.keys(usageObject)[commandArguments.length]} is required for the command to run.\`\`\``)
                                .setColor(constants_1.EMBED_COLOURS.red)
                                .setFooter('<> - Required ● Optional - []'),
                        ],
                        failIfNotExists: false,
                    })
                        .then((msg) => setTimeout(() => msg.delete(), constants_1.MESSAGE_TIMEOUT));
                }
            }
        }
        try {
            await commandFile.run(bot, message, commandArguments);
        }
        catch (errorMessage) {
            console.error(errorMessage);
            message.channel.send({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setTitle('❌ Something went wrong!') // prettier-ignore
                        .setDescription(`Uh oh! Looks like Kaiou has hit some of the wrong buttons, causing an error. You can try... \n\n• Coming back later and trying again\n• Checking out Saikou's social medias whilst you wait 😏`)
                        .setThumbnail('https://i.ibb.co/C5YvkJg/4-128.png')
                        .setColor(constants_1.EMBED_COLOURS.red),
                ],
            });
            webhookClient.send({
                embeds: [
                    new discord_js_1.MessageEmbed() // prettier-ignore
                        .setTitle(`❌ ${errorMessage.name}`)
                        .setDescription(`**Error in the ${commandName} command**\n${errorMessage}`)
                        .setFooter(`Error Occured • ${bot.user.username}`)
                        .setColor(constants_1.EMBED_COLOURS.red)
                        .setTimestamp(),
                ],
            });
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZUNyZWF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ldmVudHMvY21kLWhhbmRsZXIvbWVzc2FnZUNyZWF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMkNBQTBFO0FBQzFFLDJCQUFpQztBQUNqQyxpQ0FBd0M7QUFFeEMscURBQTRGO0FBRTVGLGlCQUFTLEtBQUssRUFBRSxHQUFXLEVBQUUsT0FBZ0IsRUFBRSxFQUFFO0lBQ2hELElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHO1FBQUUsT0FBTztJQUUvQixNQUFNLE1BQU0sR0FBVyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUM7SUFDakQsTUFBTSxnQkFBZ0IsR0FBYSxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVGLE1BQU0sZUFBZSxHQUFXLGdCQUFnQixDQUFDLEtBQUssRUFBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3hFLE1BQU0sYUFBYSxHQUFrQixJQUFJLDBCQUFhLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRW5KLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDdkMsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxD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UUFBUSxDQUFDLHlCQUF5QixDQUFDLENBQUMsa0JBQWtCO3lCQUN0RCxjQUFjLENBQUMsZ01BQWdNLENBQUM7eUJBQ2hOLFlBQVksQ0FBQyxvQ0FBb0MsQ0FBQzt5QkFDbEQsUUFBUSxDQUFDLHlCQUFhLENBQUMsR0FBRyxDQUFDO2lCQUM3QjthQUNELENBQUMsQ0FBQztZQUVILGFBQWEsQ0FBQyxJQUFJLENBQUM7Z0JBQ2xCLE1BQU0sRUFBRTtvQkFDUCxJQUFJLHlCQUFZLEVBQUUsQ0FBQyxrQkFBa0I7eUJBQ25DLFFBQVEsQ0FBQyxLQUFLLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQzt5QkFDbEMsY0FBYyxDQUFDLGtCQUFrQixXQUFXLGVBQWUsWUFBWSxFQUFFLENBQUM7eUJBQzFFLFNBQVMsQ0FBQyxtQkFBbUIsR0FBRyxDQUFDLElBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQzt5QkFDbEQsUUFBUSxDQUFDLHlCQUFhLENBQUMsR0FBRyxDQUFDO3lCQUMzQixZQUFZLEVBQUU7aUJBQ2hCO2FBQ0QsQ0FBQyxDQUFDO1NBQ0g7S0FDRDtBQUNGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENsaWVudCwgTWVzc2FnZSwgTWVzc2FnZUVtYmVkLCBXZWJob29rQ2xpZW50IH0gZnJvbSAnZGlzY29yZC5qcyc7XHJcbmltcG9ydCB7IHJlYWRkaXJTeW5jIH0gZnJvbSAnZnMnO1xyXG5pbXBvcnQgeyByZWRCcmlnaHQsIGJvbGQgfSBmcm9tICdjaGFsayc7XHJcblxyXG5pbXBvcnQgeyBESVNDT1JEX1BFUk1JU1NJT05TLCBNRVNTQUdFX1RJTUVPVVQsIEVNQkVEX0NPTE9VUlMgfSBmcm9tICcuLi8uLi91dGlscy9jb25zdGFudHMnO1xyXG5cclxuZXhwb3J0ID0gYXN5bmMgKGJvdDogQ2xpZW50LCBtZXNzYWdlOiBNZXNzYWdlKSA9PiB7XHJcblx0aWYgKG1lc3NhZ2UuYXV0aG9yLmJvdCkgcmV0dXJuO1xyXG5cclxuXHRjb25zdCBwcmVmaXg6IHN0cmluZyA9IHByb2Nlc3MuZW52LlBSRUZJWCB8fCAnPyc7XHJcblx0Y29uc3QgY29tbWFuZEFyZ3VtZW50czogc3RyaW5nW10gPSBtZXNzYWdlLmNvbnRlbnQuc2xpY2UocHJlZml4Lmxlbmd0aCkudHJpbSgpLnNwbGl0KC8gKy9nKTtcclxuXHRjb25zdCBpbnB1dHRlZENvbW1hbmQ6IHN0cmluZyA9IGNvbW1hbmRBcmd1bWVudHMuc2hpZnQoKSEudG9Mb3dlckNhc2UoKTtcclxuXHRjb25zdCB3ZWJob29rQ2xpZW50OiBXZWJob29rQ2xpZW50ID0gbmV3IFdlYmhvb2tDbGllbnQoeyBpZDogYCR7QmlnSW50KFN0cmluZyhwcm9jZXNzLmVudi5XRUJIT09LX0lEKSl9YCwgdG9rZW46IGAke3Byb2Nlc3MuZW52LldFQkhPT0tfVE9LRU59YCB9KTtcclxuXHJcblx0aWYgKG1lc3NhZ2UuY29udGVudC5zdGFydHNXaXRoKHByZWZpeCkpIHtcclxuXHRcdGNvbnN0IGNvbW1hbmRGaWxlID0gYm90LmNvbW1hbmRzLmdldChpbnB1dHRlZENvbW1hbmQpIHx8IGJvdC5jb21tYW5kcy5nZXQoYm90LmFsaWFzZXMuZ2V0KGlucHV0dGVkQ29tbWFuZCkpO1xyXG5cdFx0bGV0IG5lZWRlZFBlcm1pc3Npb25zID0gJyc7XHJcblxyXG5cdFx0aWYgKCFjb21tYW5kRmlsZSkgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IHsgY29tbWFuZE5hbWUsIGRldmVsb3Blck9ubHksIHVzZXJQZXJtaXNzaW9ucywgY29tbWFuZFVzYWdlLCBsaW1pdGVkQ2hhbm5lbCB9ID0gY29tbWFuZEZpbGUuY29uZmlnO1xyXG5cclxuXHRcdC8qIC0tLSBERVZFTE9QRVIgT05MWSBDT05GSUdVUkFUSU9OIC0tLSAqL1xyXG5cdFx0aWYgKCFkZXZlbG9wZXJPbmx5ICYmIHJlYWRkaXJTeW5jKCdkaXN0L2NvbW1hbmRzL2Rldi1vbmx5JykuaW5kZXhPZihgJHtjb21tYW5kTmFtZX0uanNgKSA+IC0xKSB7XHJcblx0XHRcdHJldHVybiBjb25zb2xlLmVycm9yKGAke3JlZEJyaWdodCgnRVJST1IhJyl9IERldk9ubHkgY29uZmlnIG9wdGlvbiBub3QgZm91bmQgaW4gY29tbWFuZCBcIiR7Y29tbWFuZE5hbWV9XCIuXFxuJHtyZWRCcmlnaHQoJ0VSUk9SIScpfSBBZGQgdGhlIGZvbGxvd2luZyB0byB5b3VyIGNvbmZpZyBvcHRpb25zLi4uICR7Ym9sZCgnZGV2ZWxvcGVyT25seTogdHJ1ZS9mYWxzZScpfWApO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChkZXZlbG9wZXJPbmx5ID09PSB0cnVlICYmIG1lc3NhZ2UuYXV0aG9yLmlkICE9PSAnMjI5MTQyMTg3MzgyNjY5MzEyJykge1xyXG5cdFx0XHRyZXR1cm4gbWVzc2FnZS5jaGFubmVsLnNlbmQoJ0RldmVsb3BlciBvbmx5IGNvbW1hbmQuJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyogLS0tIFVTRVIgUEVSTUlTU0lPTlMgQ09ORklHVVJBVElPTiAtLS0gKi9cclxuXHRcdGlmICghdXNlclBlcm1pc3Npb25zICYmIHJlYWRkaXJTeW5jKCdkaXN0L2NvbW1hbmRzL3N0YWZmLW9ubHknKS5pbmRleE9mKGAke2NvbW1hbmROYW1lfS5qc2ApID4gLTEpIHtcclxuXHRcdFx0cmV0dXJuIGNvbnNvbGUuZXJyb3IoYCR7cmVkQnJpZ2h0KCdFUlJPUiEnKX0gVXNlclBlcm1pc3Npb25zIGNvbmZpZyBub3QgZm91bmQgaW4gY29tbWFuZCBcIiR7Y29tbWFuZE5hbWV9XCIuXFxuJHtyZWRCcmlnaHQoJ0VSUk9SIScpfSBBZGQgdGhlIGZvbGxvd2luZyB0byB5b3VyIGNvbmZpZyBvcHRpb25zLi4uIFxcblVzZXJQZXJtaXNzaW9uczogJHtESVNDT1JEX1BFUk1JU1NJT05TfWApO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh1c2VyUGVybWlzc2lvbnMpIHtcclxuXHRcdFx0Zm9yIChjb25zdCBwZXJtaXNzaW9uIG9mIHVzZXJQZXJtaXNzaW9ucykge1xyXG5cdFx0XHRcdGNvbnN0IG1hdGNoaW5nUGVybWlzc2lvbnM6IGFueSA9IERJU0NPUkRfUEVSTUlTU0lPTlMuZmluZCgoc2V0VXNlclBlcm0pID0+IHNldFVzZXJQZXJtID09PSBwZXJtaXNzaW9uKTtcclxuXHJcblx0XHRcdFx0aWYgKCFtZXNzYWdlLm1lbWJlcj8ucGVybWlzc2lvbnMuaGFzKG1hdGNoaW5nUGVybWlzc2lvbnMpKSB7XHJcblx0XHRcdFx0XHRuZWVkZWRQZXJtaXNzaW9ucyArPSBgJHttYXRjaGluZ1Blcm1pc3Npb25zfSwgYDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAobmVlZGVkUGVybWlzc2lvbnMpIHtcclxuXHRcdFx0cmV0dXJuIG1lc3NhZ2VcclxuXHRcdFx0XHQucmVwbHkoe1xyXG5cdFx0XHRcdFx0ZW1iZWRzOiBbXHJcblx0XHRcdFx0XHRcdG5ldyBNZXNzYWdlRW1iZWQoKSAvLyBwcmV0dGllci1pZ25vcmVcclxuXHRcdFx0XHRcdFx0XHQuc2V0VGl0bGUoJ/CflJAgSW5jb3JyZWN0IFBlcm1pc3Npb25zJylcclxuXHRcdFx0XHRcdFx0XHQuc2V0RGVzY3JpcHRpb24oYCoqQ29tbWFuZCBOYW1lOioqICR7Y29tbWFuZE5hbWV9XFxuKipQZXJtaXNzaW9ucyBOZWVkZWQ6KiogJHtuZWVkZWRQZXJtaXNzaW9ucy5zdWJzdHJpbmcoMCwgbmVlZGVkUGVybWlzc2lvbnMubGVuZ3RoIC0gMil9YClcclxuXHRcdFx0XHRcdFx0XHQuc2V0Q29sb3IoJyNmOTQzNDMnKVxyXG5cdFx0XHRcdFx0XHRcdC5zZXRGb290ZXIoJ01pc3NpbmcgcmVxdWlyZWQgcGVybWlzc2lvbnMnKSxcclxuXHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRmYWlsSWZOb3RFeGlzdHM6IGZhbHNlLFxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LnRoZW4oKG1zZzogTWVzc2FnZSkgPT4gc2V0VGltZW91dCgoKSA9PiBtc2cuZGVsZXRlKCksIE1FU1NBR0VfVElNRU9VVCkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qIC0tLSBMSU1JVEVEIENIQU5ORUwgQ09ORklHVVJBVElPTiAtLS0gKi9cclxuXHRcdGlmIChtZXNzYWdlLmNoYW5uZWwudHlwZSA9PT0gJ0dVSUxEX1RFWFQnICYmIGxpbWl0ZWRDaGFubmVsICYmIGxpbWl0ZWRDaGFubmVsLnRvTG93ZXJDYXNlKCkgIT09ICdub25lJykge1xyXG5cdFx0XHRpZiAobWVzc2FnZS5jaGFubmVsLm5hbWUubWF0Y2gobGltaXRlZENoYW5uZWwpID09PSBudWxsKSB7XHJcblx0XHRcdFx0cmV0dXJuIG1lc3NhZ2VcclxuXHRcdFx0XHRcdC5yZXBseSh7XHJcblx0XHRcdFx0XHRcdGVtYmVkczogW1xyXG5cdFx0XHRcdFx0XHRcdG5ldyBNZXNzYWdlRW1iZWQoKSAvLyBwcmV0dGllci1pZ25vcmVcclxuXHRcdFx0XHRcdFx0XHRcdC5zZXRUaXRsZShcIvCfk4wgQ2FuJ3QgdXNlIHRoaXMgY2hhbm5lbCFcIilcclxuXHRcdFx0XHRcdFx0XHRcdC5zZXREZXNjcmlwdGlvbihcclxuXHRcdFx0XHRcdFx0XHRcdFx0YFRoZSAqKiR7Y29tbWFuZE5hbWV9KiogY29tbWFuZCBpcyBsaW1pdGVkIHRvIHRoZSAqKiR7bWVzc2FnZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5ndWlsZCEuY2hhbm5lbHMuY2FjaGUuZmlsdGVyKChjaGFubmVsOiBhbnkpID0+IGNoYW5uZWwubmFtZS5tYXRjaChsaW1pdGVkQ2hhbm5lbCkpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Lm1hcCgoY2hhbm5lbCkgPT4gY2hhbm5lbC50b1N0cmluZygpKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5qb2luKCcgb3IgJyl9KiogY2hhbm5lbC4gVHJ5IHJlbG9jYXRpbmcgdG8gdGhhdCBjaGFubmVsIGFuZCB0cnlpbmcgYWdhaW4hYFxyXG5cdFx0XHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHRcdFx0LnNldFRodW1ibmFpbCgnaHR0cHM6Ly9pLmliYi5jby9GRDRDZktuL05vQm9sdHMucG5nJylcclxuXHRcdFx0XHRcdFx0XHRcdC5zZXRDb2xvcihFTUJFRF9DT0xPVVJTLnJlZCksXHJcblx0XHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRcdGZhaWxJZk5vdEV4aXN0czogZmFsc2UsXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0LnRoZW4oKG1zZzogTWVzc2FnZSkgPT4gc2V0VGltZW91dCgoKSA9PiBtc2cuZGVsZXRlKCksIE1FU1NBR0VfVElNRU9VVCkpXHJcblx0XHRcdFx0XHQuY2F0Y2goKGVycjogRXJyb3IpID0+IGNvbnNvbGUubG9nKGBDYXVnaHQgRXJyb3I6ICR7ZXJyfWApKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChtZXNzYWdlLmNoYW5uZWwudHlwZSA9PT0gJ0dVSUxEX1RFWFQnICYmICFsaW1pdGVkQ2hhbm5lbCkge1xyXG5cdFx0XHRpZiAobWVzc2FnZS5jaGFubmVsLm5hbWUubWF0Y2goJ/CfpJZzdGFmZi1jbWRzJykgPT09IG51bGwpIHtcclxuXHRcdFx0XHRyZXR1cm4gbWVzc2FnZVxyXG5cdFx0XHRcdFx0LnJlcGx5KHtcclxuXHRcdFx0XHRcdFx0ZW1iZWRzOiBbXHJcblx0XHRcdFx0XHRcdFx0bmV3IE1lc3NhZ2VFbWJlZCgpIC8vIHByZXR0aWVyLWlnbm9yZVxyXG5cdFx0XHRcdFx0XHRcdFx0LnNldFRpdGxlKFwi8J+TjCBDYW4ndCB1c2UgdGhpcyBjaGFubmVsIVwiKVxyXG5cdFx0XHRcdFx0XHRcdFx0LnNldERlc2NyaXB0aW9uKGBUaGUgKioke2NvbW1hbmROYW1lfSoqIGNvbW1hbmQgaXMgbGltaXRlZCB0byB0aGUgKioke21lc3NhZ2UuZ3VpbGQhLmNoYW5uZWxzLmNhY2hlLmZpbHRlcigoY2hhbm5lbDogYW55KSA9PiBjaGFubmVsLm5hbWUubWF0Y2goJ/CfpJZzdGFmZi1jbWRzJykpLm1hcCgoY2hhbm5lbCkgPT4gY2hhbm5lbC50b1N0cmluZygpKX0qKiBjaGFubmVsLiBUcnkgcmVsb2NhdGluZyB0byB0aGF0IGNoYW5uZWwgYW5kIHRyeWluZyBhZ2FpbiFgKVxyXG5cdFx0XHRcdFx0XHRcdFx0LnNldFRodW1ibmFpbCgnaHR0cHM6Ly9pLmliYi5jby9GRDRDZktuL05vQm9sdHMucG5nJylcclxuXHRcdFx0XHRcdFx0XHRcdC5zZXRDb2xvcihFTUJFRF9DT0xPVVJTLnJlZCksXHJcblx0XHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRcdGZhaWxJZk5vdEV4aXN0czogZmFsc2UsXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0LnRoZW4oKG1zZzogTWVzc2FnZSkgPT4gc2V0VGltZW91dCgoKSA9PiBtc2cuZGVsZXRlKCksIE1FU1NBR0VfVElNRU9VVCkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0LyogLS0tIENPTU1BTkQgVVNBR0VTIENPTkZJR1VSQVRJT04gLS0tICovXHJcblx0XHRpZiAoY29tbWFuZFVzYWdlKSB7XHJcblx0XHRcdGNvbnN0IHVzYWdlQXJyYXkgPSBjb21tYW5kVXNhZ2Uuc3BsaXQoL1sgXSsvKTtcclxuXHRcdFx0Y29uc3QgdXNhZ2VPYmplY3Q6IGFueSA9IHt9O1xyXG5cclxuXHRcdFx0Zm9yIChjb25zdCBlYWNoVXNhZ2Ugb2YgdXNhZ2VBcnJheSkge1xyXG5cdFx0XHRcdGlmIChlYWNoVXNhZ2Uuc3RhcnRzV2l0aCgnPCcpICYmIGVhY2hVc2FnZS5lbmRzV2l0aCgnPicpKSB1c2FnZU9iamVjdFtlYWNoVXNhZ2VdID0gdHJ1ZTtcclxuXHRcdFx0XHRlbHNlIGlmIChlYWNoVXNhZ2Uuc3RhcnRzV2l0aCgnWycpICYmIGVhY2hVc2FnZS5lbmRzV2l0aCgnXScpKSB1c2FnZU9iamVjdFtlYWNoVXNhZ2VdID0gZmFsc2U7XHJcblx0XHRcdFx0ZWxzZSByZXR1cm4gY29uc29sZS5lcnJvcihgJHtyZWRCcmlnaHQoJ0VSUk9SIScpfSB1c2FnZSBjb25maWcgYXJndW1lbnQgaXMgbmVpdGhlciByZXF1aXJlZCA8PiBvciBvcHRpb25hbCBbXVxcbiR7cmVkQnJpZ2h0KCdFUlJPUiEnKX0gVXNhZ2UgYXJndW1lbnQgY29udGVudDogXCIke2VhY2hVc2FnZX1cImApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoY29tbWFuZEFyZ3VtZW50cy5sZW5ndGggPCBjb21tYW5kVXNhZ2UubGVuZ3RoKSB7XHJcblx0XHRcdFx0aWYgKE9iamVjdC52YWx1ZXModXNhZ2VPYmplY3QpW2NvbW1hbmRBcmd1bWVudHMubGVuZ3RoXSA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIG1lc3NhZ2VcclxuXHRcdFx0XHRcdFx0LnJlcGx5KHtcclxuXHRcdFx0XHRcdFx0XHRlbWJlZHM6IFtcclxuXHRcdFx0XHRcdFx0XHRcdG5ldyBNZXNzYWdlRW1iZWQoKSAvL1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQuc2V0VGl0bGUoJ/Cfk4sgSW5jb3JyZWN0IFVzYWdlIScpXHJcblx0XHRcdFx0XHRcdFx0XHRcdC5zZXREZXNjcmlwdGlvbihgSW1wcm9wZXIgdXNhZ2UgZm9yIHRoZSAqKiR7Y29tbWFuZE5hbWV9KiogY29tbWFuZCwgcGxlYXNlIHJlZmVyIGJlbG93LlxcblxcblxcYFxcYFxcYFVzYWdlOiAke3ByZWZpeH0ke2NvbW1hbmROYW1lfSAke2NvbW1hbmRVc2FnZX1cXG5cXG4ke09iamVjdC5rZXlzKHVzYWdlT2JqZWN0KVtjb21tYW5kQXJndW1lbnRzLmxlbmd0aF19IGlzIHJlcXVpcmVkIGZvciB0aGUgY29tbWFuZCB0byBydW4uXFxgXFxgXFxgYClcclxuXHRcdFx0XHRcdFx0XHRcdFx0LnNldENvbG9yKEVNQkVEX0NPTE9VUlMucmVkKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHQuc2V0Rm9vdGVyKCc8PiAtIFJlcXVpcmVkIOKXjyBPcHRpb25hbCAtIFtdJyksXHJcblx0XHRcdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdFx0XHRmYWlsSWZOb3RFeGlzdHM6IGZhbHNlLFxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHQudGhlbigobXNnOiBNZXNzYWdlKSA9PiBzZXRUaW1lb3V0KCgpID0+IG1zZy5kZWxldGUoKSwgTUVTU0FHRV9USU1FT1VUKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dHJ5IHtcclxuXHRcdFx0YXdhaXQgY29tbWFuZEZpbGUucnVuKGJvdCwgbWVzc2FnZSwgY29tbWFuZEFyZ3VtZW50cyk7XHJcblx0XHR9IGNhdGNoIChlcnJvck1lc3NhZ2U6IGFueSkge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKGVycm9yTWVzc2FnZSk7XHJcblxyXG5cdFx0XHRtZXNzYWdlLmNoYW5uZWwuc2VuZCh7XHJcblx0XHRcdFx0ZW1iZWRzOiBbXHJcblx0XHRcdFx0XHRuZXcgTWVzc2FnZUVtYmVkKClcclxuXHRcdFx0XHRcdFx0LnNldFRpdGxlKCfinYwgU29tZXRoaW5nIHdlbnQgd3JvbmchJykgLy8gcHJldHRpZXItaWdub3JlXHJcblx0XHRcdFx0XHRcdC5zZXREZXNjcmlwdGlvbihgVWggb2ghIExvb2tzIGxpa2UgS2Fpb3UgaGFzIGhpdCBzb21lIG9mIHRoZSB3cm9uZyBidXR0b25zLCBjYXVzaW5nIGFuIGVycm9yLiBZb3UgY2FuIHRyeS4uLiBcXG5cXG7igKIgQ29taW5nIGJhY2sgbGF0ZXIgYW5kIHRyeWluZyBhZ2FpblxcbuKAoiBDaGVja2luZyBvdXQgU2Fpa291J3Mgc29jaWFsIG1lZGlhcyB3aGlsc3QgeW91IHdhaXQg8J+Yj2ApXHJcblx0XHRcdFx0XHRcdC5zZXRUaHVtYm5haWwoJ2h0dHBzOi8vaS5pYmIuY28vQzVZdmtKZy80LTEyOC5wbmcnKVxyXG5cdFx0XHRcdFx0XHQuc2V0Q29sb3IoRU1CRURfQ09MT1VSUy5yZWQpLFxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0d2ViaG9va0NsaWVudC5zZW5kKHtcclxuXHRcdFx0XHRlbWJlZHM6IFtcclxuXHRcdFx0XHRcdG5ldyBNZXNzYWdlRW1iZWQoKSAvLyBwcmV0dGllci1pZ25vcmVcclxuXHRcdFx0XHRcdFx0LnNldFRpdGxlKGDinYwgJHtlcnJvck1lc3NhZ2UubmFtZX1gKVxyXG5cdFx0XHRcdFx0XHQuc2V0RGVzY3JpcHRpb24oYCoqRXJyb3IgaW4gdGhlICR7Y29tbWFuZE5hbWV9IGNvbW1hbmQqKlxcbiR7ZXJyb3JNZXNzYWdlfWApXHJcblx0XHRcdFx0XHRcdC5zZXRGb290ZXIoYEVycm9yIE9jY3VyZWQg4oCiICR7Ym90LnVzZXIhLnVzZXJuYW1lfWApXHJcblx0XHRcdFx0XHRcdC5zZXRDb2xvcihFTUJFRF9DT0xPVVJTLnJlZClcclxuXHRcdFx0XHRcdFx0LnNldFRpbWVzdGFtcCgpLFxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuIl19