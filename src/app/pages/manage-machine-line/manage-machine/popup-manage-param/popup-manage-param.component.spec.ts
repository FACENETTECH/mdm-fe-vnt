import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupManageParamComponent } from './popup-manage-param.component';

describe('PopupManageParamComponent', () => {
  let component: PopupManageParamComponent;
  let fixture: ComponentFixture<PopupManageParamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupManageParamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupManageParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
