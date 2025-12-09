import { v5 } from 'uuid';
import { Sync } from '../models/sync.model';
import { BranchCustomer } from '../models/branch-customer.model';
import { DB } from './db';

export class BranchCustomerDB {
  private static TABLE_NAME = 'guest_branch_customers';
  private static NAMESPACE = 'd290f1ee-6c54-4b01-90e6-d701748f0851';

  private static generateID = (branchId: string, phone: string) => v5(`${branchId}::${phone}`, this.NAMESPACE);

  public static setBranchCustomer = async (branchId: string, sync: Sync) => {
    if (!sync.reservation?.patron.phone || !sync.reservation.additionalInfo) return;

    const payload: BranchCustomer = {
      id: this.generateID(branchId, sync.reservation.patron.phone),
      info: sync.reservation.additionalInfo,
    };

    await DB.getInstance().setItemByKey(this.TABLE_NAME, payload, {
      primaryKey: 'id',
      deniedOverride: false,
    });

    return payload;
  };

  public static getBranchCustomer = async (branchId: string, phone: string) => await DB.getInstance().findItemByKey<BranchCustomer>(this.TABLE_NAME, { id: this.generateID(branchId, phone) });
}
