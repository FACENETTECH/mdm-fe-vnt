import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupImportExcelComponent } from './popup-import-excel.component';

describe('PopupImportExcelComponent', () => {
  let component: PopupImportExcelComponent;
  let fixture: ComponentFixture<PopupImportExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupImportExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupImportExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
