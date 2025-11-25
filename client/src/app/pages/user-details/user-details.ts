import { Component, inject, OnInit } from '@angular/core';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-user-details',
  imports: [],
  templateUrl: './user-details.html',
})
export class UserDetails implements OnInit {
  private toast = inject(ToastService);

  ngOnInit(): void {
    this.toast.show('UserDetails component initialized', 'info', 3000);
  }
}
