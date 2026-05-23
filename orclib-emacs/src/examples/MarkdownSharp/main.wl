#!/bin/bash

v=${1:-mdsharp_}
cat << EOF
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Text;
    using System.Text.RegularExpressions;

    namespace MarkDownSharp;

    /*
        Normalize
    */
    var ${v}norm_RawText = Console.In.ReadToEnd();
    if (string.IsNullOrEmpty(${v}norm_RawText))
        System.Environment.Exit(0);

    var ${v}TabWidth = 4;

    ${v}norm_TabWidth = ${v}TabWidth;
    ` ./normalize.wl ${v}norm_ `

    /*
        Hash HTML Blocks
    */
    var ${v}block_TabWidth = ${v}TabWidth;
    var ${v}block_NestDepth = 6;
    ` ./block_pattern.wl ${v}block_ `
    Regex ${v}BlocksHtmlRegex = new Regex(${v}block_Pattern, RegexOptions.Multiline | RegexOptions.IgnorePatternWhitespace);

    var ${v}HtmlBlocks = new Dictionary<string, string>();
    var ${v}BlocksHtml = ${v}BlocksHtml.Replace(${v}norm_Text, new MatchEvaluator(${v}matcheval_M => 
    {
        string ${v}matcheval_Text = ${v}matcheval_M.Groups[1].Value;
        string ${v}matcheval_Key = GetHashKey(${v}matcheval_Text, isHtmlBlock: true);
        ${v}HtmlBlocks[${v}matcheval_Key] = ${v}matcheval_Text;
        return string.Concat("\n\n", ${v}matcheval_Key, "\n\n");
    });

    /*
        Strip Link Definitions
    */
    Regex ${v}LinkDef = new Regex(string.Format(@"
                        ^[ ]{{0,{0}}}\[([^\[\]]+)\]:  # id = \$1
                          [ ]*
                          \n?                   # maybe *one* newline
                          [ ]*
                        <?(\S+?)>?              # url = \$2
                          [ ]*
                          \n?                   # maybe one newline
                          [ ]*
                        (?:
                            (?<=\s)             # lookbehind for whitespace
                            [""(]
                            (.+?)               # title = \$3
                            ["")]
                            [ ]*
                        )?                      # title is optional
                        (?:\n+|\Z)", _tabWidth - 1), RegexOptions.Multiline | RegexOptions.IgnorePatternWhitespace | RegexOptions.Compiled);
    var ${v}Urls = new Dictionary<string, string>();
    var ${v}Titles = new Dictionary<string, string>();
    var ${v}LinkText = ${v}LinkDef.Replace(${v}BlocksHtml, new MatchEvaluator(${v}matcheval_M => 
    {
        string ${v}matcheval_LinkID = ${v}matcheval__M.Groups[1].Value.ToLowerInvariant();


        string ${v}matcheval_ampang_RawS = match.Groups[2].Value;
        ` ./encode_amps_and_angles.wl ${v}matcheval_ampang_ `

        ${v}Urls[${v}matcheval_LinkID] = ${v}matcheval_ampang_S;

        if (${v}matcheval_M.Groups[3]?.Length > 0)
            ${v}Titles[${v}matcheval_LinkID] = ${v}matcheval__M.Groups[3].Value.Replace("\"", "&quot;");

            return "";
    });

    /*
        Block Gamut
    */
    // todo!

    /*
        Unescape
    */
    // todo!


EOF
