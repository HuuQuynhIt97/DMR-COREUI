/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Modulev2AddEditComponent } from './modulev2-add-edit.component';

describe('Modulev2AddEditComponent', () => {
  let component: Modulev2AddEditComponent;
  let fixture: ComponentFixture<Modulev2AddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Modulev2AddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Modulev2AddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
