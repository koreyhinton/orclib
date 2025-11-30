/*
    Given, e(() => true),
             ^________^
    The expressed lambda becomes the lookup key in the frozen cache.
    Hence, fn1 and fn2 will use the same key:
        const trueFn = () => true;
        const fn1 = e(trueFn);
        const fn2 = e(trueFn);
    Whereas, fnA and fnB will not use the same key:
        const fnA = e(() => true);
        const fnB = e(() => true);

    Once lazy evaluated, fn1 and fn2 will share the same lookup,
    whereas fnA and fnB will not:
        fn1();
        fn2();
        fnA();
        fnB();
*/
export const orcWithFrozenExpression = (expressionGroupingLambda) => {
    const frozenCache = new Map();

    function e(freezeLambda) {
        if (!frozenCache.has(freezeLambda)) {
            let evaluated = false;
            let value;
            let resolverFn = () => {
                if (!evaluated) {
                    value = freezeLambda();
                    evaluated = true;
                }
                return value;
            };
            frozenCache.set(freezeLambda, resolverFn);
        }
        return frozenCache.get(freezeLambda);
    }
    return expressionGroupingLambda(e);
};
