import { servicePersistenceDexie } from './service-persistence-dexie.js';

describe('servicePersistenceDexie', () => {
  it('should work', () => {
    expect(servicePersistenceDexie()).toEqual('service-persistence-dexie');
  });
});
