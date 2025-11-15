import { orcModule, orcModuleSeq, orcModuleDef } from './module.js';
import { orcParallelCollection } from './parallelCollection.js';

export const orc = {
    module: orcModule,
    moduleSeq: orcModuleSeq,
    moduleDef: orcModuleDef,
    parallelCollection: orcParallelCollection
};

export const as1 = function(num) {
    return num === 1 || num === true;
};

export const as0 = function(num) {
    return num === 0 || num === false || num === undefined;
};
