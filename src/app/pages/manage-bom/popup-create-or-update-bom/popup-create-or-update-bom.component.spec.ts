import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupCreateOrUpdateBomComponent } from './popup-create-or-update-bom.component';

describe('PopupCreateOrUpdateBomComponent', () => {
  let component: PopupCreateOrUpdateBomComponent;
  let fixture: ComponentFixture<PopupCreateOrUpdateBomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupCreateOrUpdateBomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupCreateOrUpdateBomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
