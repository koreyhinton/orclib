# imperative orc (orchestration) library for kotlin using bash meta language

## Image metadata

Dependencies (must be included in app/build.gradle.kts)

```kotlin
dependencies {
    implementation("org.apache.tika:tika-core:3.0.0")
    implementation("org.apache.tika:tika-parsers-standard-package:3.0.0")
}
```

Directly embed imeta-*.sh lib snippets with meta language (bash heredoc) syntax

main.sh

```sh
#!/bin/bash
v=${1:-main_}
# maps
. ${NSMAP}/nsmap ${v}FileName imeta_dvc_ imeta_dt_
cat << EOF
    package org.example
    fun main(args: Array<String>) {
        val ${v}FileName = args[0]
        ` ${ORC}/imeta-crt-dt.sh ${v}imeta_dt_ `
        println(${v}imeta_dt_Date + " (" + ${v}imeta_dt_DateTime + ")")

        ` ${ORC}/imeta-crt-dvc.sh ${v}imeta_dvc_ `
        println(${v}imeta_dvc_Make + ", " + ${v}imeta_dvc_Model)
    }
EOF
```

Generate kotlin file

```sh
export ORC=${PWD}/src
export NSMAP=${PWD}/../orclib-bash/src
chmod +x main.sh
./main.sh > ./main.kt
```

Namespace Maps

Maps allow you to use the variable according to the current variable namespace,
without causing re-assignment in the output kotlin code via indirect bash var
references to be expanded by the imeta lib scripts

Mapping steps explained:

```txt
. ${NSMAP}/nsmap main_FileName imeta_dt_
    => export main_imeta_dt_FileName=main_Filename
val main_Filename = args[0]
${ORC}/imeta-crt-dt.sh main_imeta_dt_
    => file_name=main_imeta_dt_FileName
    => ${!file_name}
    => main_Filename  # library code is able to expand to the original variable!
```
