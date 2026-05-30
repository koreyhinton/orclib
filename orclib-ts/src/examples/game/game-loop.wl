#!/bin/bash

v=${1}
cat << EOF

    ${v}Container.style.backgroundColor = "red";
    // console.log("tick, ${v}Container");
    if (${v}EventPoller.polled(${v}EventCharacterKey))
    {
        let e = ${v}EventPoller.event(${v}EventCharacterKey);
        if (e instanceof KeyboardEvent && e.key == "ArrowRight")
        {
            ${v}char_Character.style.left = (${v}char_Character.offsetLeft + 20) + "px";
        }
        else if (e instanceof KeyboardEvent && e.key == "ArrowLeft")
        {
            ${v}char_Character.style.left = (${v}char_Character.offsetLeft - 20) + "px";
        }
    }

EOF
