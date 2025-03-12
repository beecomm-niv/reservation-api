import { database } from 'firebase-admin';

import { ReservationDto } from '../models/reservation';

export class RealTimeService {
  public static setReservations = async (branchId: string, reservations: ReservationDto[], removed: number[], init: boolean) => {
    const data: Record<string, ReservationDto | null> = {};

    reservations.forEach((r) => {
      if (r.orderId) {
        data[r.orderId] = r;
      }
    });

    removed.forEach((r) => (data[r] = null));

    const path = `/${branchId}/reservations`;

    if (init) {
      await database().ref(path).set(data);
    } else {
      await database().ref(path).update(data);
    }
  };
}
