#!/bin/bash

v=${1}
cat << EOF
    var ${v}TextBldr = new StringBuilder(${v}RawText.Length);
    var ${v}reset_Line = new StringBuilder();
    var ${v}TabWidth = 4;
    bool ` ./normalize_reset.wl ${v}reset_ `

    for (var ${v}I = 0; ${v}I < ${v}RawText.Length; ${v}I++)
    {
        switch (${v}RawText[${v}I])
        {
            case '\n':
                if (${v}reset_Valid) ${v}text.Append(${v}reset_Line);
                ${v}TextBldr.Append('\n');
                ` ./normalize_reset.wl ${v}reset_ `
                break;
            case '\r':
                if ((${v}I < ${v}RawText.Length - 1) && (${v}RawText[${v}I + 1] != '\n'))
                {
                    if (${v}reset_Valid) ${v}TextBldr.Append(${v}reset_Line);
                    ${v}TextBldr.Append('\n');
                    ` ./normalize_reset.wl ${v}reset_ `
                }
                break;
            case '\t':
                int ${v}Width = (${v}TabWidth - (${v}reset_Line.Length % ${v}TabWidth));
                for (int ${v}K = 0; ${v}K < width; ${v}K++)
                    ${v}reset_Line.Append(' ');
                break;
            case '\x1A':
                break;
            default:
                if (!${v}reset_Valid && ${v}RawText[${v}I] != ' ') ${v}reset_Valid = true;
                    ${v}reset_Line.Append(${v}RawText[${v}I]);
                break;
        }
    }

    if (${v}reset_Valid) ${v}TextBldr.Append(${v}reset_Line);
    var ${v}Text = ${v}TextBldr.Append('\n\n\n').ToString();

EOF
