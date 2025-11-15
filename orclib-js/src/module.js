
export const orcModule = (cb) => {
    const m = { loop: false, control: cb };
    do {
        cb.call(m);
    } while (m.loop);
    return m;
};


export const orcModuleDef = (cb) => {
    const m = { loop: false, control: cb };
    return m;
};

export const orcModuleSeq = (...modules) => {
    let last = null;

    for (const m of modules) {
console.log("testing", m.i);
        do {
            m.control();
        } while (m.loop);
        last = m;
    }
    return last;
};
