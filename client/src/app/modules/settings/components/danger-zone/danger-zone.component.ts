import { Component, output } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LogOutIcon, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-danger-zone',
  imports: [LucideAngularModule, SwalComponent],
  templateUrl: './danger-zone.component.html',
})
export class DangerZoneComponent {
  readonly logoutIcon = LogOutIcon;

  logout = output<void>();

  onLogout(): void {
    this.logout.emit();
  }
}
