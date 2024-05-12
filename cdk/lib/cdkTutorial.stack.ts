import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Alarm } from "aws-cdk-lib/aws-cloudwatch";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import * as path from "path";
export class CDKTutorialStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        new Bucket(this, 'HarithaBucket', {
            bucketName: 'haritha-bucket-120524',
            versioned: true,
            publicReadAccess: false,
            removalPolicy: RemovalPolicy.DESTROY
        })
        new Table(this, 'HarithasDynamoDBTable', {
            tableName: 'haritha-dynamodb-table-120524',
            partitionKey: { name: 'id', type: AttributeType.STRING },
            sortKey: { name: 'timestamp', type: AttributeType.STRING },
            removalPolicy: RemovalPolicy.DESTROY
        })
        const harithaLambda = new NodejsFunction(this, 'HarithaLambda', {
            functionName: 'haritha-lambda-120524',
            runtime: Runtime.NODEJS_18_X,
            entry: '../lambdas/haritha-lambda/index.ts',
            handler: 'handler',
        })
        new Alarm(this, 'HarithaLambdaAlarm', {
            alarmName: 'haritha-lambda-alarm-120524',
            metric: harithaLambda.metricErrors(),
            threshold: 1,
            evaluationPeriods: 1, // The number of periods to evaluate the metric against
            // period: 5 , Strangely the period is 5 minutes and cdk doesn't allow changing it?
        })
    }
}