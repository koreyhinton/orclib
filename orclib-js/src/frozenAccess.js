class FrozenAccess {

    root;
    #r;
    #w;
    #once = false;

    constructor(root, r, w) {
        this.root = root; // root element
        this.r = r();
        this.w = w;
    }

    get val() {
        return this.#r;
    }

    set val(newValue) {
        if (this.#once)
            return;
        this.#once = true;
        this.w(newValue);
    }
}
