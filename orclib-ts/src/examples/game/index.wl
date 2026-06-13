#!/bin/bash

v=${1:-index_}
cat << EOF

<!DOCTYPE html>
<html>
    <head>
        <style>
            body {
                display: flex;
                align-items: center;
                min-height: 100vh;
                background-color: black;
            }
            #${v}game_loop_Container {
                width:  640px;
                height: 360px;
                margin: 0 auto;
                position: relative;
            }
            #${v}game_loop_char_Character {
                position: absolute;
                left: 320px;
                bottom: 0px;
            }
            #${v}game_loop_char_Character svg {
            }
        </style>
        <script type="module" src="game.ts"></script>
    </head>
    <body>
        <div id="${v}game_loop_Container">
            ` ./character.wl ${v}game_loop_char_  `
        </div>
        <div id="${v}game_loop_log">
        </div>
    </body>
</html>

EOF
