// START OF LITERATE PROGRAM FILE
// Wik-mode can be used in emacs to expand/collapse sections.

import { and, not, commandQuery, commandQueryConfig } from '../../orc.js';
import { dayOfMonthSlotter } from './day-of-month-slotter.js';

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
        // console.log('click1', `${s.hover.x},${s.hover.y}`);
    },

    // MOUSE - CLICK - DAY
    // TODO:
    and(/*s.display.drawn*/1, s.display.expanded, s.click), () => {
        // console.log('click2',s.frame, `${s.hover.x},${s.hover.y}`);
    },

    // MOUSE - CLICK - FOCUS STATE
    and(
        s.frame,
        s.display.nativePickerClick
    ), () => {
        s.focused = 1;
        console.log("FOCUSED");
    },

    and(
        s.click,
        s.frame,
        not(s.display.nativePickerClick)
    ), () => {
        s.focused = 0;
        console.log("BLUR");
    },


    // MOUSE - CLICK - EXPAND
    // TODO:
    and(
        s.frame,
        s.display.nativePickerClick,
        /*s.display.drawn*/1,
        not(s.display.expanded)
    ), () => {
        //console.log('click3', `${s.hover.x},${s.hover.y}`);
        document.getElementById("scheduler-picker-body").classList.remove("scheduler-collapsed");
        s.display.expanded = 1;
    },

    // MOUSE - CLICK - COLLAPSE
    and(
        not(s.focused),
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
        //console.log('click4', `${s.hover.x},${s.hover.y}`);
        document.getElementById("scheduler-picker-body").classList.add("scheduler-collapsed");
        s.display.expanded = 0;
    }

);

// USE DATE TO DRAW CALENDAR NODE NUMBERS - CALCULATE AND ISSUE

commandQuery(

    (
        s.display.expanded &&
        s.calendarNode != null && s.calendarNode.column != null && (
        document.getElementById("native-date-input")
            .valueAsDate.toISOString().split('T')[0]
        !== s.cachedDate?.toISOString().split('T')[0] ?? '')
        && dayOfMonthSlotter(
            document.getElementById("native-date-input").valueAsDate,
            s.calendarNode).isDayOfMonth
    ), () => {
        /*
        console.log(s.currentDay);
        console.log("START DRAWING");
        console.log("draw cal start");
        */
        let date = document.getElementById("native-date-input").valueAsDate;
        let n = dayOfMonthSlotter(date, s.calendarNode).n;

        s.calendarNodeView.firstElementChild.innerHTML = `${n}`;
        // console.log(node, node.row, node.column, s.endDayBox);
    },

    (
        s.display.expanded &&
        /*s.drawCal==1 && */s.calendarNode != null && s.calendarNode.column != null && (
        document.getElementById("native-date-input")
            .valueAsDate.toISOString().split('T')[0]
        !== s.cachedDate?.toISOString().split('T')[0] ?? '')
        && !dayOfMonthSlotter(
            document.getElementById("native-date-input").valueAsDate,
            s.calendarNode).isDayOfMonth
    ), () => {
        //console.log("draw cal in progress");
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
