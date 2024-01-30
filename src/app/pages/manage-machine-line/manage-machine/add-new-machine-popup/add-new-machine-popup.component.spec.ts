import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewMachinePopupComponent } from './add-new-machine-popup.component';

describe('AddNewMachinePopupComponent', () => {
  let component: AddNewMachinePopupComponent;
  let fixture: ComponentFixture<AddNewMachinePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewMachinePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewMachinePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
