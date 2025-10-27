export class UtilsService {
  public static listToMap = <T>(list: T[], getKey: (i: T) => string): Partial<Record<string, T>> => Object.assign({}, ...list.map<Record<string, T>>((i) => ({ [getKey(i)]: i })));
}
