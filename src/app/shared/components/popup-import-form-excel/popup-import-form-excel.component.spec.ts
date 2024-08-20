import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupImportFormExcelComponent } from './popup-import-form-excel.component';

describe('PopupImportFormExcelComponent', () => {
  let component: PopupImportFormExcelComponent;
  let fixture: ComponentFixture<PopupImportFormExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupImportFormExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupImportFormExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
