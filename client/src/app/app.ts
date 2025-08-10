import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from './layouts/nav/nav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav],
  template: `
    <app-nav />
    <router-outlet />
  `,
  styleUrl: './app.scss',
})
export class App implements OnInit {
  ngOnInit(): void {
    console.log('App initialized');
  }
}
