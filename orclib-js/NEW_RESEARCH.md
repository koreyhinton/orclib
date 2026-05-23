# NEW RESEARCH

Looking for a new pattern to reduce intermediate state, for regular data and DOM elements, with use of closure expressions.

## BACKGROUND RESEARCH AND QUESTION

Prior work in my orchestration library showed that fromFrozenExpressions paired with commandQuery structures can reduce intermediate state bugs. However, the syntax is clunky with surprising semantics (and a new type of control flow). Additionally, object encapsulation was studied as an alternative solution in an unrealized C# library version.

Can we expand on this for JavaScript? Can read-write closures (meant to act on an object like a DOM node) be passed as arguments to an encapsulator, with sticky or frozen read-write behavior:

* Read expression is evaluated immediately in the constructor (no lazy evaluation that could separate state) and captured for all getter invocations
* Write occurs at most once, upon first setter invocation

This would enable less syntax, normal if statements, dot-notation getter/setter access that is safe from intermediate state bugs.

## TEST

wip: ./src/frozenAccess.js
