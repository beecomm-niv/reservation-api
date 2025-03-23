import { OrderDto } from './order.model';

export interface ISync<T> {
  syncId: string;
  syncAt: string;
  reservation: Booking | null;
  order: T | null;
}

export interface Sync extends ISync<OrderDto> {}

export interface Booking {
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
  status: PatronStatus | null;
  note: string | null;
}

export type ReservationStatus = 'done' | 'deleted' | 'noShow' | 'canceled' | 'seated' | 'approved' | 'standby' | 'invited' | 'callback' | 'empty' | 'queue';

export type CreditCardStatus = 'waiting' | 'manualVerified' | 'notVerified' | 'verified';

export type ReservationStage = 'preOrder' | 'ordered' | 'starters' | 'main' | 'dessert' | 'check' | 'paid' | 'done';

export type PatronStatus = 'visitor' | 'member' | 'returning' | 'problematic' | 'vip';
