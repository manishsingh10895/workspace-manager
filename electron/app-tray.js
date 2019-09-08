"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var os = require("os");
var fs = require("fs");
function getWorkspsaceStorageFile() {
    return os.homedir() + '/' + "workspaces.json";
}
function getWorkspaces() {
    var content = fs.readFileSync(getWorkspsaceStorageFile()).toString('utf-8');
    var json = JSON.parse(content);
    return Object.keys(json)
        .map(function (k) {
        var name = k;
        var directories = json[k].directories;
        return {
            name: name, directories: directories
        };
    });
}
function open(workspace, win) {
    console.log("event open-workspace");
    win.webContents.send('open-workspace', workspace);
}
/**
 * Build the initial app tray
 */
function buildAppTray(tray, win) {
    console.log(__dirname);
    var workspaces = getWorkspaces();
    var template = [{
            type: 'normal', label: "workspaces"
        }];
    workspaces.forEach(function (w) {
        template.push({
            label: w.name,
            type: 'normal',
            click: function () { return open(w, win); }
        });
    });
    var contextMenu = electron_1.Menu.buildFromTemplate(template);
    tray.setContextMenu(contextMenu);
    tray.setToolTip('Workspace Manager');
    tray.on('click', function (e) {
        console.log(e);
        var n = new electron_1.Notification({
            title: 'Workspace Manager',
            body: JSON.stringify(e)
        });
        n.show();
    });
    exports.AppTray = tray;
    console.log(tray);
}
exports.buildAppTray = buildAppTray;
function UpdateAppTray(win) {
    var workspaces = getWorkspaces();
    var template = [];
    workspaces.forEach(function (w) {
        template.push({
            label: w.name,
            type: 'normal',
            click: function () { return open(w, win); }
        });
    });
    var contextMenu = electron_1.Menu.buildFromTemplate(template);
    exports.AppTray.setContextMenu(contextMenu);
}
exports.UpdateAppTray = UpdateAppTray;
//# sourceMappingURL=app-tray.js.map