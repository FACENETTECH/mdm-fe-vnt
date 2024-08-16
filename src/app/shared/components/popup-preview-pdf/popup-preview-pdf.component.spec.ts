import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupPreviewPdfComponent } from './popup-preview-pdf.component';

describe('PopupPreviewPdfComponent', () => {
  let component: PopupPreviewPdfComponent;
  let fixture: ComponentFixture<PopupPreviewPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupPreviewPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupPreviewPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
