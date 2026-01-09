import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestInputComponent } from './interest-input.component';

describe('InterestInputComponent', () => {
  let component: InterestInputComponent;
  let fixture: ComponentFixture<InterestInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterestInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterestInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
