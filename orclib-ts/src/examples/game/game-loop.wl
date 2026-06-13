#!/bin/bash

v=${1}
cat << EOF

    ${v}Container.style.backgroundColor = "red";
    // console.log("tick, ${v}Container");
    if (${v}EventPoller.polled(${v}EventCharacterKey))
    {
        let ${v}E = ${v}EventPoller.event(${v}EventCharacterKey);
        if (${v}E instanceof KeyboardEvent && ${v}E.key == "ArrowRight")
        {
            ${v}char_Character.style.left = (${v}char_Character.offsetLeft + 20) + "px";
            ${v}Log.log(
            \`
                <p style="color:white">you take a step to the east</p>
            \`);
        }
        else if (${v}E instanceof KeyboardEvent && ${v}E.key == "ArrowLeft")
        {
            ${v}char_Character.style.left = (${v}char_Character.offsetLeft - 20) + "px";
            ${v}Log.log(
            \`
                <p style="color:white">you take a step to the west</p>
            \`);
        }
    }

EOF
