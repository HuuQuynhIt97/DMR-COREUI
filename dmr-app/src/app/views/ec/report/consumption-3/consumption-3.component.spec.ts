/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Consumption3Component } from './consumption-3.component';

describe('Consumption-3Component', () => {
  let component: Consumption3Component;
  let fixture: ComponentFixture<Consumption3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Consumption3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Consumption3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
