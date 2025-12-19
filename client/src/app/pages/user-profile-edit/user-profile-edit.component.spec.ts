import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileEditComponent } from './user-profile-edit.component';

describe('UserProfileEditComponent', () => {
  let component: UserProfileEditComponent;
  let fixture: ComponentFixture<UserProfileEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserProfileEditComponent],
      providers: [provideZonelessChangeDetection(), provideHttpClient()],
    }).compileComponents();
    fixture = TestBed.createComponent(UserProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
