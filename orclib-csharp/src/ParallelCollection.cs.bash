#!/bin/bash

src="${BASH_SOURCE[0]}"

if [[ "$src" != "$0" ]]; then
    ec=1
    echo "Error, must not source the script! ec=${ec}" 1>&2
    return $ec
fi

src_full=$(realpath "$src")
cs_file="${src_full%.bash}"

exit_msg_ec() {
    msg="$1"
    ec="$2"
    case $- in
        *i*)
            echo "WARNING: Cannot exit from interactive shell" 1>&2
            echo "${msg}. inner_ec=${ec}. ec=2" 1>&2
            return 2;
    esac
    echo "${msg}. ec=${ec}" 1>&2
    exit $ec
}

if [[ ! -e "$cs_file" ]]; then
    exit_msg_ec "Error, expected a previously generated cs file at path: ${cs_file}" 3
fi

hdr=$(head -1 "$cs_file" 2>>/dev/null)
if [[ $? -gt 0 || "$hdr" != "/* OrcLib auto-generated code */" ]]; then
    exit_msg_ec "Error, expected header line in ${cs_file} :/* OrcLib auto-generated code */ " 4
fi

echo "$hdr" > "$cs_file"

cat <<'LEADING' >> "$cs_file"
using System;
using System.Collections.Generic;
namespace OrcLib
{
    public interface IParallelQueue
    {
        void Add<T>(T item);
    }
    public class ParallelCollectionBase
    {
        protected readonly Queue<object> _queuedAdditions = new();
    }
LEADING

nl=$'\n'
properties=""
seq=""
seq_list=""
seq_map=""
tabtab="        ";
tabtabtab="            ";
for n in {1..16};
do
    if [[ -z "$seq" ]]; then
        seq="T${n}"
    else
        seq="${seq}, T${n}"
    fi
    if [[ -z "$seq_list" ]]; then
        seq_list="List<T${n}>? list${n} = null"
    else
        seq_list="${seq_list}, List<T${n}>? list${n} = null"
    fi
    seq_map="${seq_map}_list${n} = list${n} ?? new List<T${n}>();${nl}${tabtabtab}"
    properties="${properties}${nl}${tabtab}private readonly List<T${n}> _list${n};"
    cat <<CLASS >> "$cs_file"
    public class ParallelCollection<$seq> : ParallelCollectionBase
    {
        ${properties}
        public ParallelCollection(${seq_list})
        {
            ${seq_map}
        }
    }
CLASS
done
