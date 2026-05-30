# FROZENACCESS - RESEARCH

Looking for a new pattern to reduce intermediate state, for regular data and DOM elements, with use of closure expressions.

## FROZENACCESS - BACKGROUND RESEARCH AND QUESTION

Prior work in my orchestration library showed that fromFrozenExpressions paired with commandQuery structures can reduce intermediate state bugs. However, the syntax is clunky with surprising semantics (and a new type of control flow). Additionally, object encapsulation was studied as an alternative solution in an unrealized C# library version.

Can we expand on this for JavaScript? Can read-write closures (meant to act on an object like a DOM node) be passed as arguments to an encapsulator, with sticky or frozen read-write behavior:

* Read expression is evaluated immediately in the constructor (no lazy evaluation that could separate state) and captured for all getter invocations
* Write occurs at most once, upon first setter invocation

This would enable less syntax, normal if statements, dot-notation getter/setter access that is safe from intermediate state bugs.

## FROZENACCESS - TEST

wip: ./src/frozenAccess.js


# STYLEONLOAD - RESEARCH

Look for a mechanism that restricts the same web style being defined in multiple locations.

## STYLEONLOAD - QUESTION

Is there a way to statically declare the original styles (whether inline or via class names) in html for an element, and then be able to reapply those original styles after they dynamically change, undoing all the dynamic changes, with minimal syntax, without losing other static style sheet changes (ie: that were defined by other means, tag name, id, hierarchical selection, etc)? The style declarations will serve as a single source of truth, such that even refactoring a simple class reference, to rename the class itself, will not result in having to change both a static (html) and dynamic (JavaScript) reapplication reference.

## STYLEONLOAD - BACKGROUND RESEARCH

Having a single source of truth for the dual purpose of initial load and reset style is possible when the load and reset styles are all done dynamically in scripts, but is not commonly done from a static html basis.

There are common approaches in static html that help reduce code, like factoring styles out stylesheets with class/attribute/ID reference tagging, but the problem of duplicate reference on refactor is still there.

Modern frameworks may combine static and dynamic rendering in a single function, which could be useful for this purpose by factoring the tag into a dynamic variable, yet that comes at a cost of indirection for every element and would not be common practice.

## STYLEONLOAD - HYPOTHESIS

If an element's styles and class references are statically defined within an unrendered** attribute for use as a load and reset basis for a transition handler function, then the following is expected to be true:

1) No class name or style is duplicated for reset since the unrendered attribute will be used and its naming convention is owned by the transition handler

2) All dynamic changes to rendered* attributes will be unwound on reset

3) Static stylesheet definitions persist across load and reset states, unaffected by the transition handler

* rendered attributes: `style`, `class`
** unrendered attributes: require transition handler mapping to rendered attributes

## STYLEONLOAD - TEST

In practice, it was discovered classes added via the transition handler, will likely need to be removed in a common toggling operation, and in doing so requires referencing the class name in a place that could be renamed on naming refactor.

It might be preferable to have a clear operation to clear out the load styles from the rendered attributes while still keeping unrendered cached for load style return.

Tested with:

* ./src/examples/toggle/index.html

## STYLEONLOAD - CONCLUSION

The approach I used can be found in the following included files:

* ./src/examples/toggle/index.html
* ./src/styleOnLoad.js

I've been informed of other approaches that can toggle with a CSS-only solution and with minimal class name references (see examples in APPENDIX), which implicitly define a load state and the class toggle can override the load state upon its addition, and then reverts automatically upon its removal. The styleOnLoad helper may still prove useful, if the trade-off of a JS function dependency for an explicitly defined load state is deemed worth it.

## STYLEONLOAD - APPENDIX

./src/examples/toggle/index2.html

(for full diff run: `git diff --no-index ./src/examples/toggle/index.html ./src/examples/toggle/index2.html`)

```diff
     <style>
-        .closed {
-            background-color: red;
+        #box {
+            --load-width: 10px;
+            --load-height: 10px;
+            --load-bg: red;
+            width: var(--load-width);
+            height: var(--load-height);
+            background-color: var(--load-bg);
         }
-        .open {
-            background-color: green;
+        /* closed is an implicit state */
+        #box.open {
+            --load-width: 400px;
+            --load-height: 400px;
+            --load-bg: green;
         }
     </style>
```

./src/examples/toggle/index3.html

(for full diff run: `git diff --no-index ./src/examples/toggle/index.html ./src/examples/toggle/index3.html`)

```diff
     <style>
-        .closed {
+        #box {
+            width: 10px;
+            height: 10px;
             background-color: red;
         }
-        .open {
+        /* closed is an implicit state */
+        #box.open {
+            width: 400px;
+            height: 400px;
             background-color: green;
         }
     </style>

```

./src/examples/toggle/index4.html

(for full diff run: `git diff --no-index ./src/examples/toggle/index.html ./src/examples/toggle/index4.html`)

```diff
     <style>
-        .closed {
+        #box {
+            width: 10px;
+            height: 10px;
             background-color: red;
         }
+        /* closed is an implicit state */
         .open {
-            background-color: green;
+            width: 400px !important;
+            height: 400px !important;
+            background-color: green !important;
         }
     </style>
```
