import aws from 'aws-sdk';

import config from "aws-sdk/lib/maintenance_mode_message.js"
config.suppress = true

const endpoint = new aws.Endpoint(process.env.ENDPOINT_S3)

const s3 = new aws.S3({
    endpoint,
    region: 'sa-east-1',
    credentials: {
        accessKeyId: process.env.KEY_ID,
        secretAccessKey: process.env.APP_KEY
    }
})

export async function inserirImagem(path, buffer, mimetype) {

    const arquivo = await s3.upload({
        Bucket: process.env.S3_BUCKET,
        Key: path,
        Body: buffer,
        ContentType: mimetype
    }).promise()

    return ({
        url: arquivo.Location,
        path: arquivo.Key
    })

}

export async function deletarImagem(path) {

    await s3.deleteObject({
        Bucket: process.env.S3_BUCKET,
        Key: path
    }).promise()
}


