#!/bin/bash

: "${auto_detect_parser:=org.apache.tika.parser.AutoDetectParser}"
: "${body_content_handler:=org.apache.tika.sax.BodyContentHandler}"
: "${parse_context:=org.apache.tika.parser.ParseContext}"
: "${metadata:=org.apache.tika.metadata.Metadata}"
: "${jiof:=java.io.File}"
: "${jiofis:=java.io.FileInputStream}"

v=${1}
# maps
file_name=${v}FileName

cat << EOF

    /**********************************************************************
     *                                                                    *
     *    imeta-crt-dvc: IMAGE METADATA CREATE DEVICE                     *
     *                                                                    *
     *        command arg:                                                *
     *            |ns_|                                                   *
     *                                                                    *
     *        input:                                                      *
     *            |ns_|FileName (String, indirect)                        *
     *                                                                    *
     *        output:                                                     *
     *            |ns_|Make (String)                                      *
     *            |ns_|Model (String)                                     *
     *                                                                    *
     **********************************************************************/
    val ${v}Parser = ${auto_detect_parser}()
    val ${v}Metadata = ${metadata}()
    val ${v}Handler = ${body_content_handler}(-1) // -1 for unlimited content sz
    val ${v}Context = ${parse_context}()

    ${jiofis}(${jiof}(${!file_name})).use { stream ->
        ${v}Parser.parse(stream, ${v}Handler, ${v}Metadata, ${v}Context)
    }

    val ${v}HandledList = listOf(
        "Exif IFD0:Make",
        "tiff:Make",
        "Make",
        "Exif IFD0:Model",
        "tiff:Model",
        "Canon Model ID",
        "Model"
    )
    val ${v}IgnoredList = listOf(
        "Exif SubIFD:Lens Model",
        "Exif SubIFD:Lens Make"
    )

    ${v}Metadata.names().forEach {
        val ${v}HasMakeOrModelTag = it.contains("model", ignoreCase = true) ||
            it.contains("make", ignoreCase = true) ||
            it.contains("camera", ignoreCase = true)
        val ${v}IsKnownTag = ${v}HandledList.contains(it) ||
            ${v}IgnoredList.contains(it)
        val ${v}NewTagFound = !${v}IsKnownTag
        if (${v}HasMakeOrModelTag && ${v}NewTagFound) {
            println(it + ": " + ${v}Metadata.get(it))
        }
    }

    val ${v}Make = ${v}Metadata.get("Exif IFD0:Make") ?:
        ${v}Metadata.get("tiff:Make") ?: ${v}Metadata.get("Make") ?: "Unknown"
    val ${v}Model = ${v}Metadata.get("Exif IFD0:Model") ?:
        ${v}Metadata.get("tiff:Model") ?: ${v}Metadata.get("Model") ?:
        ${v}Metadata.get("Camera Model Name") ?:
        ${v}Metadata.get("Canon Model ID") ?: "Unknown"

    /**********************************************************************
     *                                                                    *
     * :END: imeta-crt-dvc: IMAGE METADATA CREATE DEVICE                  *
     *                                                                    *
     **********************************************************************/

EOF
