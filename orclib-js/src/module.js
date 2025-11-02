
export function orcModule(cb) {
    const mod = { loop: false };
    cb(mod);
    while (mod.loop) { cb(mod); }
    return mod;
}
