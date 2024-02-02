import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupAddConfigTableComponent } from './popup-add-config-table.component';

describe('PopupAddConfigTableComponent', () => {
  let component: PopupAddConfigTableComponent;
  let fixture: ComponentFixture<PopupAddConfigTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupAddConfigTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupAddConfigTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
