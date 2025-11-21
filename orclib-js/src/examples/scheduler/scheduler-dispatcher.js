import { parallelCollection } from '../../orc.js';

window.schedulerDispatcher = function(schedule, scheduler) {
    window.schedulerDispatch.pCollection.eachOrOnce((node, nodeView, frame) => {
        schedule.calendarNode = node;
        schedule.calendarNodeView = nodeView;
        schedule.frame = frame;
        scheduler(schedule);
    });
};
