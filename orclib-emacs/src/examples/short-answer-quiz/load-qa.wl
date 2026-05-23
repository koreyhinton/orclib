#!/bin/bash

v=${1}
cat << EOF

    ${v}TitleLabel.set_label("<b>"+${v}QAs.get_element(${v}I).get_object().get_string_member("Q")+"</b>");
    ${v}TextView.buffer.text = "?";
EOF
