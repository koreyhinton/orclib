#!/bin/bash

v=${1}
cat << EOF

    var ${v}Parser = new Parser();
    ${v}Parser.load_from_file(${v}FilePath);
    var ${v}Root = ${v}Parser.get_root();
    var ${v}RootObj = ${v}Root.get_object();
    ${v}QuizAnswerType = ${v}RootObj.get_string_member("AnswerDataType");
    ${v}QuizName = ${v}RootObj.get_string_member("Name");
    ${v}QAs = ${v}RootObj.get_array_member("QAs");
    stdout.printf("%s (ans. type: %s)\n", ${v}QuizName, ${v}QuizAnswerType);

EOF
