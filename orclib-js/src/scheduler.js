// START OF LITERATE PROGRAM FILE
// Wik-mode can be used in emacs to expand/collapse sections.

import { commandQuery, commandQueryConfig } from './orc.js';

((strict) => {commandQueryConfig.strictMode = strict; window.scheduler = function(s) {

// DRAW - ONLOAD
commandQuery(
    0 == s.display.drawn, () => {
        // TODO: draw the calendar (collapsed)
        // 7 x 5
        console.log("LOADED");
        s.display.drawn = 1;
    },
);

// MOUSE
commandQuery(

    // MOUSE - HOVER
    s.display.drawn == 1 &&
    s.hover.x > -1 &&
    s.hover.y > -1 &&
    s.lastHover.x !== s.hover.x &&
    s.lastHover.y !== s.hover.y, () => {
        console.log(`moved ${s.lastHover.x},${s.lastHover.y} => ${s.hover.x},${s.hover.y}`);
        s.lastHover.x = s.hover.x;
        s.lastHover.y = s.hover.y;
    },

    // MOUSE - CLICK - ARROWS
    // TODO:
    1 == s.display.drawn &&
    1 == s.click, () => {
        console.log('click', `${s.hover.x},${s.hover.y}`);
    },

    // MOUSE - CLICK - DAY
    // TODO:
    1 == s.display.drawn &&
    1 == s.display.expanded &&
    1 == s.click, () => {
        console.log('click', `${s.hover.x},${s.hover.y}`);
    },

    // MOUSE - CLICK - EXPAND
    // TODO:
    1 == s.display.drawn &&
    0 == s.display.expanded &&
    1 == s.click, () => {
        console.log('click', `${s.hover.x},${s.hover.y}`);
    },

    // MOUSE - CLICK - COLLAPSE
    // TODO:
    1 == s.display.drawn &&
    1 == s.display.expanded &&
    1 == s.click, () => {
        console.log('click', `${s.hover.x},${s.hover.y}`);
    }



);

}})(1);
