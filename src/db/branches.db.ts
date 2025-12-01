import { Branch } from '../models/branch.model';
import { DB } from './db';

import { v4 } from 'uuid';

export class BranchesDB {
  private static readonly TABLE_NAME = 'guest_branches';

  public static createBranch = async (name: string, posBranchId: string, reservationsBranchId: string) => {
    const branch: Branch = {
      branchId: v4(),
      name,
      posBranchId,
      reservationsBranchId,
    };

    await DB.getInstance().setItemByKey(this.TABLE_NAME, branch, {
      deniedOverride: true,
      primaryKey: 'branchId',
    });

    return branch;
  };

  public static getBranchById = async (branchId: string) => await DB.getInstance().findItemByKey<Branch>(this.TABLE_NAME, { branchId });

  public static updateBranch = async (branchId: string, branch: Partial<Branch>) => {
    await DB.getInstance().update<Branch>(this.TABLE_NAME, 'branchId', branchId, branch, ['branchId']);
  };

  public static findByPosBranchId = async (posBranchId: string) => {
    const response = await DB.getInstance().query(this.TABLE_NAME, 'findByPosBranchId', [{ alias: ':p', expression: 'posBranchId', value: posBranchId }]);
    return response.Items?.length ? (response.Items[0] as Branch) : null;
  };
}
