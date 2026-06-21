#!/bin/bash

: "${reg:=software.amazon.awssdk.regions.Region}"
: "${cred:=software.amazon.awssdk.auth.credentials.AwsBasicCredentials}"
: "${cred_prov:=software.amazon.awssdk.auth.credentials.StaticCredentialsProvider}"
: "${gor:=software.amazon.awssdk.services.s3.model.GetObjectRequest}"
: "${psigner:=software.amazon.awssdk.services.s3.presigner.S3Presigner}"
: "${uri:=java.net.URI}"
: "${dura:=java.time.Duration}"
: "${gopr:=software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest}"
v=${1}
# maps
bucket_name=${v}BucketName
file_name=${v}FileName

cat << EOF

    /**********************************************************************
     *                                                                    *
     *    s3-presigned-url: S3 PRESIGNED URL                              *
     *                                                                    *
     *        command arg:                                                *
     *            |ns_|                                                   *
     *                                                                    *
     *        input:                                                      *
     *            |ns_|BucketName (String, indirect)                      *
     *            |ns_|FileName (String, indirect)                        *
     *                                                                    *
     *        output:                                                     *
     *            |ns_|Url (String?)                                      *
     *                                                                    *
     **********************************************************************/

    var ${v}Url: String? = null
    try {
        val ${v}PSigner = ${psigner}.builder()
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

        val ${v}Request = ${gor}.builder()
            .bucket(${!bucket_name})
            .key(${!file_name})
            .build()
        val ${v}PresignedRequest: ${gopr} =
            ${gopr}.builder()
            .signatureDuration(${dura}.ofSeconds(1000))
            .getObjectRequest(${v}Request)
            .build()
        ${v}Url = ${v}PSigner.presignGetObject(${v}PresignedRequest).url().toString()
    } catch(e: Exception) {
        println("Warning: " + e.javaClass.simpleName  +
            " exception. Attempted to retrieve s3 file " + ${!file_name} +
            " and failed with exception: " + e.message)
    }

    /**********************************************************************
     *                                                                    *
     * :END: s3-presigned-url: S3 PRESIGNED URL                           *
     *                                                                    *
     **********************************************************************/

EOF
