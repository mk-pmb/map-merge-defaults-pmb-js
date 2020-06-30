
<!--#echo json="package.json" key="name" underline="=" -->
map-merge-defaults-pmb
======================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Merge each item from an array (e.g. of options objects) with a base (e.g. an
options object with default options) and optionally convert them using a
custom conversion function. Supports promises and async functions.
<!--/#echo -->



API
---

This module ESM-exports one function that holds some methods:

### mapMergeDefaults(base, [{how|dfKey}, ]orig[, convert])

Returns an array of the transformed items of input array `orig`.
In the most basic mode, the transformation for each input item is
just to merge it with `base`.
You can modify the transformation by providing additional arguments:

* `dfKey`: If set to a non-object, acts as a shorthand for a `how` object
  with just one key `dfKey`, using this argument as the value.
* `convert`: Overrule the `how` option with same name (see below).
* `how`: An optional options object that supports these options, all optional:
  * `dfKey`: Default input key. If set to something other than `undefined`,
    any non-object item from `orig` will be objectified before merging it,
    by making an object with one property named the value of `dfKey`,
    and using the original item as the property value.
  * `merge`: A custom merge function.
    Can also be `false`, `undefined` or `null` to affirm the default,
    which is to use `.dfMerge` (default default)
    or `.awaitMerge` (default when `pr` option is set).
  * `convert`: A custom conversion function.
    If provided, it will receive the merge result as an additional step of
    the transformation.
    Can also be `false`, `undefined` or `null` to affirm the default,
    which is to leave the merge results as they are.
    If a truthy `convert` argument is given, it overrules this setting.
  * `pr`: Boolean, whether to wrap the result list in `Promise.all()`.
    Default: `false`.
    Also selects the default merge function: `.dfMerge` when `pr` is false-y,
    or `.awaitMerge` if `pr` is truthy.
    Note however that this does not add an await step before custom `merge`
    or `convert` functions, so in some scenarios those may need to internally
    await their arguments.
    Also `base` is never awaited, so you need to do that in your own code if
    required.


### .pr(base, [{how|dfKey}, ]orig[, convert])

Like `mapMergeDefaults` but with the `how.pr` option enabled by default.



### .dfMerge(base, item)

The default sync merge function. Returns `{ ...base, ...item }`.



### .awaitMerge(base, itemPr)

The default async merge function. `itemPr` may be a promise.
Returns a promise for `{ ...base, ...(await itemPr) }`.









Usage
-----

see from [test/usage.mjs](test/usage.mjs).

<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
