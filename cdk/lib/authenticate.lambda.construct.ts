import { Stack, StackProps, Duration } from "aws-cdk-lib";
import { Construct } from "constructs"
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from "path"
export class AuthenticateLambda extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id)
        const authLambda = new NodejsFunction(this, 'AuthenticateLambda', {
            runtime: Runtime.NODEJS_18_X,
            memorySize: 512, // takes ~200mb
            timeout: Duration.seconds(1), // takes ~300ms
            handler: 'handler',
            // CDK finds the package and modules by convention and packages them up using esbuild.
            // It's not very well documented how cdk does it, but it seems to pick up package.json s in the same order as normal node.js package resolution (current dir then parent dir and so on)
            entry: path.join(__dirname, "../../lambdas/authenticate/authenticate.ts")
        })
    }
}