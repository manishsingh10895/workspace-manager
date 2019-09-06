import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';

@Injectable({
  providedIn: 'root'
})
export class FileSystemService {

  constructor(
    private _els: ElectronService
  ) { }

}
