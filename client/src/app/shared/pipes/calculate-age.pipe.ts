import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calculateAge',
  standalone: true,
})
export class CalculateAgePipe implements PipeTransform {
  transform(value: string | undefined): number | undefined {
    if (!value) return undefined;

    const birthDate = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
}
