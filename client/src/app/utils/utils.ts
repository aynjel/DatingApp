import { Guid } from 'guid-typescript';

// export function setAndDeletePropertyFromMap(
//   state: IState,
//   property: 'isLoading' | 'hasFailure',
//   value: any,
//   transId: Guid
// ): Map<Guid, any> {
//   state[property].set(transId, value);
//   setTimeout(() => {
//     state[property].delete(transId);
//   });
//   return state[property];
// }

export function setAndDeletePropertyFromMap<K, T>(
  state: K,
  property: keyof K,
  value: T,
  transId: Guid,
  timeoutMs: number = 1000
): Map<Guid, T> {
  // @ts-ignore
  state[property].set(transId, value);
  setTimeout(() => {
    // @ts-ignore
    state[property].delete(transId);
  }, timeoutMs);
  // @ts-ignore
  return state[property];
}
