import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[wmEditable]'
})
export class EditableDirective {

  @HostListener('click')
  click(e) {
    console.log(e);

    this._el.nativeElement.contentEditable = "true";
  }

  @HostListener('document:click', ["$event"])
  documentClick(e) {

    this._el.nativeElement.contentEditable = "false";
  }

  constructor(
    private _el: ElementRef
  ) { }

}
