#!/bin/bash

v=${1}
cat << EOF

    Regex ${v}Amps = new Regex("&(?!((#[0-9]+)|(#[xX][a-fA-F0-9]+)|([a-zA-Z][a-zA-Z0-9]*));)", RegexOptions.ExplicitCapture | RegexOptions.Compiled);
    Regex ${v}Angles = new Regex(@"<(?![A-Za-z/?\$!])", RegexOptions.ExplicitCapture | RegexOptions.Compiled);

    var ${v}MidS = ${v}Amps.Replace(${v}RawS, "&amp;");
    var ${v}S = ${v}Angles.Replace(${v}MidS, "&lt;");
EOF
