export type LogsSevierity = 'INFO' | 'ERROR';

export interface Log {
  id: string;
  searchKey: string;
  severity: LogsSevierity;
  user: string;
  payload: any;
  ts: number;
  message?: string;
}
