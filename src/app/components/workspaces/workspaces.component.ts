import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';
import { WorkspaceService } from '../../providers/workspace.service';
import { DirectoryInfo } from '../../classes/directory-info.class';
import { Workspace } from '../../classes/workspace.class';
import { Router } from '@angular/router';
import { AlertService } from '../../providers/alert.service';

const WORKSPACES_STORAGE_FILE = 'workspaces.json';

interface OpenConfig {
  editors: number[],
  scripts: number[]
}

@Component({
  selector: 'app-workspaces',
  templateUrl: './workspaces.component.html',
  styleUrls: ['./workspaces.component.scss']
})
export class WorkspacesComponent implements OnInit {

  workspaces: Array<any> = [];

  openedWorkspaces: {
    [id: string]: any
  } = {};

  constructor(
    private _elService: ElectronService,
    private _router: Router,
    private _alerts: AlertService,
    private _workspaceService: WorkspaceService
  ) { }

  ngOnInit() {

    let content = this._elService.fs.readFileSync(this._workspaceService.workspsaceStorageFile).toString('utf-8');
    let json = JSON.parse(content);

    console.log(json);

    this.workspaces = Object.keys(json)
      .map(k => {
        let name = k;
        let directories = json[k].directories;

        return {
          name, directories
        };
      });

    console.log(this.workspaces);
  }

  open(workspace: Workspace) {

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
          let cmd = this._elService.childProcess.exec(`code ${d.path}`);
          cmd.on('error', (err) => {
            console.error(err);
          })

          cmd.on('exit', (e) => {
            console.log(e);
          })
          console.log(d);

          //Add to open config
          openConfig.editors.push(cmd.pid);

          let initScript = this._workspaceService.getInitCommandScript(d);

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

        this.openedWorkspaces[workspace.name] = openedConfigs;

        console.log(this.openedWorkspaces);
      }

    } catch (e) {
      console.error(e);
    }

  }

  /***
   * Closes all the editors and scripts
   * in a workspace
   */
  closeWorkspace(workspace: Workspace) {
    if (!this.openedWorkspaces[workspace.name]) {
      this._alerts.showError('This workspace is not opened');
      return;
    }

    let openedConfigs: Array<OpenConfig> = this.openedWorkspaces[workspace.name];

    openedConfigs.forEach(oc => {
      oc.editors.forEach(c => {
        this.killProcess(c);
      })

      oc.scripts.forEach(s => {
        this.killProcess(s);
      })
    });
  }

  remove(workspace: Workspace) {
    let s = window.confirm("Are you sure ?");

    if (!s) {
      return;
    }

    this.workspaces = this.workspaces.filter(w => w.name != workspace.name);

    let savedWorkspacesJSONSTRING = this._elService.fs.readFileSync(this._workspaceService.workspsaceStorageFile).toString("utf-8");

    let savedWorkSpaces = JSON.parse(savedWorkspacesJSONSTRING);

    delete savedWorkSpaces[workspace.name];

    this._elService.fs.writeFileSync(this._workspaceService.workspsaceStorageFile, JSON.stringify(savedWorkSpaces));

    alert("Workspace deleted");
  }

  edit(workspace: Workspace) {
    this._router.navigate([`/workspace/${workspace.name}`]);
  }

  killProcess(pid: number) {
    let cmd = this._elService.childProcess.exec(`kill -9 ${pid}`);

    cmd.on('exit', (s) => {
      console.log(s);
    })

    cmd.on('error', (e) => {
      console.error(e);
    })
  }

}
