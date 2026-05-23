#!/bin/bash

v=${1}
cat << EOF
    ${v}Valid = false;
    ${v}Line.Length = 0;
EOF
