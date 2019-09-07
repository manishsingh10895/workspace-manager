import { Component, OnInit, Input, Renderer2 } from '@angular/core';
import { Workspace } from '../../classes/workspace.class';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DirectoryInfo } from '../../classes/directory-info.class';
import { AlertService } from '../../providers/alert.service';
import { WorkspaceService } from '../../providers/workspace.service';
import { LoaderService } from '../../providers/loader.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {

  @Input() workspace: Workspace;

  editingDirectory: DirectoryInfo = { path: '', command: '' };

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required])
  });

  constructor(
    private _router: Router,
    private _renderer: Renderer2,
    private _alerts: AlertService,
    private _route: ActivatedRoute,
    private _loader: LoaderService,
    private _workspaceService: WorkspaceService
  ) { }

  goHome() {
    this._router.navigate(['/home']);
  }

  async _getWorkspaceFromRoute() {

    this._loader.showLoader();

    this._route.params.subscribe(async (params) => {
      let name = params.name;

      try {
        let workspace = await this._workspaceService.readWorkspaceByName(name);

        this.workspace = {
          name: name,
          directories: workspace.directories
        };

        console.log(workspace);
      } catch (e) {
        console.error(e);
        this._alerts.showError(e.message);
      } finally {
        this._loader.hideLoader();
      }

    }, (err) => {
      console.error(err);

      this._alerts.showError("Some error occured");

      this._loader.hideLoader();
    })
  }


  async saveDirectory(workspace: HTMLElement, d: DirectoryInfo | any, i: number) {
    let exists = await this._workspaceService.verifyPathExists(d.path);

    if (!exists) {
      this._alerts.showError("Path doesn't exist");
      return;
    }

    try {
      let workspaceData: any = {};
      Object.assign(workspaceData, this.workspace);
      delete workspaceData.name;


      d.editable = undefined;
      this.workspace.directories[i] = d;

      console.log(this.workspace);

      await this._workspaceService.writeWorkspaceByName(this.workspace.name, this.workspace)

      this.makeUneditable(workspace, d);
    } catch (e) {
      console.error(e);
      this._alerts.showError(e.message);
    }
  }

  makeEditable(workspace: HTMLElement, directory) {
    let inputs: NodeList = workspace.querySelectorAll('.input input');

    for (let i = 0; i < inputs.length; i++) {
      this._renderer.removeAttribute(inputs[i], 'disabled');
    }

    directory.editable = true;
  }

  /**
   * makes a directory
   * @param workspace workspace element
   * @param directory directory to edit
   */
  makeUneditable(workspace: HTMLElement, directory) {
    let inputs: NodeList = workspace.querySelectorAll('.input input');

    for (let i = 0; i < inputs.length; i++) {
      this._renderer.setAttribute(inputs[i], 'disabled', 'true');
    }

    directory.editable = false;
  }

  removeItem(i: number, d: DirectoryInfo) {

  }

  ngOnInit() {
    this._getWorkspaceFromRoute();
  }

}
