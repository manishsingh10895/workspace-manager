import { Injectable, RendererFactory2, ApplicationRef, ComponentFactoryResolver, Injector, Type, EmbeddedViewRef, Inject, ComponentRef } from '@angular/core';
import { Subject } from 'rxjs';
declare var $: any;

export const PROGRAMS_MODAL: string = "#programs-modal";

const MODAL_CONTAINER = '.app-modal-container';
const MODAL_OVERLAY = '.app-modal-overlay';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modalComponents = [];

  modalDataSubject$: Subject<any> = new Subject<any>();
  modalData = this.modalDataSubject$.asObservable();

  constructor(
    private _rendererFactory: RendererFactory2,
    private _appRef: ApplicationRef,
    private _cfr: ComponentFactoryResolver,
    @Inject('DOCUMENT') private _document: Document,
    private _injector: Injector,
  ) { }

  openModal(modalName: string) {
    this._modalAction('show', modalName);
  }

  /**
   * Renders a Component as Modal
   * @param modalComponent Component to render
   * @param injectConfig Data to inject
   * @param container html element to render the component in
   */
  renderModal(modalComponent: Type<{}>, injectConfig, timeout?, container = null) {
    let renderer = this._rendererFactory.createRenderer(null, null);

    const modalRef: ComponentRef<any> = this._cfr
      .resolveComponentFactory(modalComponent)
      .create(this._injector);


    modalRef.instance.title = injectConfig.title;

    modalRef.instance.data = injectConfig.data;

    modalRef.instance._modalRef = modalRef;

    modalRef.instance.destroy = () => {
      this.removeModal(modalComponent);
    };

    this.modalComponents.push(modalRef);

    this._appRef.attachView(modalRef.hostView);

    const childDomElem = (modalRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    if (!container) container = this._document.querySelector(MODAL_CONTAINER);

    container.appendChild(childDomElem);

    let overlay = this._document.querySelector(MODAL_OVERLAY);
    renderer.removeClass(overlay, 'hidden');
    renderer.removeClass(container, 'hidden');


    // Close automatically if timeout provided
    if (timeout) {
      let t = setTimeout(() => {
        this.removeModal(modalComponent);
        clearTimeout(t);
      }, timeout);
    }

    return modalRef;
  }

  /**
   * Removes render component from view
   * @param modalComponent Component to remove
   */
  public removeModal(modalComponent) {
    let renderer = this._rendererFactory.createRenderer(null, null);

    let component;
    let index;
    this.modalComponents.forEach((comp, i) => {
      if (comp.instance instanceof modalComponent) { component = comp; index = i }
    });

    if (component) {
      this._appRef.detachView(component.hostView);
      component.destroy();
      this.modalComponents.splice(index, 1);
    }

    let container = this._document.querySelector(MODAL_CONTAINER);
    let overlay = this._document.querySelector(MODAL_OVERLAY);

    renderer.addClass(container, 'hidden');
    renderer.addClass(overlay, 'hidden');
  }

  private _modalAction(action: string, modalName: string) {

    $(`${modalName}`)
      .modal(action);

  }

  closeModal(modalName: string) {
    this._modalAction('hide', modalName);
  }
}
