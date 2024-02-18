import * as AWS from 'aws-sdk';

export const handler = async (event: {
    body: string
}) => {
    try {
        console.log(`event ${JSON.stringify(event)}`);

        const payload: {
            username: string;
            password: string;
        } = JSON.parse(event.body);
        const username = payload.username;
        const password = payload.password;

        console.log(`payload ${payload}`);
        console.log(`username ${username}`);
        console.log(`password ${password}`);

        const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
            region: 'us-west-1'
        });
        const authParams = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: '663criu3vf45sp1tg4a9q9of6',
            AuthParameters: {
                USERNAME: username,
                PASSWORD: password
            }
        };

        const authResponse = await cognitoIdentityServiceProvider.initiateAuth(authParams).promise();
        if (!authResponse.AuthenticationResult) {
            throw new Error()
        }

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({
                message: 'Authentication successful',
                tokens: authResponse.AuthenticationResult.AccessToken,
                // Add other relevant information from authResponse
            })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 401,
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({ message: 'Invalid username or password' })
        };
    }
};
