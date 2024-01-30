/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InforColumnComponent } from './infor-column.component';

describe('InforColumnComponent', () => {
  let component: InforColumnComponent;
  let fixture: ComponentFixture<InforColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InforColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InforColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
