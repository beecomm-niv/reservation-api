import { Branch } from '../models/branch.model';
import { DB } from './db';

import { v4 } from 'uuid';

export class BranchesDB {
  private static readonly TABLE_NAME = 'branches';

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

  public static updateBranch = async (branch: Partial<Branch>) => {
    DB.getInstance().update(this.TABLE_NAME, { branchId: branch.branchId }, [
      { alias: ':p', expression: 'posBranchId', value: branch.posBranchId },
      {
        alias: ':r',
        expression: 'reservationsBranchId',
        value: branch.reservationsBranchId,
      },
    ]);
  };
}
