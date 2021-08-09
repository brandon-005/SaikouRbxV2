"use strict";
const chalk_1 = require("chalk");
const fs_1 = require("fs");
module.exports = (bot) => {
    const load = (directories) => {
        let events = [];
        try {
            events = fs_1.readdirSync(`${__dirname}/../events/${directories}/`).filter((directoryFile) => directoryFile.endsWith('.js'));
        }
        catch {
            return console.error(`${chalk_1.redBright('ERROR!')} The event folder "${directories}" couldn't be loaded.\n${chalk_1.redBright('ERROR!')} Please ensure a file is added in it to be loaded.`);
        }
        for (const eventFile of events) {
            const event = require(`${__dirname}/../events/${directories}/${eventFile}`);
            const eventName = eventFile.split('.')[0];
            try {
                bot.on(eventName, event.bind(null, bot));
            }
            catch {
                return console.error(`${chalk_1.redBright('ERROR!')} The event file "${eventFile}" couldn't be loaded.\n${chalk_1.redBright('ERROR!')} Please ensure an export is included within the file.`);
            }
        }
    };
    ['bot', 'cmd-handler'].forEach((folder) => load(folder));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZC1ldmVudHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGFuZGxlcnMvbG9hZC1ldmVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLGlDQUFrQztBQUNsQywyQkFBaUM7QUFFakMsaUJBQVMsQ0FBQyxHQUFXLEVBQUUsRUFBRTtJQUN4QixNQUFNLElBQUksR0FBRyxDQUFDLFdBQW1CLEVBQUUsRUFBRTtRQUNwQyxJQUFJLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFFMUIsSUFBSTtZQUNILE1BQU0sR0FBRyxnQkFBVyxDQUFDLEdBQUcsU0FBUyxjQUFjLFdBQVcsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBcUIsRUFBRSxFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ2hJO1FBQUMsTUFBTTtZQUNQLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLGlCQUFTLENBQUMsUUFBUSxDQUFDLHNCQUFzQixXQUFXLDBCQUEwQixpQkFBUyxDQUFDLFFBQVEsQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO1NBQy9LO1FBRUQsS0FBSyxNQUFNLFNBQVMsSUFBSSxNQUFNLEVBQUU7WUFDL0IsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEdBQUcsU0FBUyxjQUFjLFdBQVcsSUFBSSxTQUFTLEVBQUUsQ0FBQyxDQUFDO1lBQzVFLE1BQU0sU0FBUyxHQUFRLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFL0MsSUFBSTtnQkFDSCxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ3pDO1lBQUMsTUFBTTtnQkFDUCxPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxpQkFBUyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsU0FBUywwQkFBMEIsaUJBQVMsQ0FBQyxRQUFRLENBQUMsdURBQXVELENBQUMsQ0FBQzthQUM5SztTQUNEO0lBQ0YsQ0FBQyxDQUFDO0lBQ0YsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUMxRCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDbGllbnQgfSBmcm9tICdkaXNjb3JkLmpzJztcclxuaW1wb3J0IHsgcmVkQnJpZ2h0IH0gZnJvbSAnY2hhbGsnO1xyXG5pbXBvcnQgeyByZWFkZGlyU3luYyB9IGZyb20gJ2ZzJztcclxuXHJcbmV4cG9ydCA9IChib3Q6IENsaWVudCkgPT4ge1xyXG5cdGNvbnN0IGxvYWQgPSAoZGlyZWN0b3JpZXM6IHN0cmluZykgPT4ge1xyXG5cdFx0bGV0IGV2ZW50czogc3RyaW5nW10gPSBbXTtcclxuXHJcblx0XHR0cnkge1xyXG5cdFx0XHRldmVudHMgPSByZWFkZGlyU3luYyhgJHtfX2Rpcm5hbWV9Ly4uL2V2ZW50cy8ke2RpcmVjdG9yaWVzfS9gKS5maWx0ZXIoKGRpcmVjdG9yeUZpbGU6IHN0cmluZykgPT4gZGlyZWN0b3J5RmlsZS5lbmRzV2l0aCgnLmpzJykpO1xyXG5cdFx0fSBjYXRjaCB7XHJcblx0XHRcdHJldHVybiBjb25zb2xlLmVycm9yKGAke3JlZEJyaWdodCgnRVJST1IhJyl9IFRoZSBldmVudCBmb2xkZXIgXCIke2RpcmVjdG9yaWVzfVwiIGNvdWxkbid0IGJlIGxvYWRlZC5cXG4ke3JlZEJyaWdodCgnRVJST1IhJyl9IFBsZWFzZSBlbnN1cmUgYSBmaWxlIGlzIGFkZGVkIGluIGl0IHRvIGJlIGxvYWRlZC5gKTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGNvbnN0IGV2ZW50RmlsZSBvZiBldmVudHMpIHtcclxuXHRcdFx0Y29uc3QgZXZlbnQgPSByZXF1aXJlKGAke19fZGlybmFtZX0vLi4vZXZlbnRzLyR7ZGlyZWN0b3JpZXN9LyR7ZXZlbnRGaWxlfWApO1xyXG5cdFx0XHRjb25zdCBldmVudE5hbWU6IGFueSA9IGV2ZW50RmlsZS5zcGxpdCgnLicpWzBdO1xyXG5cclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRib3Qub24oZXZlbnROYW1lLCBldmVudC5iaW5kKG51bGwsIGJvdCkpO1xyXG5cdFx0XHR9IGNhdGNoIHtcclxuXHRcdFx0XHRyZXR1cm4gY29uc29sZS5lcnJvcihgJHtyZWRCcmlnaHQoJ0VSUk9SIScpfSBUaGUgZXZlbnQgZmlsZSBcIiR7ZXZlbnRGaWxlfVwiIGNvdWxkbid0IGJlIGxvYWRlZC5cXG4ke3JlZEJyaWdodCgnRVJST1IhJyl9IFBsZWFzZSBlbnN1cmUgYW4gZXhwb3J0IGlzIGluY2x1ZGVkIHdpdGhpbiB0aGUgZmlsZS5gKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblx0Wydib3QnLCAnY21kLWhhbmRsZXInXS5mb3JFYWNoKChmb2xkZXIpID0+IGxvYWQoZm9sZGVyKSk7XHJcbn07XHJcbiJdfQ==