import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoMachinePopupComponent } from './info-machine-popup.component';

describe('InfoMachinePopupComponent', () => {
  let component: InfoMachinePopupComponent;
  let fixture: ComponentFixture<InfoMachinePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoMachinePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoMachinePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
