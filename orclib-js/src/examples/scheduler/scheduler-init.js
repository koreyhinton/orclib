import { parallelCollection } from '../../orc.js';

window.schedulerInit = function() {

    window.schedule = {
        frame: 1,
        display: { expanded: 0, nativePickerClick: 0 },
        lastHover: { x: -1, y: -1 },
        hover: { x: -1, y: -1 },
        click: 0,
        calendarNode: {},
        calendarNodeView: {},
        cachedDate: null,
        focused: 0,
        lastValidDate: new Date()
    };

    window.schedulerDispatch = {
        initialized: 0,
        pCollection: null
    };

    var nodeContainerEl = document.getElementById("scheduler-picker-body-calendar");
    var nodes = [];
    var nodeViews = [];
    window.schedulerDispatch.initialized = 1;
    window.schedulerDispatch.pCollection =
        parallelCollection(nodes, nodeViews);
    console.log("creating views");

    for (let c=0; c<7; c++) {
        let headerView = document.createElement("div");
        let headerText = document.createElement("a");
        headerText.innerHTML = ["Sun","Mon","Tues","Wed","Thu","Fri","Sat"][c];
        headerView.classList.add("schedule-header-node");
        headerView.appendChild(headerText);
        nodeContainerEl.appendChild(headerView);
    }

    for (let r=0; r<6; r++) {
        for (let c=0; c<7; c++) {
            let node = { row: r+1, column: c+1 };
            let nodeView = document.createElement("div");
            let text = document.createElement("a");
            text.id = "schedule-node-text";
            nodeView.appendChild(text);
            nodeView.classList.add("schedule-node");
            nodeContainerEl.appendChild(nodeView);
            nodes.push(node);
            nodeViews.push(nodeView);
        }
    }
};
