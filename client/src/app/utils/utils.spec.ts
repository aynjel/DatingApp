import { Guid } from 'guid-typescript';
import { setAndDeletePropertyFromMap } from './utils';

describe('Utils', () => {
  it('should set and delete property from map', () => {
    const state = {
      map: new Map<string, string>(),
    };
    const property = 'map';
    const value = 'value';
    const transId = Guid.create();
    const timeoutMs = 1000;
    const result = setAndDeletePropertyFromMap(
      state,
      property,
      value,
      transId,
      timeoutMs
    );
    expect(result).toBeInstanceOf(Map);
  });
});
