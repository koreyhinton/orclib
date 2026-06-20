#!/bin/bash

# exif:Make/Model > tiff:Make/Model > Make/Model
# make1, model1, make2, model2, expectMake, expectModel
e="Exif IFD0"
t=tiff
scenarios=$(cat << EOF
${e}:Make,${e}:Model,${t}:Make,${t}:Model,${e}:MakeV,${e}:ModelV
${t}:Make,${t}:Model,${e}:Make,${e}:Model,${e}:MakeV,${e}:ModelV
${e}:Make,${e}:Model,Make,Model,${e}:MakeV,${e}:ModelV
Make,Model,${e}:Make,${e}:Model,${e}:MakeV,${e}:ModelV
${t}:Make,${t}:Model,Make,Model,${t}:MakeV,${t}:ModelV
Make,Model,${t}:Make,${t}:Model,${t}:MakeV,${t}:ModelV
EOF
)

echo package org.example
echo import java.io.Closeable

i=0
saveIFS="$IFS"
IFS=$'\n'
for s in $scenarios
do
    s1=$(echo "$s" | cut -d ',' -f1)
    s2=$(echo "$s" | cut -d ',' -f2)
    s3=$(echo "$s" | cut -d ',' -f3)
    s4=$(echo "$s" | cut -d ',' -f4)
    cat << EOF
        class s${i}_ContextMock() {
        }
        class s${i}_ParserMock() {
            fun parse(stream: s${i}_JiofisMock, handler: s${i}_HandlerMock, metadata: s${i}_MetadataMock, context: s${i}_ContextMock): String {
                return ""
            }
        }
        class s${i}_MetadataMock() {
            fun names(): List<String> {
                return listOf("${s1}","${s2}","${s3}","${s4}")
            }
            fun get(name: String): String? {
                if (listOf("${s1}","${s2}","${s3}","${s4}").contains(name))
                    return name + "V"
                return null
            }
        }
        class s${i}_HandlerMock(val n: Int) {
        }
        class s${i}_JiofMock() {
        }
        class s${i}_JiofisMock(private val m: s${i}_JiofMock): Closeable {
            override fun close() {}
        }

EOF
    ((i++))
done
IFS="$saveIFS"

cat << EOF
    fun main(args: Array<String>) {
        println("Image Metadata Create Device Precedence Test...")
        var pass = true
EOF

export file_name="n/a"
i=0
saveIFS="$IFS"
IFS=$'\n'
for s in $scenarios
do
    s1=$(echo "$s" | cut -d ',' -f1)
    s2=$(echo "$s" | cut -d ',' -f2)
    s3=$(echo "$s" | cut -d ',' -f3)
    s4=$(echo "$s" | cut -d ',' -f4)
    expectMake=$(echo "$s" | cut -d ',' -f5)
    expectModel=$(echo "$s" | cut -d ',' -f6)

    export auto_detect_parser=s${i}_ParserMock
    export body_content_handler=s${i}_HandlerMock
    export parse_context=s${i}_ContextMock
    export metadata=s${i}_MetadataMock
    export jiof=s${i}_JiofMock
    export jiofis=s${i}_JiofisMock

    cat << EOF
        // scenario: ${s}
        val s${i}_FileName="file_name"
        ` ../src/imeta-crt-dvc.sh s${i}_ `
        if (s${i}_Make == "${expectMake}" && s${i}_Model == "${expectModel}")
            {}
        else {
            pass = false
            println("...FAIL: " + "$s" + ". actual==expect: " + "\$s${i}_Make == ${expectMake} && \$s${i}_Model == ${expectModel}")
        }
EOF
    ((i++))
done
IFS="$saveIFS"


cat << EOF
        if (pass)
            println("....PASS")
    }
EOF
