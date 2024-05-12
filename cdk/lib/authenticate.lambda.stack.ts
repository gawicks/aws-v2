import { Stack, StackProps, Duration } from "aws-cdk-lib";
import { Construct } from "constructs"
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from "path"
import { AuthenticateLambda } from "./authenticate.lambda.construct";
export class AuthenticateLambdaStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)
        new AuthenticateLambda(this, 'AuthenticateLambda');
    }
}