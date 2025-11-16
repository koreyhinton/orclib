// START OF LITERATE PROGRAM FILE
// Wik-mode can be used in emacs to expand/collapse sections.

import { and, not, commandQuery, commandQueryConfig } from './orc.js';

((strict) => {commandQueryConfig.strictMode = strict; window.scheduler = function(s) {

// DRAW - ONLOAD
commandQuery(
    0 == s.display.drawn, () => {
        // TODO: draw the calendar (collapsed)
        // 7 x 6
        console.log("LOADED");
        s.display.drawn = 1; // dispatcher drew the calendar
        document.getElementById("native-date-input").valueAsDate = new Date();
    },
);

// USE DATE TO DRAW CALENDAR NODE NUMBERS - CALCULATE

commandQuery(
    and(
        s.frame,
        s.display.drawn,
        document.getElementById("native-date-input")
            .valueAsDate.toISOString().split('T')[0]
        !== s.cachedDate?.toISOString().split('T')[0] ?? ''
    ), () => {
        let date = document.getElementById("native-date-input").valueAsDate;
        s.cachedDate = date;
        let y = date.getFullYear();
        let m = date.getMonth();
        let numDays = new Date(y, m+1, 0).getDate();
        s.startDayBox = new Date(y, m, 1).getDay();
        s.endDayBox = numDays; //s.startDayBox + numDays;
    },
);

// USE DATE TO DRAW CALENDAR NODE NUMBERS - ISSUE
// TODO: throttle this:
commandQuery(
    and(
        s.calendarNode != null && s.calendarNode.column != null,
        s.endDayBox > 0
    ), () => {
        let node = s.calendarNode;
        let n = (
            ( ((node.row-1)*7) + node.column )
            - s.startDayBox
        );
        
        if (n < 1 || n > s.endDayBox)
            s.calendarNodeView.firstElementChild.innerHTML = "";
        else
            s.calendarNodeView.firstElementChild.innerHTML = `${n}`;
        console.log(node, node.row, node.column, s.endDayBox);
    },
);



// MOUSE
commandQuery(

    // MOUSE - HOVER
    and(
        s.display.drawn,
        s.hover.x > -1,
        s.hover.y > -1,
        s.lastHover.x !== s.hover.x,
        s.lastHover.y !== s.hover.y
    ), () => {
        //console.log(`moved ${s.lastHover.x},${s.lastHover.y} => ${s.hover.x},${s.hover.y}`);
        s.lastHover.x = s.hover.x;
        s.lastHover.y = s.hover.y;
    },

    // MOUSE - CLICK - ARROWS
    // TODO:
    and(s.display.drawn, s.click), () => {
        console.log('click1', `${s.hover.x},${s.hover.y}`);
    },

    // MOUSE - CLICK - DAY
    // TODO:
    and(s.display.drawn, s.display.expanded, s.click), () => {
        console.log('click2',s.frame, `${s.hover.x},${s.hover.y}`);
    },

    // MOUSE - CLICK - EXPAND
    // TODO:
    and(
        s.frame,
        s.display.nativePickerClick,
        s.display.drawn,
        s.click,
        not(s.display.expanded)
    ), () => {
        console.log('click3', `${s.hover.x},${s.hover.y}`);
        document.getElementById("scheduler-picker-body").style.visibility
            = "visible";
        s.display.expanded = 1;
        s.display.nativePickerClick = 0;
    },

    // MOUSE - CLICK - COLLAPSE
    // TODO:
    and(
        s.frame,
        not(s.display.nativePickerClick),
        s.display.drawn,
        s.display.expanded,
        s.click,
        (s.hover.x < 
            document.getElementById("scheduler-picker-body-lhs")
                .getBoundingClientRect().left
        ||
        s.hover.x > 
            document.getElementById("scheduler-picker-body-rhs")
                .getBoundingClientRect().right
        ||
        s.hover.y > (
            document.getElementById("scheduler-picker-body")
                .getBoundingClientRect().top +
            document.getElementById("scheduler-picker-body")
                .getBoundingClientRect().height)
        )
        ||
        s.hover.y < document.getElementById("scheduler-picker-body")
                .getBoundingClientRect().top
    ), () => {
        console.log('click4', `${s.hover.x},${s.hover.y}`);
        document.getElementById("scheduler-picker-body").style.visibility
            = "hidden";
        s.display.expanded = 0;
    }

);

}})(1);
