// START OF LITERATE PROGRAM FILE
// Wik-mode can be used in emacs to expand/collapse sections.

import { and, not, commandQuery, commandQueryConfig } from '../../orc.js';

((strict) => {commandQueryConfig.strictMode = strict; window.scheduler = function(s) {

// DRAW - ONLOAD
/*
commandQuery(
    0 == s.display.drawn, () => {
        // TODO: draw the calendar (collapsed)
        // 7 x 6
        console.log("LOADED");
        s.display.drawn = 1; // dispatcher drew the calendar
        document.getElementById("native-date-input").valueAsDate = new Date();
    },
);
*/

// USE DATE TO DRAW CALENDAR NODE NUMBERS - ISSUE
// TODO: throttle this:
/*commandQuery(


);
*/
// MOUSE FRAME
commandQuery(

    // 1, () => { console.log("A"); },

    // MOUSE - HOVER
    and(
        //s.display.drawn,
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
    and(1/*s.display.drawn*/, s.click), () => {
        console.log('click1', `${s.hover.x},${s.hover.y}`);
    },

    // MOUSE - CLICK - DAY
    // TODO:
    and(/*s.display.drawn*/1, s.display.expanded, s.click), () => {
        console.log('click2',s.frame, `${s.hover.x},${s.hover.y}`);
    },

    // MOUSE - CLICK - EXPAND
    // TODO:
    and(
        s.frame,
        s.display.nativePickerClick,
        /*s.display.drawn*/1,
        not(s.display.expanded)
    ), () => {
        console.log('click3', `${s.hover.x},${s.hover.y}`);
        document.getElementById("scheduler-picker-body").classList.remove("scheduler-collapsed");
        s.display.expanded = 1;
    },

    // MOUSE - CLICK - COLLAPSE
    // TODO:
    and(
        s.frame,
        not(s.display.nativePickerClick),
        /*s.display.drawn*/1,
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
        document.getElementById("scheduler-picker-body").classList.add("scheduler-collapsed");
        s.display.expanded = 0;
    }

);

// USE DATE TO DRAW CALENDAR NODE NUMBERS - CALCULATE AND ISSUE

commandQuery(

    (
        s.display.expanded &&
        //s.drawCal == 0 &&
        s.frame == 1 && (
        document.getElementById("native-date-input")
            .valueAsDate.toISOString().split('T')[0]
        !== s.cachedDate?.toISOString().split('T')[0] ?? '')
    ), () => {
        let date = document.getElementById("native-date-input").valueAsDate;
        //s.cachedDate = date;
        let y = date.getUTCFullYear();
        let m = date.getUTCMonth();
        let numDays = new Date(y, m+1, 0).getDate();
        s.startDayBox = new Date(y, m, 1).getDay();
        s.endDayBox = numDays; //s.startDayBox + numDays;
    },

    (
        s.display.expanded && (
        document.getElementById("native-date-input")
            .valueAsDate.toISOString().split('T')[0]
        !== s.cachedDate?.toISOString().split('T')[0] ?? '')
    ), () => {
        s.currentDay = (
            ( ((s.calendarNode.row-1)*7) + s.calendarNode.column )
            - s.startDayBox
        );
    }


);

console.log(s.endDayBox);

commandQuery(

    /* 1, () => {
        console.log("B");
        //console.log(s, s.display.expanded, s.calendarNode?.row,s.calendarNode?.column);
        console.log(document.getElementById("scheduler-picker-body").style.visibility != "hidden", s.calendarNode?.row,s.calendarNode?.column);
    }, */


    (
        s.display.expanded &&
        s.calendarNode != null && s.calendarNode.column != null && (
        document.getElementById("native-date-input")
            .valueAsDate.toISOString().split('T')[0]
        !== s.cachedDate?.toISOString().split('T')[0] ?? '')
        && s.endDayBox > 0 &&
        not(s.currentDay < 1 || s.currentDay > s.endDayBox)
    ), () => {
        console.log(s.currentDay);
        console.log("START DRAWING");
        console.log("draw cal start");
        let node = s.calendarNode;
        let n = (
            ( ((node.row-1)*7) + node.column )
            - s.startDayBox
        );
        s.calendarNodeView.firstElementChild.innerHTML = `${n}`;
        // console.log(node, node.row, node.column, s.endDayBox);
    },

    (
        s.display.expanded &&
        /*s.drawCal==1 && */s.calendarNode != null && s.calendarNode.column != null && (
        document.getElementById("native-date-input")
            .valueAsDate.toISOString().split('T')[0]
        !== s.cachedDate?.toISOString().split('T')[0] ?? '') &&
        s.endDayBox > 0 && (s.currentDay < 1 || s.currentDay > s.endDayBox)
    ), () => {
        console.log("draw cal in progress");
        s.calendarNodeView.firstElementChild.innerHTML = "";
    },

    (/*s.drawCal==1 && */
        s.display.expanded == 1 &&
        s.calendarNode != null && s.calendarNode.column != null && 
        (document.getElementById("native-date-input")
            .valueAsDate.toISOString().split('T')[0]
        !== s.cachedDate?.toISOString().split('T')[0] ?? '')
        && s.calendarNode.row == 6 && s.calendarNode.column == 7
    ), () => {
        // last node
        console.log("LAST NODE");
        s.cachedDate = document.getElementById("native-date-input").valueAsDate;
    }

    // TODO: UNCOMMENT
    // ONCE I FIND WHY DOES THIS HAPPEN BEFORE DRAW CAL START:
    /*
    (
        s.display.drawn == 1 &&
        s.frame == 1 &&
        s.drawCal == 1
    ), () => {
        console.log("draw cal done");
        s.cachedDate = document.getElementById("native-date-input").valueAsDate;
        s.drawCal = 0;
    }*/

);


}})(1);
