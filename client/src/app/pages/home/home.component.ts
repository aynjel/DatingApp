import { Component } from '@angular/core';
import { Sandbox } from '../../store/sandbox/sandbox';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private readonly sandbox: Sandbox) {}

  onSetErrorMessage(): void {
    const errorMessages = ['Error message 1'];
    this.sandbox.setErrorMessage(errorMessages);
  }
}
