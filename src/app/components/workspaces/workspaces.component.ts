import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';
import { WorkspaceService } from '../../providers/workspace.service';
import { DirectoryInfo } from '../../classes/directory-info.class';
import { Workspace } from '../../classes/workspace.class';
import { Router } from '@angular/router';
import { AlertService } from '../../providers/alert.service';
import { incomingStagger, growShrink } from '../../animations';

const WORKSPACES_STORAGE_FILE = 'workspaces.json';

@Component({
  selector: 'app-workspaces',
  templateUrl: './workspaces.component.html',
  styleUrls: ['./workspaces.component.scss'],
  animations: [
    incomingStagger,
    growShrink
  ]
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
    this.workspaces = this._workspaceService.getWorkspaces();

    this._elService.ipcRenderer.emit('workspaces-loaded');
  }

  open(workspace: Workspace) {

    this._workspaceService.openWorkSpace(workspace);

    let notification = new Notification('Workspace Opened', {
      body: workspace.name
    });
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

    this._elService.ipcRenderer.emit('workspaces-updated')
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
