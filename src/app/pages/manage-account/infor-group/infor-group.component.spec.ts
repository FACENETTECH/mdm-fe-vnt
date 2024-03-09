import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InforGroupComponent } from './infor-group.component';

describe('InforGroupComponent', () => {
  let component: InforGroupComponent;
  let fixture: ComponentFixture<InforGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InforGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InforGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
