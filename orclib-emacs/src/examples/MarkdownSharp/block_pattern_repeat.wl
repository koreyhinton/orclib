#!/bin/bash

v=${1}
cat << EOF
            var ${v}Sb = new StringBuilder(${v}Text.Length * count);
            for (int ${v}I = 0; ${v}I < count; ${v}I++)
                sb.Append(${v}Text);
            ${v}RepeatedText = ${v}Sb.ToString();
EOF
