import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../providers/loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  active$: Observable<boolean>;

  constructor(
    private _loader: LoaderService
  ) { }

  ngOnInit() {
    this.active$ = this._loader.loader$
  }

}
