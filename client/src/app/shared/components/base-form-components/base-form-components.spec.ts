import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseFormComponents } from './base-form-components';

describe('BaseFormComponents', () => {
  let component: BaseFormComponents;
  let fixture: ComponentFixture<BaseFormComponents>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BaseFormComponents],
    });
    fixture = TestBed.createComponent(BaseFormComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
