#!/bin/bash

: "${hor:=software.amazon.awssdk.services.s3.model.HeadObjectRequest}"
: "${s3c:=software.amazon.awssdk.services.s3.S3Client}"
: "${reg:=software.amazon.awssdk.regions.Region}"
: "${cred:=software.amazon.awssdk.auth.credentials.AwsBasicCredentials}"
: "${cred_prov:=software.amazon.awssdk.auth.credentials.StaticCredentialsProvider}"
: "${uri:=java.net.URI}"
v=${1}
# maps
bucket_name=${v}BucketName

cat << EOF

    /**********************************************************************
     *                                                                    *
     *    s3-file-exists: S3 FILE EXISTS                                  *
     *                                                                    *
     *        command arg:                                                *
     *            |ns_|                                                   *
     *                                                                    *
     *        input:                                                      *
     *            |ns_|BucketName (String, indirect)                      *
     *            |ns_|FileName (String)                                  *
     *                                                                    *
     *        output:                                                     *
     *            |ns_|Exists (Boolean)                                   *
     *            |ns_|Bytes (Long?)                                      *
     *                                                                    *
     **********************************************************************/

    var ${v}Exists: Boolean = false
    var ${v}Bytes: Long? = null
    try {
        val ${v}S3Client = ${s3c}.builder()
            .region(${reg}.of(System.getProperty("AWS_REGION")))
            .credentialsProvider(
                ${cred_prov}.create(
                    ${cred}.create(
                        System.getProperty("AWS_ACCESS_KEY_ID"),
                        System.getProperty("AWS_SECRET_ACCESS_KEY")
                    )
                )
            )
            .endpointOverride(${uri}.create(System.getProperty("AWS_URL")))
            .build()
        val ${v}Request = ${hor}.builder()
            .bucket(${!bucket_name})
            .key(${v}FileName)
            .build()
        var ${v}Response = ${v}S3Client.headObject(${v}Request)
        ${v}Exists = true
        ${v}Bytes = ${v}Response.contentLength()
    } catch(e: Exception) {
        println("Warning: " + e.javaClass.simpleName  +
            " exception. Attempted to retrieve s3 file " + ${v}FileName +
            " and failed with exception: " + e.message)
    }

    /**********************************************************************
     *                                                                    *
     * :END: s3-file-exists: S3 FILE EXISTS                               *
     *                                                                    *
     **********************************************************************/

EOF
