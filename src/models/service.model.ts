import { ACCESS } from './jwt-payload.model';

export interface Service {
  id: string;
  name: string;
  accessKeyId: string;
  accessSecretKey: string;
  access: ACCESS[];
}
