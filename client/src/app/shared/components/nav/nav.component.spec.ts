import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideSweetAlert2 } from '@sweetalert2/ngx-sweetalert2';
import { NavComponent } from './nav.component';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideRouter([]),
        provideSweetAlert2({ fireOnInit: false, dismissOnDestroy: true }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the sidebar when the user is logged in', () => {
    component['authStore'].setIsLoggedIn(true);
    fixture.detectChanges();
    const sidebar = fixture.nativeElement.querySelector('aside');
    expect(sidebar).toBeTruthy();
  });

  it('should hide the sidebar when the user is not logged in', () => {
    component['authStore'].setIsLoggedIn(false);
    fixture.detectChanges();
    const sidebar = fixture.nativeElement.querySelector('aside');
    expect(sidebar).toBeFalsy();
  });
});
