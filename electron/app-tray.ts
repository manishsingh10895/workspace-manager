import { Tray, Menu, Notification, MenuItemConstructorOptions, ipcMain, BrowserWindow } from 'electron';
import { AppConfig } from '../src/environments/environment';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

export let AppTray: Tray;

function getWorkspsaceStorageFile() {
    return os.homedir() + '/' + "workspaces.json";
}


function getWorkspaces() {
    let content = fs.readFileSync(getWorkspsaceStorageFile()).toString('utf-8');
    let json = JSON.parse(content);

    return Object.keys(json)
        .map(k => {
            let name = k;
            let directories = json[k].directories;

            return {
                name, directories
            };
        });
}

function open(workspace, win: BrowserWindow) {

    console.log("event open-workspace");
    win.webContents.send('open-workspace', workspace);
}

/**
 * Build the initial app tray
 */
export function buildAppTray(tray: Tray, win: BrowserWindow) {
    console.log(__dirname);
    let workspaces = getWorkspaces();


    let template: Array<MenuItemConstructorOptions> = [];

    workspaces.forEach((w) => {
        template.push({
            label: w.name,
            type: 'normal',
            click: () => open(w, win)
        })
    });

    template.push({
        label: 'Quit',
        type: 'normal',
        click: () => {
            ipcMain.emit('close');
        }
    })

    const contextMenu = Menu.buildFromTemplate(template);

    tray.setContextMenu(contextMenu);

    tray.setToolTip('Workspace Manager');

    tray.on('click', (e) => {
        console.log(e);
        let n = new Notification({
            title: 'Workspace Manager',
            body: JSON.stringify(e)
        })

        n.show();
    });

    AppTray = tray;

    console.log(tray);
}

export function UpdateAppTray(win: BrowserWindow) {
    let workspaces = getWorkspaces();
    let template: Array<MenuItemConstructorOptions> = [];

    workspaces.forEach((w) => {
        template.push({
            label: w.name,
            type: 'normal',
            click: () => open(w, win)
        })
    });

    const contextMenu = Menu.buildFromTemplate(template);

    AppTray.setContextMenu(contextMenu);
}
