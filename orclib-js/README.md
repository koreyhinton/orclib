# NEW RESEARCH

Look for a mechanism that restricts the same web style being defined in multiple locations.

## QUESTION

Is there a way to statically declare the original styles (whether inline or via class names) in html for an element, and then be able to reapply those original styles after they dynamically change, undoing all the dynamic changes, with minimal syntax, without losing other static style sheet changes (ie: that were defined by other means, tag name, id, hierarchical selection, etc)? The style declarations will serve as a single source of truth, such that even refactoring a simple class reference, to rename the class itself, will not result in having to change both a static (html) and dynamic (JavaScript) reapplication reference.

## BACKGROUND RESEARCH

Having a single source of truth for the dual purpose of initial load and reset style is possible when the load and reset styles are all done dynamically in scripts, but is not commonly done from a static html basis.

There are common approaches in static html that help reduce code, like factoring styles out stylesheets with class/attribute/ID reference tagging, but the problem of duplicate reference on refactor is still there.

Modern frameworks may combine static and dynamic rendering in a single function, which could be useful for this purpose by factoring the tag into a dynamic variable, yet that comes at a cost of indirection for every element and would not be common practice.

## HYPOTHESIS

If an element's styles and class references are statically defined within an unrendered** attribute for use as a load and reset basis for a transition handler function, then the following is expected to be true:

1) No class name or style is duplicated for reset since the unrendered attribute will be used and its naming convention is owned by the transition handler

2) All dynamic changes to rendered* attributes will be unwound on reset

3) Static stylesheet definitions persist across load and reset states, unaffected by the transition handler

* rendered attributes: `style`, `class`
** unrendered attributes: require transition handler mapping to rendered attributes

