const schema = `{
  events: {
    key: number,
    keyPath: 'id',
    value: Docs.Event,
    autoIncrement: true,
    indexes: [
    ]
  },
  counters: {
    key: string,
    keyPath: 'value',
    value: Docs.Counter,
    indexes: [
      { name: 'by-purpose-index', keyPath: ['purpose', 'index'], value: [string, number] },
      { name: 'by-value', keyPath: 'value', value: string, params: { unique: true } },
      { name: 'by-created', keyPath: 'created', value: Date }
    ]
  },
  bitcoinAddresses: {
    key: string,
    keyPath: 'address',
    value: Docs.BitcoinAddress,
    indexes: [
      { name: 'by-claimant', keyPath: 'claimant', value: string },
      { name: 'by-created', keyPath: 'created', value: Date }
    ]
  },
  config: {
    key: number,
    keyPath: 'one',
    value: Docs.Config
  },
  coins: {
    key: string,
    keyPath: 'hash',
    value: Docs.Coin,
    indexes: [
      { name: 'by-claim-hash', keyPath: 'claimHash', value: string }
    ]
  },
  claimables: {
    key: string,
    keyPath: 'hash',
    value: Docs.Claimable,
    indexes: [
      { name: 'by-kind', keyPath: 'kind', value: string },
      { name: 'by-bitcoin-address', keyPath: 'bitcoinAddress', value: string },
      { name: 'by-created', keyPath: 'created', value: Date }
    ] 
  },
  statuses: {
    key: string,
    keyPath: 'hash',
    value: Docs.Status,
    indexes: [
      { name: 'by-claimable-hash', keyPath: 'claimableHash', value: string },
      { name: 'by-created', keyPath: 'created', value: Date }
    ]
  }
}`;

let schemaJs: any = schema.replace(/\b(Array<string>)|(number)|(string)|(Date)|(Docs\.\w+)\b/g, "Symbol('$&')");
try {
  eval('schemaJs = ' + schemaJs);
} catch (err) {
  console.error(schemaJs);
  throw new Error('couldnt eval! Make sure the above is valid js!');
}

const pod = Object.entries(schemaJs)
  .map(([store, descr]) => {
    const autoIncrement = !!(descr as any).autoIncrement;
    const keyPath = (descr as any).keyPath;

    const indexes = [];
    for (const { name, keyPath, params } of (descr as any).indexes || []) {
      indexes.push({ name, keyPath, params });
    }

    const obj = { store, keyPath, autoIncrement, indexes };
    return JSON.stringify(obj, null, 2);
  })
  .join(', ');

const storeNames = Object.keys(schemaJs)
  .map(x => `'${x}'`)
  .join(' | ');

// now we need to normalize schemaJS to make it a valid
for (const [store, descr] of Object.entries(schemaJs)) {
  const newIndexes: any = {};

  for (const { name, value } of (descr as any).indexes || []) {
    newIndexes[name] = value;
  }

  (descr as any).indexes = newIndexes;
}

console.log(`// DO NOTE EDIT THIS FILE
// EDIT generate-schema.ts instead and then run "npm run schema"
import * as idb from 'idb';
import * as Docs from './docs';

export default interface Schema extends idb.DBSchema ${stringify(schemaJs, true)}

export type StoreName = ${storeNames};

interface StoreInfo {
  store: StoreName;
  keyPath: string;
  autoIncrement: boolean;
  indexes: { name: string, keyPath: string|Array<string>, params?: IDBIndexParameters }[];
}

export const schemaPOD: StoreInfo[] = [${pod}
];  
`);

function stringify(x: any, nakedSymbols: boolean, indent: number = 0): string {
  if (typeof x === 'symbol') {
    return nakedSymbols ? x.description : JSON.stringify(x.description);
  }

  // primitives
  if (typeof x === 'string' || typeof x === 'number' || typeof x === 'boolean') {
    return JSON.stringify(x);
  }

  if (Array.isArray(x)) {
    return '[' + x.map(e => stringify(e, nakedSymbols, indent + 1)).join(', ') + ']';
  }

  if (typeof x !== 'object') {
    throw new Error('unexpected type: ' + typeof x);
  }

  return (
    '{' +
    Object.entries(x)
      .map(([k, v]) => '\n' + '\t'.repeat(indent + 1) + JSON.stringify(k) + ': ' + stringify(v, nakedSymbols, indent + 1))
      .join(',') +
    '\n' +
    '\t'.repeat(indent) +
    '}'
  );

  // return JSON.stringify(v);
}
