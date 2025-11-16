import { parallelCollection } from './orc.js';

window.schedulerDispatcher = function(schedule, scheduler) {

    if (window.schedulerDispatch.initialized == 0)
    {
        var nodeContainerEl = document.getElementById("scheduler-picker-body-calendar");
        var nodes = [];
        var nodeViews = [];
        window.schedulerDispatch.initialized = 1;
        window.schedulerDispatch.pCollection =
            parallelCollection(nodes, nodeViews);
        console.log("creating views");
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
        return; // initialize call just returns early without dispatching
    }

    window.schedulerDispatch.pCollection.eachOrOnce((node, nodeView, frame) => {
        schedule.calendarNode = node;
        schedule.calendarNodeView = nodeView;
        schedule.frame = frame ? 1 : 0;
        scheduler(schedule);
    });
};
