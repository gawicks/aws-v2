curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
==========
Create a user in IAM [admin]
Get the Access Key from IAM for the user and configure aws-cli
==========
aws configure
AWS Access Key ID [None]: AK***************
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
I created a cloudfront distribution created a *Behaviour* where I set a wildcard(*) path to cache everything on the origin server (in this case s3). Here we can configure things like 
- https redirection 
- compression -
- allowed http methods 
- cache policy (TTL) 
- edge functions
=========
To invalidate the cache (e.g. when a new version of your app is deployed) you create an invalidation.
Typically you only need to invalidate index.html, since everything else is fingerprinted.
You could create an invalidation from within your ci/cd pipeline.
Or you could keep the TTL of index.html low. while keeping the rest high, your choice.
==========
aws cloudfront create-invalidation --distribution-id ${{ secrets.DISTRIBUTION_ID }} --paths "/index.html"
=========
This project uses lambda@edge - a feature of amazon cloudfront which enables lambda functions to execute per caching behaviour / event type

viewer request              origin request
----------------> cloudfront --------------->   origin
viewer response             origin response
<---------------            <----------------   

there's also cloudfront functions which is a limited form which is only available for viewer request.

we used the viewer response event to add security headers.
=========
To authenticate users, create a Cognito user pool
You can create / manage `End Users` in Cognito seperate to IAM which manages your AWS users
Create a user here
And create an `App client` to access the user pool from lambda. Grab it's `Client id`