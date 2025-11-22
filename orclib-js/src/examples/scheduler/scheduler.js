// START OF LITERATE PROGRAM FILE
// Wik-mode can be used in emacs to expand/collapse sections.

import { and, not, commandQuery, commandQueryConfig } from '../../orc.js';
import { dayOfMonthSlotter } from './day-of-month-slotter.js';

((strict) => {commandQueryConfig.strictMode = strict; window.scheduler = function(s) {

// MESSY DATE SITUATION
// ie: when user types in 0000 for the year or 35 for the day
//     and then clicks on the calendar day node for the last loaded good month
commandQuery(

    !document.getElementById("native-date-input").validity.valid, () => {
        document.getElementById("native-date-input").valueAsDate = s.lastValidDate;
    },

    document.getElementById("native-date-input").validity.valid, () => {
        s.lastValidDate = document.getElementById("native-date-input").valueAsDate;
    }

);

// MOUSE PER NODE
commandQuery(
    // MOUSE PER NODE - LAST NODE HOVER UPDATE
    (
        s.display.expanded &&
        !s.click &&
        !s.display.nativePickerClick &&
        s.calendarNode != null &&
        s.calendarNodeView != null &&
        s.hover.x > -1 &&
        s.hover.y > -1 &&
        s.lastHover.x !== s.hover.x &&
        s.lastHover.y !== s.hover.y &&
        s.calendarNode.row == 6 && s.calendarNode.column == 7
    ), () => {
        s.lastHover.x = s.hover.x;
        s.lastHover.y = s.hover.y;
    },

    // MOUSE PER NODE - HOVER CALENDAR NODE VIEW
    (
        s.display.expanded &&
        !s.click &&
        !s.display.nativePickerClick &&
        s.calendarNode != null &&
        s.calendarNodeView != null &&
        s.hover.x > -1 &&
        s.hover.y > -1 &&
        s.lastHover.x !== s.hover.x &&
        s.lastHover.y !== s.hover.y &&
        (s.hover.x >= s.calendarNodeView.getBoundingClientRect().left  &&
         s.hover.x <= s.calendarNodeView.getBoundingClientRect().right &&
         s.hover.y >= s.calendarNodeView.getBoundingClientRect().top   &&
         s.hover.y <= s.calendarNodeView.getBoundingClientRect().bottom) &&
        s.calendarNodeView.style.backgroundColor != "lightblue"
    ), () => {
        s.calendarNodeView.style.backgroundColor = "lightblue";
    },

    // MOUSE PER NODE - CLICK WHILE HOVERING NUMBERED CALENDAR NODE VIEW
    (
        s.display.expanded &&
        s.click &&
        !s.display.nativePickerClick &&
        s.calendarNode != null &&
        s.calendarNodeView != null &&
        s.hover.x > -1 &&
        s.hover.y > -1 &&
        (s.hover.x >= s.calendarNodeView.getBoundingClientRect().left  &&
         s.hover.x <= s.calendarNodeView.getBoundingClientRect().right &&
         s.hover.y >= s.calendarNodeView.getBoundingClientRect().top   &&
         s.hover.y <= s.calendarNodeView.getBoundingClientRect().bottom) &&
        document.getElementById("native-date-input").validity.valid &&
        dayOfMonthSlotter(
            document.getElementById("native-date-input").valueAsDate,
            s.calendarNode).isDayOfMonth
         && dayOfMonthSlotter(
            document.getElementById("native-date-input").valueAsDate,
            s.calendarNode).n !== document.getElementById("native-date-input").valueAsDate.getUTCDate()
    ), () => {
        let date = document.getElementById("native-date-input").valueAsDate;
        let n = dayOfMonthSlotter(date, s.calendarNode).n;
        let y = date.getUTCFullYear();
        let m = date.getUTCMonth(); 
        document.getElementById("native-date-input").valueAsDate
            = new Date(Date.UTC(y, m, n));

        // If the previous selected day of the month
        // came before this one, then it is out of sync
        // and needs green highlight removed
        document.getElementsByClassName("today")?.[0]?.classList.remove("today");
    },

    // MOUSE PER NODE - HOVER OUT CALENDAR NODE VIEW
    (
        s.display.expanded &&
        !s.click &&
        !s.display.nativePickerClick &&
        s.calendarNode != null &&
        s.calendarNodeView != null &&
        s.hover.x > -1 &&
        s.hover.y > -1 &&
        s.lastHover.x !== s.hover.x &&
        s.lastHover.y !== s.hover.y &&
        !(s.hover.x >= s.calendarNodeView.getBoundingClientRect().left  &&
         s.hover.x <= s.calendarNodeView.getBoundingClientRect().right &&
         s.hover.y >= s.calendarNodeView.getBoundingClientRect().top   &&
         s.hover.y <= s.calendarNodeView.getBoundingClientRect().bottom) &&
        s.calendarNodeView.style.backgroundColor !== "lightgray"
    ), () => {
        s.calendarNodeView.style.backgroundColor = "lightgray";
    }

);

// MOUSE FRAME
commandQuery(

    // MOUSE - CLICK - ARROWS
    // TODO:
    and(1, s.click), () => {
        // console.log('click1', `${s.hover.x},${s.hover.y}`);
    },

    // MOUSE - CLICK - DAY
    // TODO:
    and(1, s.display.expanded, s.click), () => {
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
    and(
        s.frame,
        s.display.nativePickerClick,
        not(s.display.expanded)
    ), () => {
        document.getElementById("scheduler-picker-body").classList.remove("scheduler-collapsed");
        s.display.expanded = 1;
    },

    // MOUSE - CLICK - COLLAPSE
    and(
        not(s.focused),
        s.frame,
        not(s.display.nativePickerClick),
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
        document.getElementById("scheduler-picker-body").classList.add("scheduler-collapsed");
        s.display.expanded = 0;
    }

);

// ISSUE CALENDAR NODE DAY NUMBERS WITH DATE INPUT VALIDATION

commandQuery(

    (
        s.display.expanded &&
        s.calendarNode != null && s.calendarNode.column != null &&
        document.getElementById("native-date-input").validity.valid && (
        document.getElementById("native-date-input")
            .valueAsDate.toISOString().split('T')[0]
        !== s.cachedDate?.toISOString().split('T')[0] ?? '')
        && dayOfMonthSlotter(
            document.getElementById("native-date-input").valueAsDate,
            s.calendarNode).isDayOfMonth
        && dayOfMonthSlotter(
            document.getElementById("native-date-input").valueAsDate,
            s.calendarNode).n !== document.getElementById("native-date-input").valueAsDate.getUTCDate()
    ), () => {
        let date = document.getElementById("native-date-input").valueAsDate;
        let n = dayOfMonthSlotter(date, s.calendarNode).n;
        s.calendarNodeView.firstElementChild.innerHTML = `${n}`;

        s.calendarNodeView.classList.remove("today");
    },

    (
        s.display.expanded &&
        s.calendarNode != null && s.calendarNode.column != null &&
        document.getElementById("native-date-input").validity.valid && (
        document.getElementById("native-date-input")
            .valueAsDate.toISOString().split('T')[0]
        !== s.cachedDate?.toISOString().split('T')[0] ?? '')
        && dayOfMonthSlotter(
            document.getElementById("native-date-input").valueAsDate,
            s.calendarNode).isDayOfMonth
        && dayOfMonthSlotter(
            document.getElementById("native-date-input").valueAsDate,
            s.calendarNode).n === document.getElementById("native-date-input").valueAsDate.getUTCDate()
    ), () => {
        let date = document.getElementById("native-date-input").valueAsDate;
        let n = dayOfMonthSlotter(date, s.calendarNode).n;
        s.calendarNodeView.firstElementChild.innerHTML = `${n}`;

        s.calendarNodeView.classList.add("today");
    },

    (
        s.display.expanded &&
        s.calendarNode != null && s.calendarNode.column != null &&
        document.getElementById("native-date-input").validity.valid && (
        document.getElementById("native-date-input")
            .valueAsDate.toISOString().split('T')[0]
        !== s.cachedDate?.toISOString().split('T')[0] ?? '')
        && !dayOfMonthSlotter(
            document.getElementById("native-date-input").valueAsDate,
            s.calendarNode).isDayOfMonth
    ), () => {
        s.calendarNodeView.firstElementChild.innerHTML = "";

        s.calendarNodeView.classList.remove("today");
    },

    (
        s.display.expanded &&
        s.calendarNode != null && s.calendarNode.column != null && 
        document.getElementById("native-date-input").validity.valid &&
        (document.getElementById("native-date-input")
            .valueAsDate.toISOString().split('T')[0]
        !== s.cachedDate?.toISOString().split('T')[0] ?? '')
        && s.calendarNode.row == 6 && s.calendarNode.column == 7
    ), () => {
        // last node
        console.log("LAST NODE");
        s.cachedDate = document.getElementById("native-date-input").valueAsDate;
    },

    (
        s.frame &&
        s.display.expanded &&
        !document.getElementById("native-date-input").validity.valid
    ), () => {
        document.getElementById("native-date-input").style.color = "red";
    },

    (
        s.frame &&
        s.display.expanded &&
        document.getElementById("native-date-input").validity.valid
    ), () => {
        document.getElementById("native-date-input").style.color = "black";
    },


);


}})(1);
