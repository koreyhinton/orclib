# NEW RESEARCH

Looking for a new pattern to reduce intermediate state.

## QUESTION

Let's assume a value encapsulator class object is created in an OOP language that can generically encapsulate any type of object or primitive value. The custom getter and setter can be written in a way that a copy of the original value passed in at construction will always be read by the custom getter and the custom setter will only change the underlying passed in value reference once, such that only the object creator can see the raw value and its actual change but the code given the object cannot (ie: you should pass down the encapsulator not the real value to a method).

Given the assumption that such an object can be created (which is likely a correct assumption), can the api be designed such that its intent is self-evident (and with help from its documentation and associated tooling) and can clearly and succinctly express the intent, and special access semantics, so an engineer can pick up and correctly use the encapsulator to reduce intermediate state bugs in their code?

## BACKGROUND RESEARCH

Many software engineering books caution against intermediate state bugs.

Other structures have been observed to have properties that help eliminate the state changes.

* Pure functions are static, do not rely on preserved state of an instance, and can predictably produce the same result from the same input data
* RDBMS provide atomic transactions that ensure data integrity,
  * additionally SQL expresses querying and statements in a way that unambiguously reads and writes values once
* Stateless services provide predictable statuses and responses when repeating requests

This research builds on prior work built into my JavaScript orchestration library, which provided two structures that were inspired by SQL CTEs which could define data values once and use predictably throughout the entire SQL expression:

* withFrozenExpression function: allows defining lazy-evaluated querying of variables that are evaluated once and then continuously provided within the scope (like a CTE)

* commandQuery function: (which can be placed within and make use of a frozen expression or be used independently) operates condition-lambda pairs in distinct phases in which all conditions happen first before conditional execution of their associated lambda code blocks

The name commandQuery is ambiguous, and its functionality, to restructure control flow, might be too unexpected and it is unlikely to recognize (bool,lambda,...) pairs as if statements with a delayed then statement.

If instead, we push the access control into a more expected place, like accessor methods, and allow regular if statements, then engineers need to only understand the encapsulator's access mechanics, not a new control flow structure.
