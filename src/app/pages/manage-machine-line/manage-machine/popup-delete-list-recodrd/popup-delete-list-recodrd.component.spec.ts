import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupDeleteListRecodrdComponent } from './popup-delete-list-recodrd.component';

describe('PopupDeleteListRecodrdComponent', () => {
  let component: PopupDeleteListRecodrdComponent;
  let fixture: ComponentFixture<PopupDeleteListRecodrdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupDeleteListRecodrdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupDeleteListRecodrdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
