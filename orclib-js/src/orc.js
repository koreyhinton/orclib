// import { orcModule, orcModuleSeq, orcModuleDef } from './module.js';
import { orcParallelCollection } from './parallelCollection.js';
import { orcCommandQuery, orcCommandQueryConfig } from './commandQuery.js';

export const orc = {
    /*module: orcModule,
    moduleSeq: orcModuleSeq,
    moduleDef: orcModuleDef,*/
    parallelCollection: orcParallelCollection,
    commandQueryConfig: orcCommandQueryConfig,
    commandQuery: orcCommandQuery
};

export const and = function(...operands) {

    let found = 0;

    for (const o of operands)
    {
        if (o === 0 || o === false)
            return false;
        else if (o === 1 || o === true) { found = 1; }
        else console.warn(`Expected and-operand to be 0, 1, false, or true, but received: ${o}`);
    }
    if (!found)
        console.warn(`Expected parameters passed into and-function, but received none.`);
    return true;
};

export const not = function(operand) {
    let truthy = operand == 1 || operand == true;
    let falsy  = operand == 0 || operand == false;
    if (!truthy && !falsy)
        console.warn(`Expected not-operand to be 0, 1, false, or true, but received: ${operand}`);
    return falsy;
};

/*
export const as1 = function(num) {
    return num === 1 || num === true;
};

export const as0 = function(num) {
    return num === 0 || num === false || num === undefined;
};
*/

export { orcCommandQuery as commandQuery } from './commandQuery.js';
export { orcCommandQueryConfig as commandQueryConfig } from './commandQuery.js';
export const parallelCollection = orcParallelCollection;
