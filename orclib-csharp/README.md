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

## HYPOTHESIS

If an OOP object encapsulator class uses access control to restrict read to only ever be a copy of the original object value, and write to happen only once and affects the original reference, then the following will be true:

1) Code accessing the object only via the encapsulator cannot observe intermediate states

2) Code that bypasses the encapsulator or must use the mutation can be identified by the code maintainer through:
    a) Contrast to safer surrounding code (encapsulator or method boundaries)
    b) Custom Roslyn analyzer warnings

3) Code structured as multiple if-getter statements can be re-ordered in any order without change in behavior in that scope
    a) additionally, strictly checking via encapsulator makes for re-orderable statements, and fully-qualifiable if-getter statements without further nesting and local referencing to aid maintainability

## TEST

Psuedocode

```
public ref struct Frozen<T> where T : struct
{
    private ref T _original;
    private readonly T _copy;
    private bool _once;
    public Frozen(ref T original)
    {
        _original = ref original;
        _copy = original;
        _once = false;
    }
    public T Val
    {
        get { return _copy; };
        set
        {
            if(!_once)
            {
                _original = newValue;
                _once = true;
            }
        }
    }
}
```

Test code

```
bool acceptPassword;
int i = 0;
LengthCheck(new Frozen<bool>(ref acceptPassword), new Frozen<int>(ref i)); /* 1 */
NumberCheck(new Frozen<bool>(ref acceptPassword), new Frozen<int>(ref i)); /* 2 */
// 1,2 are re-orderable. In each method, A,B,C are re-orderable too.

void CheckLength(Frozen<bool> frozenAccept, Frozen<int> checkIteration)
{
    /* A */
    if (checkIteration.Val > 0 && frozenAccept.Val)
    {
        frozenAccept.Val = this.password.Length > 14;
    }

    /* B */
    if (checkIteration.Val == 0)
    {
        frozenAccept.Val = this.password.Length > 14;
    }

    /* C */
    checkIteration.Val++;
}

/* 2 */
void CheckNumber(Frozen<bool> frozenAccept, Frozen<int> checkIteration)
{
    /* A */
    if (checkIteration.Val > 0 && frozenAccept.Val)
    {
        frozenAccept.Val = Regex.IsMatch(this.password, @"\d");
    }

    /* B */
    if (checkIteration.Val == 0)
    {
        frozenAccept.Val = Regex.IsMatch(this.password, @"\d");
    }

    /* C */
    checkIteration.Val++;
}
```

Test cases


| Case  | Expected  | Actual |
| password="test" anyOrder[CheckLength,CheckNumber] anyOrder[A,B,C] | i=2,accept=false | |
| password="test1" anyOrder[CheckLength,CheckNumber] anyOrder[A,B,C] | i=2,accept=false | |
| password="test__test__test" anyOrder[CheckLength,CheckNumber] anyOrder[A,B,C] | i=2,accept=false | |
| password="123456789012345" anyOrder[CheckLength,CheckNumber] anyOrder[A,B,C] | i=2,accept=true | |


