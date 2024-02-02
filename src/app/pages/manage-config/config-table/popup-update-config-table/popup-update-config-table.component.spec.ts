import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupUpdateConfigTableComponent } from './popup-update-config-table.component';

describe('PopupUpdateConfigTableComponent', () => {
  let component: PopupUpdateConfigTableComponent;
  let fixture: ComponentFixture<PopupUpdateConfigTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupUpdateConfigTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupUpdateConfigTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
