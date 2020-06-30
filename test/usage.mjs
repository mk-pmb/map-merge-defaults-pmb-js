// -*- coding: utf-8, tab-width: 2 -*-

import test from 'p-tape';

import mapMergeDefault from '..';

const base = { color: 'yellow', amount: 1 };
const dfKey = 'shape';
const items = [
  'banana',
  { shape: 'tulip', amount: 4 },
  { shape: 'box', length: 158 },
  { shape: 'apple', color: 'red' },
];


test('Merge some options object', async(t) => {
  t.plan(1);
  const merged = mapMergeDefault(base, dfKey, items);
  t.deepEqual(merged, [
    { color: 'yellow', amount: 1, shape: 'banana' },
    { color: 'yellow', amount: 4, shape: 'tulip' },
    { color: 'yellow', amount: 1, shape: 'box', length: 158 },
    { shape: 'apple', amount: 1, color: 'red' },
  ]);
});



























/* scroll */
