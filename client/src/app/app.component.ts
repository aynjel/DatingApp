import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Sandbox } from './store/sandbox/sandbox';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'DatingApp';

  errorMessage$: Observable<string[]> = this.sandbox.errorMessage$;

  constructor(private sandbox: Sandbox) {}

  ngOnInit(): void {
    this.sandbox.errorMessage$.subscribe((e) => {
      console.log(e);
    });
  }
}
