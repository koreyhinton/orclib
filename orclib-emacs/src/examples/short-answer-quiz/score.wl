#!/bin/bash

v=$1
cat << EOF

    if (${v}Ans == ${v}UsrAns)
    {
        stdout.printf("Correct\n");
    }
    else
    {
        stdout.printf("Incorrect\n");
    }

EOF
