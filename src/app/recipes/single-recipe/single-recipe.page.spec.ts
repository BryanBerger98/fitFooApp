import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleRecipePage } from './single-recipe.page';

describe('SingleRecipePage', () => {
  let component: SingleRecipePage;
  let fixture: ComponentFixture<SingleRecipePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleRecipePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleRecipePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
