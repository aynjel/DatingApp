import { Type } from '@angular/core';

export interface ModalData {
  component: Type<any>;
  inputs?: Record<string, any>;
}
