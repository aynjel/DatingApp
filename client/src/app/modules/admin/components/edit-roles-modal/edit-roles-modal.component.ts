import { Component, inject, Input } from '@angular/core';
import { ModalService } from '../../../../shared/services/modal.service';
import { UserWithRoles } from '../../models/common.model';

@Component({
  selector: 'app-edit-roles-modal',
  imports: [],
  templateUrl: './edit-roles-modal.component.html',
})
export class EditRolesModalComponent {
  private modalService = inject(ModalService);

  @Input() user: UserWithRoles | null = null;

  onCloseClick(): void {
    this.modalService.close(this.user);
  }
}
