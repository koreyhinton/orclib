# NEW RESEARCH

Looking for a new meta language that enables writing strict imperative control flow for compiled OOP languages.

## QUESTION

For a small text parser (MarkdownSharp) written in C#, what is the performance and memory impact of rewriting it as a single Main method with all inlined variables (using non-clashing prefixing), eliminating all other method calls besides those provided by the standard library? Can it achieve improved performance with only a minor memory increase?

## BACKGROUND RESEARCH

* dot-ns
    * namespaced variable prefixes
    * heredoc blocks (meta language inspiration)
* literate programming (and re-editable code)
    * wik-mode (aids in navigating files)
* imperative code
    * ned language
    * tidyC transpiler for inlined methods in C# via comment syntax
* loop unrolling
* code inlining

## HYPOTHESIS

Rewriting a small project (MarkdownSharp) as a single method with all inlined variables (with non-clashing prefixing) will result in a minor trade-off:

* ~10% reduction in execution time due to eliminated call overhead
* ~10% increase in peak memory usage

This demonstrates that a small project's code can be written linearly from start to end without significant performance degradation.

To reduce the variable prefixing work (and additionally allow modular code files), a meta language will be used that generates the single Main method.

To reduce the memory overhead, the code will use standard built-in .NET data structures where applicable.

## TEST

wik-lang format (w/ use wik-lang-mode commands to navigate the code base).

wip on conversion, but so far the imperative code appears to be more verbose (not finalized yet):

| code format  | LoC |
|--|--|
| `wc -l ./src/examples/MarkdownSharp/*.wl` | 294 |
| `./src/examples/MarkdownSharp/main.wl \| wc -l` | 263 |
| approximate original code (removing comments not brought in) | 258 |

(Surprisingly the generated code that inlines functions multiple times wsa less than the non-duplicating meta language version)

./src/examples/MarkdownSharp/main.wl

