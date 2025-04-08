export interface Branch {
  branchId: string;
  name: string;

  posBranchId: string;
  reservationsBranchId: string;

  areas: Area[];
}

interface Area {
  id: string;
  name: string;
}
