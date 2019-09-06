import { BrowserView, BrowserWindow, ipcMain } from 'electron';
const { spawn } = require('child_process');
const parser = require('xml2json');
const jp = require('jsonpath');
const os = require('os');

export function setHandlers(win: BrowserWindow) {

    ipcMain.on('get-app-list', async (event, args) => {
        let platform = os.platform();
        let apps: any[] = [];
        switch (platform) {
            case 'darwin':
                apps = await getApplistMac();
                break;
            case 'linux':
                apps = await getApplistLinux();

            default: break;
        }
        event.reply('app-list-get', apps);
    });
}


/**
 * Gets list of apps available in applications folder
 */
function getApplistMac(): Promise<any[]> {


    return new Promise((resolve, reject) => {
        const sp = spawn('system_profiler', ['-xml', 'SPApplicationsDataType']);
        let apps = "";

        let relApps = [];

        sp.stdout.setEncoding('utf-8');
        sp.stdout.on('data', (data) => {
            console.log("DATA------------");
            apps += data;
            console.log("DATA------------");
        });

        sp.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
            reject(data);
        });

        sp.on('close', (code) => {
            let result = parser.toJson(apps, { object: true });
            jp
                .query(result, 'plist.array.dict.array[1].dict')
                .map((res) => {
                    res.forEach((r) => {
                        let name = r.string[0];
                        let path = r.string[3];

                        let relRegex = /^\/Application/;

                        if (relRegex.test(path)) {
                            relApps.push({
                                name, path
                            });
                            console.log(name, path);
                        }
                    });
                })

            resolve(relApps);
        });
    })
}

function getApplistLinux(): Promise<any> {
    return new Promise((resolve, reject) => {
        resolve([]);
    })
}

