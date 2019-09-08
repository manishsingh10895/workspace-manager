import { Component } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { WorkspaceService } from './providers/workspace.service';
import { AppConfig } from '../environments/environment';
import * as shellpath from 'shell-path';
import { shell } from 'electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public electronService: ElectronService,
    private translate: TranslateService,
    private _workspaceService: WorkspaceService
  ) {

    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    process.env.PATH = shellpath.sync();

    console.log(process.env.PATH);

    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }

  ngOnInit() {
    this.listenToEvents();
  }

  ngAfterViewInit() {

  }

  listenToEvents() {
    this.electronService.ipcRenderer.on('open-workspace', (event, args) => {
      console.log(args);
      this._workspaceService.openWorkSpace(args);
    });
  }
}
