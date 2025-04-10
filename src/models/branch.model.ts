export interface Branch {
  branchId: string;
  name: string;

  posBranchId: string;
  reservationsBranchId: string;

  areas: Area[];
  maps: Map[];
  tables: Table[];
}

interface Area {
  id: string;
  name: string;
}

interface Map {
  id: string;
  name: string;
  imagePath?: string;
}

interface Table {
  id: string;
  tableNum: number;
  x: number;
  y: number;
  size: number;
  type: 'square' | 'circle' | 'bar' | 'rectangleVertical' | 'rectangleHorizontal';

  area: string;
  map: string;
}
