import { commandQuery, commandQueryConfig } from './orc.js';

((strict) => {commandQueryConfig.strictMode = strict; window.scheduler = function(s) {

commandQuery(
    s.hover.x > -1 &&
    s.hover.x > -1 &&
    s.lastHover.x !== s.hover.x &&
    s.lastHover.y !== s.hover.y, () => {
        console.log("moved");
    }
);

}})(1);
