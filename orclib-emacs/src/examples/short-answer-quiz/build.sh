#!/bin/sh

set -eu

if [ -e ./main.vala ]; then
    cp ./main.vala ./main.vala_$(date +"%y%m%d_%H%M_%S_%N")
fi
temp="$(mktemp)"

./main.wl > "$temp"
mv "$temp" ./main.vala
valac --pkg json-glib-1.0 --pkg gtk+-3.0 --pkg posix main.vala -o quiz
