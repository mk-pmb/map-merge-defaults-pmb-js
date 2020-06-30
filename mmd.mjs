// -*- coding: utf-8, tab-width: 2 -*-

const isArr = Array.isArray;
function ifObj(x, d) { return ((x && typeof x) === 'object' ? x : d); }
function dfMerge(base, item) { return { ...base, ...item }; }
async function asyncMerge(base, item) { return { ...base, ...(await item) }; }


function core(ovrHow, base, userHow, orig, ovrConvert) {
  if (isArr(userHow)) {
    return core(ovrHow, base, {}, userHow, orig, ovrConvert);
  }
  if (!ifObj(userHow)) {
    return core(ovrHow, base, { dfKey: userHow }, orig, ovrConvert);
  }
  if (!isArr(orig)) {
    throw new TypeError('Expected an array as orig, not ' + String(orig));
  }
  const how = { ...userHow, ...ovrHow };
  const { dfKey, pr } = how;
  const hasDfKey = (dfKey !== undefined);
  const merge = (how.merge || (pr ? asyncMerge : dfMerge));
  const conv = (ovrConvert || how.convert);
  let results = orig.map(function transform(origItem) {
    let item = origItem;
    if (hasDfKey && (!ifObj(item))) { item = { [dfKey]: item }; }
    item = merge(base, item);
    if (conv) { item = conv(item); }
    return item;
  });
  if (pr) { results = Promise.all(results); }
  return results;
}





function mapMergeDefaults(...args) { return core(null, ...args); };
Object.assign(mapMergeDefaults, {
  pr(...args) { return core({ pr: true }, ...args); },
  dfMerge,
  asyncMerge,
});

export default mapMergeDefaults;
