import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideSweetAlert2 } from '@sweetalert2/ngx-sweetalert2';
import { User } from '../../models/user.model';
import { AuthStore } from '../../store/auth.store';
import { NavComponent } from './nav.component';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let isLoggedInSignal: ReturnType<typeof signal<boolean>>;
  let currentUserSignal: ReturnType<typeof signal<User | undefined>>;

  beforeEach(async () => {
    // Create signals for the mock
    isLoggedInSignal = signal(false);
    currentUserSignal = signal<User | undefined>(undefined);

    // Create a mock AuthStore that matches the interface
    const mockAuthStore = {
      isLoggedIn: () => isLoggedInSignal(),
      currentUser: () => currentUserSignal(),
      logout: jasmine.createSpy('logout'),
    } as unknown as InstanceType<typeof AuthStore>;

    await TestBed.configureTestingModule({
      imports: [NavComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideRouter([]),
        provideSweetAlert2({ fireOnInit: false, dismissOnDestroy: true }),
        {
          provide: AuthStore,
          useValue: mockAuthStore,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
