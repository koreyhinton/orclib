import { orc, as1, as0 } from './orc.js';

(() => {

var moduleA = orc.module(function() {
    if (as0(this.loop))
    {
        this.i = 5;
        this.loop = 1;
    }
    if (as1(this.loop))
    {
        console.log(this.i);
    }
    if (as1(this.i))
    {
        this.loop = 0;
    }
    if (as1(this.loop))
    {
        this.i--;
    }
});

var moduleB = orc.moduleSeq(moduleA, orc.moduleDef(function() {
    if (as0(this.print))
    {
        console.log("printed", moduleA.i);
        this.print = 1;
    }
}));

})();

