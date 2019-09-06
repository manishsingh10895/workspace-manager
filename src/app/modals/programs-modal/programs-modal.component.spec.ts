import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramsModalComponent } from './programs-modal.component';

describe('ProgramsModalComponent', () => {
  let component: ProgramsModalComponent;
  let fixture: ComponentFixture<ProgramsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
