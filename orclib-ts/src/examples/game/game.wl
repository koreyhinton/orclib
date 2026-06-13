#!/bin/bash

v=${1:-index_game_}
cat << EOF
    import { EventPoller } from '../../../src/orc.ts';
    import { VisualLog } from '../../../src/orc.ts';

    window.addEventListener("DOMContentLoaded", () => {

        const interval = 600;
        const ${v}loop_EventPoller = new EventPoller();
        const ${v}loop_Container = document.getElementById("${v}loop_Container");
        const ${v}loop_char_Character = document.getElementById("${v}loop_char_Character");
        if (!${v}loop_Container || !${v}loop_char_Character)
            throw new Error("requires static html with ids: ${v}loop_Container, ${v}loop_char_Character");

        const ${v}loop_EventCharacterKey = 'CharacterKey';
        ${v}loop_EventPoller.register(document.body, 'keyup', ${v}loop_EventCharacterKey);

        const ${v}loop_Log = new VisualLog('${v}loop_log');

        setInterval(() => {
            ` ./game-loop.wl  ${v}loop_ `
        }, 16);
    });

EOF
