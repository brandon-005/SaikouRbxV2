"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeholder = exports.errorEmbed = void 0;
const discord_js_1 = require("discord.js");
const constants_1 = require("./constants");
function errorEmbed(webhookClient, bot, title, errorMessage) {
    return webhookClient.send({
        embeds: [
            new discord_js_1.MessageEmbed() // prettier-ignore
                .setTitle(`❌ ${title}`)
                .setDescription(errorMessage)
                .setFooter(`Error Occured • ${bot.user.username}`)
                .setColor(constants_1.EMBED_COLOURS.red)
                .setTimestamp(),
        ],
    });
}
exports.errorEmbed = errorEmbed;
function placeholder() {
    console.log('hello');
}
exports.placeholder = placeholder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1iZWRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2VtYmVkcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBaUU7QUFDakUsMkNBQTRDO0FBRTVDLFNBQWdCLFVBQVUsQ0FBQyxhQUE0QixFQUFFLEdBQVcsRUFBRSxLQUFhLEVBQUUsWUFBb0I7SUFDeEcsT0FBTyxhQUFhLENBQUMsSUFBSSxDQUFDO1FBQ3pCLE1BQU0sRUFBRTtZQUNQLElBQUkseUJBQVksRUFBRSxDQUFDLGtCQUFrQjtpQkFDbkMsUUFBUSxDQUFDLEtBQUssS0FBSyxFQUFFLENBQUM7aUJBQ3RCLGNBQWMsQ0FBQyxZQUFZLENBQUM7aUJBQzVCLFNBQVMsQ0FBQyxtQkFBbUIsR0FBRyxDQUFDLElBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztpQkFDbEQsUUFBUSxDQUFDLHlCQUFhLENBQUMsR0FBRyxDQUFDO2lCQUMzQixZQUFZLEVBQUU7U0FDaEI7S0FDRCxDQUFDLENBQUM7QUFDSixDQUFDO0FBWEQsZ0NBV0M7QUFFRCxTQUFnQixXQUFXO0lBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDdEIsQ0FBQztBQUZELGtDQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2xpZW50LCBXZWJob29rQ2xpZW50LCBNZXNzYWdlRW1iZWQgfSBmcm9tICdkaXNjb3JkLmpzJztcclxuaW1wb3J0IHsgRU1CRURfQ09MT1VSUyB9IGZyb20gJy4vY29uc3RhbnRzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBlcnJvckVtYmVkKHdlYmhvb2tDbGllbnQ6IFdlYmhvb2tDbGllbnQsIGJvdDogQ2xpZW50LCB0aXRsZTogc3RyaW5nLCBlcnJvck1lc3NhZ2U6IHN0cmluZykge1xyXG5cdHJldHVybiB3ZWJob29rQ2xpZW50LnNlbmQoe1xyXG5cdFx0ZW1iZWRzOiBbXHJcblx0XHRcdG5ldyBNZXNzYWdlRW1iZWQoKSAvLyBwcmV0dGllci1pZ25vcmVcclxuXHRcdFx0XHQuc2V0VGl0bGUoYOKdjCAke3RpdGxlfWApXHJcblx0XHRcdFx0LnNldERlc2NyaXB0aW9uKGVycm9yTWVzc2FnZSlcclxuXHRcdFx0XHQuc2V0Rm9vdGVyKGBFcnJvciBPY2N1cmVkIOKAoiAke2JvdC51c2VyIS51c2VybmFtZX1gKVxyXG5cdFx0XHRcdC5zZXRDb2xvcihFTUJFRF9DT0xPVVJTLnJlZClcclxuXHRcdFx0XHQuc2V0VGltZXN0YW1wKCksXHJcblx0XHRdLFxyXG5cdH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGxhY2Vob2xkZXIoKSB7XHJcblx0Y29uc29sZS5sb2coJ2hlbGxvJyk7XHJcbn1cclxuIl19