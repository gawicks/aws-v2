curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
==========
Create a user in IAM [admin]
Get the Access Key from IAM for the user and configure aws-cli
==========
aws configure
AWS Access Key ID [None]: AK**\*\***\*\*\***\*\***
AWS Secret Access Key [None]:
Default region name [None]: us-west-1
Default output format [None]: json
==========
aws s3 ls s3://harithaonline.click
==========
aws s3 cp build s3://harithaonline.click --recursive
==========
--- Synchronize server time
sudo apt install ntpdate
sudo ntpdate time.nist.gov
==========
aws cloudfront list-distributions
=========
I created a cloudfront distribution created a _Behaviour_ where I set a wildcard(\*) path to cache everything on the origin server (in this case s3). Here we can configure things like

- https redirection
- compression -
- allowed http methods
- cache policy (TTL)
- # edge functions
  To invalidate the cache (e.g. when a new version of your app is deployed) you create an invalidation.
  Typically you only need to invalidate index.html, since everything else is fingerprinted.
  You could create an invalidation from within your ci/cd pipeline.
  Or you could keep the TTL of index.html low. while keeping the rest high, your choice.
  ==========
  aws cloudfront create-invalidation --distribution-id ${{ secrets.DISTRIBUTION_ID }} --paths "/index.html"
  =========
  This project uses lambda@edge - a feature of amazon cloudfront which enables lambda functions to execute per caching behaviour / event type

viewer request origin request
----------------> cloudfront ---------------> origin
viewer response origin response
<--------------- <----------------

there's also cloudfront functions which is a limited form which is only available for viewer request.

# we used the viewer response event to add security headers.

To authenticate users, create a Cognito user pool
You can create / manage `End Users` in Cognito seperate to IAM which manages your AWS users
Create a user here
And create an `App client` to access the user pool from lambda. Grab it's `Client id`
To reset the password -
aws cognito-idp admin-set-user-password --user-pool-id "us-west-1_Ad6AT6rJB" --username "haritha" --password "p@ssword123ABC" --permanent
=========
pnpm i -g aws-cdk
=========
cdk init --language typescript - This bootstraps a cdk project for you in Typescript
cdk has 3 concepts to bear in mind - App (cdk/bin/cdk.ts) / Stack/ Construct
App is a collection of CloudFormation templates
Stack correspond to a single CF template and it's atomic unit of deployment in CDK
Construct is a CDK only concept that maps to a Resource (Lambda function / S3 bucket etc.)
Define your Constructs and Stack (This example create a single Lambda Fn construct in a single stack)
Import your Stacks and initialize them in your App (cdk/bin/cdk.ts)
Structure your lambda code like this

cdk

- lib
  -- stacks / constructs
- bin
  -- cdk.ts (Your cdk app, import your stacks here)
- package.json (add esbuild here as a devDep, so that cdk can pick it up to bundle your code in lambda)
- cdk.json (configuration for your cdk app, including where the app is)

lambdas

- lambda_1_name
  -- <Your lamda code here>
- lambda_2_name
  -- <Your lamda code here>
- package.json (the common package.json for all your lambdas)

Three important concepts in cdk - `App`, `Stack`, `Construct`
A cdk project typically has only a single

- `App`.
  It can have multiple apps. However the cdk-cli can only synth / deploy a single app at a time. And the `Apps` CANNOT refer to each other.

- A `Stack`
  -- corresponds to a single `cf-template`,
  -- It's the `unit of deployment` in cdk.
  -- Related resources or resources of a similar lifecycle should be stacked together.
  e.g. - Seperate environments (prod, test) of your app could be stacked together, Or your web servers could be stacked together, these could be deleted together when not needed.
  -- A stack can have multiple `constructs`.
- A `Construct`
  -- The `basic unit of abstraction` within cdk
  -- Encapsulates one or more `resources` (typically one)
  -- Has levels `L1` (CFN resource) `L2` (CFN resource with sensible defaults) `L3` (patterns)

To init cdk use `cdk init app --language typescript`
Run `cdk bootstrap` to deploy the `CDKToolkit` stack. It create an s3 bucket to store your deployed cf templates, an IAM role etc. bootstrappig is needed only once per aws account & region.

- `Stack` and `Constructs` constructors take 3 properties -
  -- scope - which is like the parent, the scope of a `Stack` is app. And the parent of a `Construct` is a `Stack`. (Typically you pass `this` here).
  -- id, this is a logical id of this resource that can be referred to by other `Stacks` / `cf-templates` within the `template`. this is NOT the `name` of the resource within aws however.
  -- properties

Use imports from `aws-cdk-lib`
Create an instance of `NodejsFunction` in your `Construct`
`NodejsFunction` will automatically pick up the fact that the package and modules are shared between the lambdas in `lib`
Make sure you install `esbuild` as a `devDependency` on the common package. CDK will use this as a bundler and bundle your lambda and module code automatically.
The `entry` attribute in a `lambda contruct` points to the location of the source file. Remember that this is relative to the `cdk` directory (i.e. where the )
Run `cdk synth` from within the cdk project. This generates the CF templates and bundle your code.
Run `cdk bootstrap` this will setup some foundational resources that CDK needs (such as an s3 bucket)
Ensure you've configure the `aws cli` properly earlier with `aws configure`
Run `cdk deploy --all` this will deploy your stacks on AWS
Done!
Run `cdk destroy MyAwesomeStack` to destroy the stack you created
I've found that the AWS lambda testing console cannot be used with this particular lambda since it's built to respond to `API gateway`, which has a specfic `event` format.
I've now hooked the CDK lambda to API gateway and it works perfect!
TODO: Define API gateway resource in CDK.
=========
Install AWS serverless application model cli
curl "https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-linux-x86_64.zip" -o "aws-sam-cli-linux-x86_64.zip"
unzip aws-sam-cli-linux-x86_64.zip -d sam-installation
sudo ./sam-installation/install
=========
