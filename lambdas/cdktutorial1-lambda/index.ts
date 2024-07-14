import { S3 } from "aws-sdk"
export async function handler(event) {
    const client = new S3()
    const response = await client.getObject({
        Bucket: 'cdktutorial1-bucket-120524',
        Key: 'accountStatus.json'
    }).promise()
    const data = response.Body?.toString('utf-8')
    const accountDetails = JSON.parse(data)
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(accountDetails)
    };
}

