import { Stack, StackProps } from 'aws-cdk-lib';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';

export class CDKTutorialStack1 extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        new Bucket(this, 'CDKTutorial1Bucket', {
            bucketName: 'cdktutorial1-bucket-120524',
            versioned: true,
        })
        // IAM Role
        const balanceStatusRole = new Role(this, 'CDKTutorial1_BalanceStatusRole', {
            roleName: 'get-balance-status-role-120524',
            assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
            description: 'Role for lambda to get balance status from s3',
        })
        // A policy is a document that defines a set of permissions. It can be attached to an identity (user, group, or role) or a resource (bucket, object, queue, etc).
        balanceStatusRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'))

        const bankingLambdaFn = new NodejsFunction(this, 'CDKTutorial1Lambda', {
            functionName: 'cdktutorial1-lambda-120524',
            entry: '../lambdas/cdktutorial1-lambda/index.ts',
            handler: 'handler',
            runtime: Runtime.NODEJS_18_X,
            role: balanceStatusRole

        })

        const bankingRestApi = new LambdaRestApi(this, 'CDKTutorial1API', {
            handler: bankingLambdaFn,
            restApiName: 'cdktutorial1-api-120524',
            // deployOptions: {
            //     stageName: 'prod'
            // }
            proxy: false, // false means we are defining the resources and methods ourselves
        })
        const bankStatus = bankingRestApi.root.addResource('bank-status')
        bankStatus.addMethod('GET')
    }
}