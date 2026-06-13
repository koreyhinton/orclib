# meta programming with bash and nsmap

Bash meta programming allows for purely imperative coding while still enabling modular script reuse. The nsmap script will allow you to share variables between scripts without having to map variables with variable assignments into each script namespace.

## naming conventions

To distinguish between namespace prefix, variable suffix for normal bash variables:

* namespace goes in the snake_case prefix
* variable name goes in the PascalCase suffix


```sh
name_space_VariableName
```

Bash variables used for namespace mapping resolution via indirect expansion are purely in snake_case only as they won't show up anyway in the output program (only the indirect reference name will):

```sh
# maps
file_name=etc
# ...
${!file_name}
```

## NSMAP variable

You must export NSMAP to be the ./src path, in your build script if you don't want to add it to ~/.profile (or ~/.bashrc).

```sh
export NSMAP=/path/to/orclib/orclib-bash/src
```

## nsmap

Use ./src/nsmap script to resolve shared variable references while keeping namespace prefixes.

simple nsmap usage example:

```sh
. ${NSMAP}/nsmap args main_routine1_ main_routine2_
#     exports:    main_routine1_Args=args
#     exports:    main_routine2_Args=args
echo ${main_routine1_Args}
# > args
echo ${main_routine2_Args}
# > args
```

advanced nsmap usage example (tack on a more specific sub-namespace):

```sh
main_Args=args
. ${NSMAP}/nsmap main_Args routine1_ routine2_
#     exports:    main_routine1_Args=main_Args
#     exports:    main_routine2_Args=main_Args
echo ${main_routine1_Args}
# > main_Args
echo ${main_routine2_Args}
# > main_Args
echo ${!main_routine1_Args}
# > args
echo ${!main_routine2_Args}
# > args

# ^^^ everything resolves back to main function's args variable
```

## heredocs

heredoc syntax is used to print out the main entry point file and invokes subscripts with backticks and passing in the namespace for that file and each subscript prints out the output language code:

main.sh

```sh
v=${1:-main_}
cat << EOF

    main() {
        ${v}print_Value = "World"
        ` ./print.sh ${v}print_ `
    }

EOF
```

print.sh

```sh
v=$1
cat << EOF
        print("Hello, " + ${v}Value)
EOF
```



## kotlin example

build script

```sh
export NSMAP=/path/to/this/repo/orclib-bash/src
cd ./path/to/kotlin/files
./KotlinController.sh > ./KotlinController.kt || echo fail
cd -
gradlew build
# etc
```

KotlinController.sh

```sh
#!/bin/bash
v=${1:-ktc_} # kotlin controller namespace
# maps
. ${NSMAP}/nsmap filePath ${v} ${v}imeta_device_ ${v}imeta_date_
file_path=${v}FilePath
cat << EOF
    // ...
    @RestController
    @RequestMapping("/images")
    class KotlinController() {
        @GetMapping("/info")
        fun info(@RequestParam filePath: String): ResponseEntity<Map<String, Any>> {
    
            // filePath gets shared to subscripts via nsmap at top of this file
            ` ./KotlinController-imeta-device.sh ${v}imeta_device_ `
            ` ./KotlinController-imeta-date.sh ${v}imeta_date_ `
            return ResponseEntity.ok(
                mapOf(
                    "filePath" to ${!file_path},
                    "date" to ${v}imeta_date_Date, // normal non-shared namespace variable access
                    "model" to ${v}imeta_device_Model
                )
            )
        }
    }
EOF
```

KotlinController-imeta-device.sh

```sh
#!/bin/bash
v=${1}
# maps
file_name=${v}FilePath
cat << EOF

    val ${v}Metadata = ImageMetadataReader.readMetadata(File(${!file_name}))
    val ${v}ExifDirectory = ${v}Metadata.getFirstDirectoryOfType(ExifIFD0Directory::class.java)
    var ${v}Make: String? = null
    var ${v}Model: String? = null
    if (${v}ExifDirectory != null) {
        ${v}Make = ${v}ExifDirectory.getString(ExifIFD0Directory.TAG_MAKE)
        ${v}Model = ${v}ExifDirectory.getString(ExifIFD0Directory.TAG_MODEL)
    }
EOF
```

KotlinController-imeta-date.sh

```sh
#!/bin/bash
v=${1}
# maps
file_name=${v}FilePath
cat << EOF

    var ${v}Date: Date?
    try {
        val ${v}Metadata = ImageMetadataReader.readMetadata(File(${!file_name}))
        val ${v}ExifDirectory = ${v}Metadata.getFirstDirectoryOfType(ExifSubIFDDirectory::class.java)
        ${v}Date = ${v}ExifDirectory?.getDate(ExifSubIFDDirectory.TAG_DATETIME_ORIGINAL)

    } catch (e: Exception) {
        ${v}Date = null
        println("Extract file date error:" + e)
    }

EOF
```
