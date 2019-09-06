import { Component, OnInit, EventEmitter, ComponentRef } from '@angular/core';
import { WorkspaceService } from '../../providers/workspace.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Program } from '../../classes/program.class';
import { LoaderService } from '../../providers/loader.service';
import { ModalService, PROGRAMS_MODAL } from '../../providers/modal.service';

@Component({
  selector: 'app-programs-modal',
  templateUrl: './programs-modal.component.html',
  styleUrls: ['./programs-modal.component.scss']
})
export class ProgramsModalComponent implements OnInit {

  programs$: Observable<Program[]>;

  onClose: EventEmitter<any> = new EventEmitter();

  _modalRef: ComponentRef<any>;

  constructor(
    private _workspaceService: WorkspaceService,
    private _loader: LoaderService,
    private _modals: ModalService,

  ) { }

  selectProgram(program: Program) {
    this.onClose.emit(program);
    this._modalRef.instance.destroy();
  }

  ngOnInit() {
    this._loader.showLoader();
    this.programs$ = this._workspaceService.getAvailablePrograms()
      .pipe(
        tap(() => {
          this._loader.hideLoader();
        })
      )
  }



}
