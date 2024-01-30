import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupCopyComponent } from './popup-copy.component';

describe('PopupCopyComponent', () => {
  let component: PopupCopyComponent;
  let fixture: ComponentFixture<PopupCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupCopyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
