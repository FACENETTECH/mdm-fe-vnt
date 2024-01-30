import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiderMiniComponent } from './sider-mini.component';

describe('SiderMiniComponent', () => {
  let component: SiderMiniComponent;
  let fixture: ComponentFixture<SiderMiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiderMiniComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiderMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
