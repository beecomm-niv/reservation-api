import { Sync } from './sync.model';

export interface Reservation {
  branchId: string;
  branchName: string;
  clientName: string;
  clientPhone: string;

  syncId: string;
  sync: Sync;
}
