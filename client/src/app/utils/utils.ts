import { Guid } from 'guid-typescript';

export function setAndDeletePropertyFromMap<K, T>(
  state: K,
  property: keyof K,
  value: T,
  transId: Guid,
  timeoutMs: number = 1000
): Map<Guid, T> {
  const map = state[property] as Map<Guid, T>;
  const newMap = new Map(map);
  newMap.set(transId, value);
  setTimeout(() => {
    newMap.delete(transId);
  }, timeoutMs);
  return newMap;
}
