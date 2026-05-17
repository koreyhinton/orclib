/*
    Static html attributes `data-sols` and `data-solc` will be transitioned over
    to the `style` and `class` on load and any "re-sol" (re-style on load) event
    dispatched on a per element basis (to return the styles to the load state)
*/
export const styleOnLoad = () => {

    if (!!window.styleOnLoadInit)
        return;
    window.styleOnLoadInit = true;

    function elementClsSol(event) {
        const el = event.target;
        el.setAttribute("class", el.getAttribute("data-solc"));   
    }

    function elementStySol(event) {
        const el = event.target;
        el.setAttribute("style", el.getAttribute("data-sols"));
    }

    function sol() {

        const sty = document.querySelectorAll("[data-sols]");
        const cls = document.querySelectorAll("[data-solc]");

        sty.forEach((el) => {
            elementStySol({ target: el });
            el.addEventListener("re-sol", elementStySol);
        });

        cls.forEach((el) => {
            elementClsSol({ target: el });
            el.addEventListener("re-sol", elementClsSol);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', sol, { once: true });
        return;
    }

    sol();
};
