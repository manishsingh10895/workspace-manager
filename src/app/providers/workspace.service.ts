import { Injectable } from '@angular/core';

import { AppConfig } from '../../environments/environment';
import { ElectronService } from './electron.service';
import { DirectoryInfo } from '../classes/directory-info.class';
import { Workspace } from '../classes/workspace.class';
import { Program } from '../classes/program.class';
import { ipcMain, ipcRenderer } from 'electron';
import { from, Observable } from 'rxjs';

interface OpenConfig {
  editors: number[],
  scripts: number[]
}

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  openedWorkspaces: {
    [id: string]: Workspace
  }

  workspaces: {
    [id: string]: Workspace
  };

  programList: Array<Program> = [];

  get workspsaceStorageFile() {
    console.log(this._elService.os.homedir());
    return this._elService.os.homedir() + '/' + AppConfig.WORKSPACES_STORAGE_FILE;
  }

  getWorkspaceFileContent(): Promise<string> {
    return new Promise(() => {

    });
  }

  getWorkspaces() {
    let content = this._elService.fs.readFileSync(this.workspsaceStorageFile).toString('utf-8');
    let json = JSON.parse(content);

    console.log(json);

    return Object.keys(json)
      .map(k => {
        let name = k;
        let directories = json[k].directories;

        return {
          name, directories
        };
      });
  }

  private _getAvailablePrograms(): Promise<Program[]> {
    return new Promise((resolve, reject) => {

      if (this.programList.length) {
        return resolve(this.programList);
      } else {
        ipcRenderer.on('app-list-get', (event, args) => {
          console.log(args);
          this.programList = args;
          resolve(args);
        });

        ipcRenderer.send('get-app-list');
      }
    });
  }

  getAvailablePrograms(): Observable<Program[]> {
    let promise = this._getAvailablePrograms()
      .then(progs => {
        let ar = progs.map(x => x);
        ar.unshift({ name: 'None', path: '' });
        return ar;
    });
    return from(promise);
  }

  getInitCommandScript(d: DirectoryInfo): string {
    let platform = this._elService.os.platform();

    if (!d.command) return "";

    switch (platform) {
      case 'darwin': return `osascript -e 'tell app "Terminal"
      set currentTab to do script "cd ${d.path}"
      delay 0.01
      do script "${d.command}" in currentTab
      end tell'
      `;
      //ADD COMMAND FOR LINUX
      case 'linux': return

      default: return `gnome-terminal -c "${d.command}"`
    }
  }

  /**
   * Reads a workspace by name from file
   * @param name name of workspace
   */
  readWorkspaceByName(name: string): Promise<Workspace> {
    return new Promise((resolve, reject) => {
      this._elService.fs.readFile(this.workspsaceStorageFile, (err, data) => {
        let workspaceString = data.toString('utf-8');

        try {
          let workspaces = JSON.parse(workspaceString);

          if (!workspaces[name]) {
            throw new Error("No workspace found with the name");
          }

          return resolve(workspaces[name]);
        } catch (e) {
          reject(new Error(e));
        }
      });
    });
  }


  /**
   * Edits a workspaces, and saves to file
   */
  async writeWorkspaceByName(name, workspaceData): Promise<string> {
    return new Promise(async (resolve, reject) => {

      let data = await this.readWorkspaceFile();

      try {

        let workspaces = JSON.parse(data);

        workspaces[name] = workspaceData;

        await this.writeToWorkspaceFile(JSON.stringify(workspaces));

        resolve();

      } catch (e) {
        console.error(e);
        reject(e);
      }

    });
  }

  /**
   * Opens up the workspace
   * @param workspace workspace to open
   */
  openWorkSpace(workspace: Workspace) {
    console.log(workspace);
    try {

      let openConfig: OpenConfig = {
        editors: [],
        scripts: []
      };

      if (workspace.directories && workspace.directories.length) {

        let directories = workspace.directories;

        let openedConfigs = [];

        directories.forEach((d: DirectoryInfo) => {
          let editor_text = d.editor ? 'open -a' + d.editor.path.split(' ').join('\\ ') : 'code';

          let editor_cmd = `${editor_text} ${d.path}`;

          console.log(editor_cmd);

          let cmd = this._elService.childProcess.exec(editor_cmd);
          cmd.on('error', (err) => {
            console.error(err);
          })

          cmd.on('message', (err) => {
            console.log(err);
          })

          cmd.on('exit', (e) => {
            console.log(e);
          })
          console.log(d);

          //Add to open config
          openConfig.editors.push(cmd.pid);

          let initScript = this.getInitCommandScript(d);

          console.log(initScript);

          if (initScript) {
            cmd = this._elService.childProcess.exec(initScript);

            cmd.on('exit', (code) => {
              console.log(code);
            });

            cmd.on('error', (err) => {
              console.error(err);
            })

            cmd.stderr.on('error', e => {
              console.error(e);
            })

            cmd.stdout.on('data', e => {
              console.log(e);
            })

            cmd.on('message', (message) => {
              console.log(message);
            })

            openConfig.scripts.push(cmd.pid);
          }

          openedConfigs.push(openConfig);
        });

        // this.openedWorkspaces[workspace.name] = openedConfigs;

        console.log(this.openedWorkspaces);
      }

    } catch (e) {
      console.error(e);
    }
  }


  /**
   * Verifies if path exists
   * @param path path of the file
   */
  verifyPathExists(path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._elService.fs.exists(path, (exists) => {
        resolve(exists);
      });
    });
  }

  readWorkspaceFile(): Promise<string> {
    return new Promise((resolve, reject) => {
      this._elService.fs.readFile(this.workspsaceStorageFile, (err, data) => {
        if (err) {
          return reject(err);
        }

        resolve(data.toString('utf-8'));
      })
    });
  }

  writeToWorkspaceFile(data: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this._elService.fs.writeFile(this.workspsaceStorageFile, data, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      })
    });
  }


  constructor(
    private _elService: ElectronService
  ) {
  }
}
