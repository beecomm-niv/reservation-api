import { Order } from './order.model';

export interface Sync {
  syncId: string;
  syncAt: string;
  reservation: Booking | null;
  order: Order | null;
}

export interface Booking {
  reservationId: string;
  createdBy: string;
  createdAt: string;
  duration: number;
  expectedDate: string;
  expectedTime: string;
  patron: Patron;
  size: number;
  status: ReservationStatus;
  table: string[];
  comment: string;
  creditcardStatus: CreditCardStatus;
  stage: ReservationStage;
  hasPackage: boolean;
  lastModified: number;
  seatingRequests?: string[];
}

export interface Patron {
  phone: string;
  name: string;
  status: PatronStatus;
  note: string;
  birthday: string;
  anniversary: string;
  gender: string;
  email: string;
}

export type ReservationStatus = 'done' | 'deleted' | 'noShow' | 'canceled' | 'seated' | 'approved' | 'standby' | 'invited' | 'callback' | 'empty' | 'queue';

export type CreditCardStatus = 'waiting' | 'manualVerified' | 'notVerified' | 'verified';

export type ReservationStage = 'preOrder' | 'ordered' | 'starters' | 'main' | 'dessert' | 'check' | 'paid' | 'done';

export type PatronStatus = 'visitor' | 'member' | 'returning' | 'problematic' | 'vip';
