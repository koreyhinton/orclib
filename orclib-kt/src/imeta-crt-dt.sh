#!/bin/bash

: "${auto_detect_parser:=org.apache.tika.parser.AutoDetectParser}"
: "${body_content_handler:=org.apache.tika.sax.BodyContentHandler}"
: "${parse_context:=org.apache.tika.parser.ParseContext}"
: "${metadata:=org.apache.tika.metadata.Metadata}"
: "${tika:=org.apache.tika.Tika}"
: "${jiof:=java.io.File}"
: "${jiofis:=java.io.FileInputStream}"

v=${1}
# maps
file_name=${v}FileName

cat << EOF

    /**********************************************************************
     *                                                                    *
     *    imeta-crt-dt: IMAGE METADATA CREATE DATE                        *
     *                                                                    *
     *        command arg:                                                *
     *            |ns_|                                                   *
     *                                                                    *
     *        input:                                                      *
     *            |ns_|FileName (String, indirect)                        *
     *                                                                    *
     *        output:                                                     *
     *            |ns_|Date (String, date-only original time zone chance) *
     *            |ns_|DateTime (String, original time zone chance)       *
     *            |ns_|DateTest (String, raw format orig. tz chance)      *
     *                                                                    *
     **********************************************************************/
    var ${v}Date: String? = null //Date?
    var ${v}DateTest: String? = null
    var ${v}DateTime: String? = null

    val ${v}Metadata = ${metadata}()
    val ${v}Tika = ${tika}()
    ${jiofis}(${jiof}(${!file_name})).use { stream ->
        ${v}Tika.parseToString(stream, ${v}Metadata)
    }
    var ${v}DateRaw = ${v}Metadata.get(org.apache.tika.metadata.TikaCoreProperties.CREATED)
    if (${v}DateRaw == null) {
        ${v}DateRaw = ${v}Metadata.get("Date/Time Original") ?: ${v}Metadata.get("Track Create Date") ?: ${v}Metadata.get("Media Create Date") ?: "Unknown"
    }

    ${v}DateTest = ${v}DateRaw
    if (${v}DateRaw[4] == '-') {
        ${v}Date = ${v}DateRaw.substring(0,10)
        ${v}DateTime = ${v}DateRaw
    } else if (${v}DateRaw[4] == ':') {
        ${v}Date = ${v}DateRaw.replace(":", "-")?.substring(0,10)
        ${v}DateTime = (${v}DateRaw.replace(":", "-")?.substring(0,10)) + (${v}DateRaw.substring(10))
    }

    ${v}Metadata.names().forEach {
        if (listOf("Date/Time Original", "Track Create Date", "Create Date", "Media Create Date").contains(it)) {
            //println("                    " + it + ": " + ${v}Metadata.get(it))
        }
    }

    /**********************************************************************
     *                                                                    *
     * :END: imeta-crt-dt: IMAGE METADATA CREATE DATE                     *
     *                                                                    *
     **********************************************************************/

EOF
