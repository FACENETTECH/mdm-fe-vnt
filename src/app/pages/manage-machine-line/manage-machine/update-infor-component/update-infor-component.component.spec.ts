import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInforComponentComponent } from './update-infor-component.component';

describe('UpdateInforComponentComponent', () => {
  let component: UpdateInforComponentComponent;
  let fixture: ComponentFixture<UpdateInforComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateInforComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateInforComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
