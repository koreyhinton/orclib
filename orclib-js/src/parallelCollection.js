export const orcParallelCollection = (...collections) => {
    const c = {};
    c.collections = collections;
    c.eachOrOnce = function(cb) {
        const max = Math.max(
            ...collections.map(collection => collection.length),
            0
        );
        let i = 0;
        let frameBit = 1;
        do {
            const collectionPrimes = c.collections.map(collection => collection[i]);
            cb(...collectionPrimes, frameBit, (position, val) => {
                c.collections[position].push(val);
            });
            frameBit = 0;
            i++;
        } while (i < max);
    };
    return c;
};
