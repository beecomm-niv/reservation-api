export interface Sync {
  action: string;
  restaurantId: string;
  branchId: string;
  params: Params;
}

interface Params {
  syncId: string;
  syncAt: string;
  order: any; // TODO
  reservation: HostReservation;
}

interface HostReservation {
  reservationId: string;
  createdBy: string;
  createdAt: string;
  duration: number;
  expectedDate: string;
  expectedTime: string;
  patron: Patron;
  size: number;
  status: string;
  table: string[];
  comment: string;
  creditcardStatus: string;
  stage: string;
  hasPackage: boolean;
  lastModified: number;
}

interface Patron {
  phone: string;
  name: string;
  status: string;
  note: string;
}
