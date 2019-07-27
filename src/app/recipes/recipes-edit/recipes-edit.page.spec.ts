import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesEditPage } from './recipes-edit.page';

describe('RecipesEditPage', () => {
  let component: RecipesEditPage;
  let fixture: ComponentFixture<RecipesEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipesEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipesEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
