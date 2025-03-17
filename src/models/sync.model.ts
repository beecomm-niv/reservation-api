import { Order } from './order.model';

export interface Sync {
  action: string;
  branchId: string;
  params: Params;
}

interface Params {
  syncId: string;
  syncAt: string;
  reservation?: HostReservation;
  order?: Order;
}

interface HostReservation {
  reservationId: string;
  createdBy: string | null;
  createdAt: string | null;
  duration: number | null;
  expectedDate: string | null;
  expectedTime: string | null;
  patron: Patron | null;
  size: number | null;
  status: ReservationStatus | null;
  table: string[];
  comment: string | null;
  creditcardStatus: CreditCardStatus | null;
  stage: ReservationStage | null;
  hasPackage: boolean | null;
  lastModified: number | null;
}

interface Patron {
  phone: string | null;
  name: string | null;
  status: string | null;
  note: string | null;
}

type ReservationStatus = 'done' | 'deleted' | 'noShow' | 'canceled' | 'seated' | 'approved' | 'standby' | 'invited' | 'callback' | 'empty' | 'queue';

type CreditCardStatus = 'waiting' | 'manualVerified' | 'notVerified' | 'verified';

type ReservationStage = 'preOrder' | 'ordered' | 'starters' | 'main' | 'dessert' | 'check' | 'paid' | 'done';
