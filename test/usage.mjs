// -*- coding: utf-8, tab-width: 2 -*-

import 'p-fatal';
import test from 'p-tape';
import pImmediate from 'p-immediate';

import mapMergeDefault from '..';


const yellowBase = { color: 'yellow', amount: 1 };
const items = [
  'banana',
  { shape: 'tulip', amount: 4 },
  { shape: 'box',   length: 158 },
  { shape: 'apple', color: 'red' },
];


test('Merge some options object', async(t) => {
  t.plan(3);

  const dfKey = 'shape';
  const expected = [
    { color: 'yellow',  shape: 'banana',  amount: 1 },
    { color: 'yellow',  shape: 'tulip',   amount: 4 },
    { color: 'yellow',  shape: 'box',     amount: 1, length: 158 },
    { color: 'red',     shape: 'apple',   amount: 1 },
  ];
  t.deepEqual(mapMergeDefault(yellowBase, dfKey, items), expected);

  const pr = mapMergeDefault.pr(yellowBase, dfKey, items);
  t.equal(String(pr), '[object Promise]', 'result is a promise');
  t.deepEqual(await pr, expected);
});


test('Convert after merge', async(t) => {
  t.plan(1);
  const dfKey = 'shape';
  function convert(item) { return Object.keys(item).sort(); }
  const commonKeys = ['amount', 'color', 'shape'];
  t.deepEqual(mapMergeDefault(yellowBase, dfKey, items, convert), [
    commonKeys,
    commonKeys,
    ['amount', 'color', 'length', 'shape'],
    commonKeys,
  ]);
});


test('Verify asyncness of pr mode merge', async(t) => {
  t.plan(7);

  const origShapes = [];
  let wantShape = 'decide later';
  async function mergeAndReshape(base, item) {
    origShapes.push(item.shape);
    await pImmediate();
    return { ...base, ...item, shape: wantShape };
  }

  const how = { dfKey: 'shape', merge: mergeAndReshape };
  const forgotAsyncness = mapMergeDefault(yellowBase, how, items);
  t.deepEqual(Array.isArray(forgotAsyncness), true, 'result is an array');
  t.deepEqual(forgotAsyncness.map(String), [
    '[object Promise]',
    '[object Promise]',
    '[object Promise]',
    '[object Promise]',
  ], 'result is an array of promises');
  t.deepEqual(origShapes, [
    'banana',
    'tulip',
    'box',
    'apple',
  ], 'merge function is probably waiting');

  wantShape = 'disc';
  const expectDiscs = [
    { color: 'yellow',  shape: 'disc',  amount: 1 },
    { color: 'yellow',  shape: 'disc',  amount: 4 },
    { color: 'yellow',  shape: 'disc',  amount: 1, length: 158 },
    { color: 'red',     shape: 'disc',  amount: 1 },
  ];
  const rememberedAsyncness = await Promise.all(forgotAsyncness);
  t.deepEqual(rememberedAsyncness, expectDiscs,
    'merge function really did wait');

  how.pr = true;
  const pr = mapMergeDefault(yellowBase, how, items);
  t.equal(String(pr), '[object Promise]', 'result is a promise');
  t.deepEqual(await pr, expectDiscs);
  t.equal(origShapes.length, items.length * 2,
    'items have been merged again');
});



























/* scroll */
