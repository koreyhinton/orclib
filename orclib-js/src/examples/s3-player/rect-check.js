
window.rectCheckSet = {};

export const rectCheck = (x, y, elementId) => {

    if (window.rectCheckSet?.[elementId] == null) {
        window.rectCheckSet[elementId] = document.getElementById(elementId);
    }
    var el = window.rectCheckSet[elementId];
    var rect = el.getBoundingClientRect();

    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
};
