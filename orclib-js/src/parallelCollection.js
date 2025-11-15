export const orcParallelCollection = (...collections) => {
    const c = {};
    c.collections = collections;
    c.eachOrOnce = function(cb) {
        const max = Math.max(
            ...collections.map(collection => collection.length),
            0
        );
        let i = 0;
        do {
            const collectionPrimes = c.collections.map(collection => collection[i]);
            cb(...collectionPrimes, i==0, (position, val) => {
                c.collections[position].push(val);
            });
            i++;
        } while (i < max);
    };
    return c;
};
