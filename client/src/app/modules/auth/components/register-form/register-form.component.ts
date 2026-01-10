import { Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '@component/button/button.component';
import {
  ArrowBigRight,
  KeyIcon,
  LucideAngularModule,
  MarsIcon,
  UserCheckIcon,
  VenusIcon,
} from 'lucide-angular';
import { InterestInputComponent } from '../../../../shared/components/interest-input/interest-input.component';
import { TextInputComponent } from '../../../../shared/components/text-input/text-input.component';
import { TextareaInputComponent } from '../../../../shared/components/textarea-input/textarea-input.component';
import { RegisterUserRequest } from '../../../../shared/models/dto/request/register-user.request';
import { AuthStore } from '../../../../shared/store/auth.store';
import { GlobalStore } from '../../../../shared/store/global.store';

@Component({
  selector: 'app-register-form',
  imports: [
    ReactiveFormsModule,
    LucideAngularModule,
    TextInputComponent,
    ButtonComponent,
    TextareaInputComponent,
    InterestInputComponent,
  ],
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {
  private globalStore = inject(GlobalStore);
  private authStore = inject(AuthStore);
  private formBuilder = inject(FormBuilder);

  protected isLoading = computed(() => this.globalStore.isSubmitting());

  protected currentStep = signal(1);

  readonly credentialsIcon = KeyIcon;
  readonly detailsIcon = UserCheckIcon;
  readonly boyIcon = MarsIcon;
  readonly girlIcon = VenusIcon;
  readonly nextIcon = ArrowBigRight;

  public readonly userForm: FormGroup;
  public readonly memberDetailsForm: FormGroup;

  readonly genderOptions = ['male', 'female'];

  constructor() {
    this.userForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      { validators: this.passwordsMatch() }
    );

    this.memberDetailsForm = this.formBuilder.group({
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
      interests: [[], [this.interestsRequiredValidator()]],
      city: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      country: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid || this.memberDetailsForm.invalid) {
      this.userForm.markAllAsTouched();
      this.memberDetailsForm.markAllAsTouched();
      return;
    }

    const userValue = this.userForm.getRawValue();
    const memberValue = this.memberDetailsForm.getRawValue();

    const payload: RegisterUserRequest = {
      email: userValue.email,
      password: userValue.password,
      displayName: memberValue.displayName,
      dateOfBirth: new Date(memberValue.dateOfBirth),
      gender: memberValue.gender,
      description: memberValue.description,
      interests: memberValue.interests,
      city: memberValue.city,
      country: memberValue.country,
    };

    this.authStore.signUp({
      data: payload,
      onSuccess: () => {
        this.userForm.reset();
        this.memberDetailsForm.reset();
      },
    });
  }

  onNextStep(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    this.currentStep.set(2);
  }

  private passwordsMatch(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password');
      const confirmPassword = formGroup.get('confirmPassword');

      if (!password || !confirmPassword) {
        return null;
      }

      // If confirmPassword already has other errors (like required or minLength),
      // stop here so we don't overwrite them.
      if (
        confirmPassword.errors &&
        !confirmPassword.errors['passwordsMismatch']
      ) {
        return null;
      }

      // Check if values match
      if (password.value !== confirmPassword.value) {
        // ERROR FOUND: Set the error specifically on the confirmPassword control
        confirmPassword.setErrors({ passwordsMismatch: true });
      } else {
        // NO ERROR: Clear errors (if the current error was the mismatch)
        if (confirmPassword.hasError('passwordsMismatch')) {
          confirmPassword.setErrors(null);
        }
      }

      // Return null for the FormGroup itself, as the error is now on the child control
      return null;
    };
  }

  getMaxDate(): string {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  }

  genderField(): AbstractControl {
    return this.memberDetailsForm.get('gender') as AbstractControl;
  }

  private interestsRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (
        !control.value ||
        !Array.isArray(control.value) ||
        control.value.length === 0
      ) {
        return { required: true };
      }
      return null;
    };
  }
}
