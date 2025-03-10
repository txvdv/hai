import Dexie, { type EntityTable } from 'dexie';

interface Friend {
  id: number; // This prop will be used as primary key (see below)
  name: string;
  age: number;
}

const db = new Dexie('FriendsDatabase') as Dexie & {
  friends: EntityTable<Friend, 'id'>
};

// Schema declaration:
db.version(1).stores({
  friends: '++id, name, age' // primary key "id" (for the runtime!)
});