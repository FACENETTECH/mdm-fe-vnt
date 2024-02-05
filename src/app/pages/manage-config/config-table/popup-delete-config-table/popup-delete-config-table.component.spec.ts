import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupDeleteConfigTableComponent } from './popup-delete-config-table.component';

describe('PopupDeleteConfigTableComponent', () => {
  let component: PopupDeleteConfigTableComponent;
  let fixture: ComponentFixture<PopupDeleteConfigTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupDeleteConfigTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupDeleteConfigTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
