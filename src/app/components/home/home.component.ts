import { Component, OnInit, ComponentRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ElectronService } from '../../providers/electron.service';
import { WorkspaceService } from '../../providers/workspace.service';
import { LoaderService } from '../../providers/loader.service';
import { AlertService } from '../../providers/alert.service';
import { DirectoryInfo } from '../../classes/directory-info.class';
import { Program } from '../../classes/program.class';
import { ModalService, PROGRAMS_MODAL } from '../../providers/modal.service';
import { ProgramsModalComponent } from '../../modals/programs-modal/programs-modal.component';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  selectedEditor: { name: string, path: string };

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    directory: new FormGroup({
      path: new FormControl('', [Validators.required]),
      command: new FormControl(''),
      editor: new FormControl('')
    })
  });

  workspaceFolders: Array<DirectoryInfo> = [];

  programs: Array<Program> = [];

  constructor(
    private _elService: ElectronService,
    private _workSpaceService: WorkspaceService,
    private _loader: LoaderService,
    private _alerts: AlertService,
    private _modals: ModalService
  ) {

    if (!this._elService.fs.existsSync(this._workSpaceService.workspsaceStorageFile)) {
      let defaultContent = JSON.stringify({

      });
      this._elService.fs.writeFileSync(this._workSpaceService.workspsaceStorageFile, defaultContent);
    }

    let contents = this._elService.fs.readFileSync(this._workSpaceService.workspsaceStorageFile);
    console.log(contents);

  }

  /**
   * Opens a folder selector
   */
  showFolders() {
    let input: HTMLInputElement = document.createElement('input') as HTMLInputElement;
    input.type = 'file';
    input.setAttribute('directory', 'true');
    input.setAttribute('webkitdirectory', 'true');

    input.dispatchEvent(new MouseEvent('click'));

    input.addEventListener('change', (e: any) => {
      let files = e.path[0].files as FileList;
      let dPath = files.item(0).path;

      this.form.get('directory').get('path').setValue(dPath);
    });
  }

  showPrograms() {
    let modalRef: ComponentRef<any> = this._modals.renderModal(ProgramsModalComponent, {
      data: {
        onClose: (program: Program) => {
          console.log(program);
        }
      }
    });

    modalRef.instance.onClose.subscribe((s) => {
      this._setProgram(s);
    });
  }

  /**
   * Sets a program, to open the directory with
   * @param program program to set as an editor
   */
  _setProgram(program) {
    // None is for null 
    if (program.name.toLowerCase() == 'none') {
      program = null;
    }

    this.form.get('directory').get('editor').setValue(program);
    this.selectedEditor = program;
  }

  saveWorkspace() {
    if (!this.workspaceFolders.length) {
      this._alerts.showError("Invalid Workspace Details");
      return;
    }

    let name = this.form.get('name').value;

    let currentWorkspace = {};

    currentWorkspace[name] = {
      directories: this.workspaceFolders
    };


    let savedWorkspacesJSONSTRING = this._elService.fs.readFileSync(this._workSpaceService.workspsaceStorageFile).toString("utf-8");

    let savedWorkSpaces = JSON.parse(savedWorkspacesJSONSTRING);

    console.log(savedWorkSpaces);

    savedWorkSpaces[name] = {
      directories: this.workspaceFolders
    };

    this._elService.fs.writeFileSync(this._workSpaceService.workspsaceStorageFile, JSON.stringify(savedWorkSpaces));

    this._alerts.showSuccess("Workspace Saved");

    this.form.reset();

    this.workspaceFolders = [];

    //Send add update to main
    this._elService.ipcRenderer.emit('workspaces-updated');
  }

  _checkIfAlreadyExists(arr: Array<any>, predicate) {
    let x = arr.find(predicate)

    return !!x;
  }

  async addDirectory() {
    this._loader.showLoader();

    let directory: DirectoryInfo = this.form.get('directory').value;

    console.log(directory);

    try {

      await this._addDirectory(directory);

      this.form.get('directory').reset();

    } catch (e) {
      console.error(e)
      this._alerts.showError(e.message);
    } finally {
      this._loader.hideLoader();
    }

  }

  async _addDirectory(directory: DirectoryInfo): Promise<any> {
    return new Promise((resolve, reject) => {
      this._elService.fs.exists(directory.path, (exists) => {

        if (!exists) return reject(new Error("Directory Doesn't exist"));

        if (this._checkIfAlreadyExists(this.workspaceFolders, (w: DirectoryInfo) => {
          return w.path == directory.path
        })) {
          return reject(new Error("Directory already added"));
        }

        this.workspaceFolders.push(directory);

        resolve();
      });
    });
  }

  ngOnInit() {
    this._workSpaceService.getAvailablePrograms()
      .subscribe((res) => {
      }, err => {
      })
  }

  ngAfterViewInit() {
    //Initialize popup
    $('#showProgBtn').popup();
  }

}
