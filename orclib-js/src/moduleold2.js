// if(as1(this.someNum)){}
export const orcModule = (cb) => {
    const state = { loop: false };

    const run = () => {
        do {
            cb.call(state);
        } while (state.loop);
        return state;
    };

    run.state = state;
    return run;
};

export const orcModuleSeq = (...modules) => {
    let last = null;

    for (const m of modules) {
        let state;
        do {
            state = m();
        } while (state.loop);
        last = m;
    }
    return last;
};
