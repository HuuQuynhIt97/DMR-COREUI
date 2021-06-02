/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Modulev2Component } from './modulev2.component';

describe('Modulev2Component', () => {
  let component: Modulev2Component;
  let fixture: ComponentFixture<Modulev2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Modulev2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Modulev2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
