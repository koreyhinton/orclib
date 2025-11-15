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
