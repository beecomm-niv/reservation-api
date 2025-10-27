export type LogsSevierity = 'INFO' | 'ERROR';

export interface Log {
  id: string;
  branchId: string;
  severity: LogsSevierity;
  user: string;
  payload: any;
  message: string;
  ts: number;
}
