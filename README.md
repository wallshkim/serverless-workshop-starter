# serverless-workshop
Starter repo for the serverless workshop run by Adam Biessener: https://github.com/abiessener/serverless-workshop.

This roughly two-hour workshop is a step-by-step tour of the basics of serverless compute platforms using AWS Lambda.

By the end of the workshop, you should have a understanding of:
1. the fundamentals of serverless architecture
2. the reasons for its meteoric rise in popularity
3. the tradeoffs involved relative to a traditional server-based backend
4. the differences between serverless architecture and microservices architecture 
5. how incredibly easy it is to get up and running from literally zero

Plus you'll have a fully armed and operational API when you leave -- available over HTTPS, secured by basic authentication, and ready to demo for all the recruiters who will no doubt shortly be banging down your door!

## Prep Beforehand (~15-30 minutes)
Please come prepared to the workshop by doing the following before attending:

Hopefully it's a safe assumption that if you're coming to this workshop, you have an IDE installed. If you don't, please do so before coming.

Install NodeJS / npm if you haven't.

0. (Windows only) Set up a Bash-like environment on your machine. I recommend installing Git for Windows and using Git Bash.
1. Fork this repo to your personal. -  **Optional**: set up GitHub SSH, see below
2. `$ npm install`
3. Create an AWS free-tier account if you don't have one. https://aws.amazon.com/ (Yes, you need to put in a credit card. No, this shouldn't cost you anything.)
4. Install the AWS CLI (v2): https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
5. Install a REST client. I recommend ARC: https://install.advancedrestclient.com/install

### [Optional] Setting up SSH for GitHub
To avoid having to type your password in all the time, add an SSH key to your GitHub account and use that to authenticate instead.

1. `$ ssh-keygen` (just press Enter through all the prompts)
2. `$ cat ~/id_rsa.pub`
3. Copy that whole output to a new SSH key on your GitHub account at Settings | SSH and GPG keys | New SSH key 
4. Add that SSH key to your local keyagent: `$ eval $(ssh-agent -s)`, then `$ ssh-add ~/.ssh/id_rsa`
5. Verify: `$ ssh -T git@github.com` (press enter through prompts/warnings)
5. Add those two lines to your `.bash_profile` so they load every time you open bash. (`/USER_HOME/.bash_profile`, wherever your USER_HOME is)
6. Change your git remote to use SSH: `$ git remote set-url origin ssh://git@github.com/YOUR_USERNAME_HERE/serverless-workshop.git`
7. Verify it works by making some trivial update to the README or somewhere and doing a `git push`

## Workshop Topics

### What are serverless platforms?

"Functions as a Service" or FaaS is basically an equivalent term

Fundamentally, a serverless platform lets you create *handlers* to handle *events*. This enables *event-driven architecture* which should feel very natural to anyone who has worked with a REST API.

Example: unexpected 500 error in critical service. Post to message queue -- then consume it with arbitrary functions.

### Why choose serverless?
Deploy, scale, and update services at an even more granular level than traditional microservice architecture. Handle things like event queues quickly and naturally. Avoid being tied to "cron" (scheduled) jobs, though that's a tool available to you.

Much less infrastructure to deal with -- you get a lot "for free" -- no load balancers! Let the platform holder deal with the platform; no Docker images to manage.

Cost. Much cheaper than e.g. a typical EC2 setup.

### Serverless limitations
Cold starts may need to be mitigated -- database connections in particular have some pitfalls.

(AWS-specific) API Gateway in general is...complicated (but it's getting better!).

Fragmentation & shared code -- there are tools to mitigate this, but it's a complication compared to traditional servers.

### Infrastructure as Code
For the love of all that is good and right in the world, capture as much of your infrastructure in code as you possibly can. This makes everything from bug-hunting to disaster recovery to expanding services infinitely easier.

Serverless means you get to skip a whole bunch of what you have to do even for a relatively simple EC2 setup, much less a complex redundant/resilient application or Kubernetes or whatever.

## Workshop Agenda

### AWS CLI
https://docs.aws.amazon.com/cli/latest/index.html

#### Create IAM user
This is the hardest part! Really.

* Create user
* Download the csv!
* Create group `serverless-admin` & attach policies: `AWSLambdaFullAccess`, `AmazonAPIGatewayAdministrator`
* Create group `iam-admin` & attach policies: `IAMFullAccess`
* Add user to groups
* Create a password for the user
* * Note the web console sign-in link
* Sign out, then sign in as that user

#### Configure AWS CLI
> `$ aws2 configure` \
Credentials from CSV \
Region: us-west-2 \
Output: yaml \

>verify: \
`$ aws2 sts get-caller-identity`

#### Set up IAM Role
>Create role (generate skeleton): \
`$ aws2 iam create-role --generate-cli-skeleton yaml-input > cli/iam-create-role.yaml` \
then, edit those values

>Create role (run command): \
`$ aws2 iam create-role --cli-input-yaml file://cli/iam-create-role.yaml` \
note: file path is relative to working directory

note: `iam-trust-relationship.json` (pre-existing in this repo) says "this role can be assumed by Lambdas"

> Attach policies (generate skeleton): \
`$ aws2 iam attach-role-policy --generate-cli-skeleton yaml-input > cli/iam-attach-role-policy.yaml` \
note: Always edit the values that get spit out by these "generate skeleton" commands

> Attach policies(run command): \
`$ aws2 iam attach-role-policy --cli-input-yaml file://cli/iam-attach-role-policy.yaml`

#### Package & bundle our code
>`$ npm install` \
`$ npm run-script bundle`

note: Further explanation of this step is available on demand. 

#### Set up S3
>Create bucket (generate skeleton): \
`$ aws2 s3api create-bucket --generate-cli-skeleton yaml-input > cli/s3api-create-bucket.yaml` \
note: s3 bucket name uniqueness

>Create bucket (run command): \
`$ aws2 s3api create-bucket --cli-input-yaml file://cli/s3api-create-bucket.yaml`

>Upload code (run command): \
`$ aws2 s3 cp dist/bundle.zip s3://serverless-workshop-prime/bundle.zip` \
note: change s3 bucket name

#### Create our Lambda!
>Create Lambda (generate skeleton): \
`$ aws2 lambda create-function --generate-cli-skeleton yaml-input > cli/lmabda-create-function.yaml`

>Create Lambda (run command) \
`$ aws2 lambda create-function --cli-input-yaml file://cli/lambda-create-function.yaml` \
note: differences in web docs vs "live docs" in the CLI!

#### Create API Gateway resource

note: There's this exciting new "HTTP Gateway" that's in beta, but it was buggy so we're using a REST API.

note: I noped out of getting CLI input working for setting up API Gateway. It's...complex. And full of weird legacy things with inconsistent documentation. So we're going to use the AWS web console, which you should learn about anyway. Just do yourself a favor and learn about Swagger / OpenApi formats sometime.

auth: demo authorizer

#### Point your REST client at it!

#### Testing
> Running our automated tests \
`$ npm run-script test` 
useful: https://scotch.io/tutorials/how-to-test-nodejs-apps-using-mocha-chai-and-sinonjs
> **Unit vs Integration tests** \
Unit tests are generally the way to go: Mocking via Sinon \
Integration tests -- good news is AWS SDK picks up your local credentials we set up upthread, so you can do all kinds of cool stuff as far as invoking other AWS services without doing any more work

### Closing thoughts

On this free tier with (currently) no authentication, it's a best practice to delete any deployment stages when you're not actively working on it so that you protect your AWS account from the incredibly unlikely case of some robot finding your endpoint and banging on it until it manages to actually cost you money.

Verifying behavior via test is *often* a better workflow than actually publishing and invoking the lambda. Yes, AWS SAM exists and provides a Lambda-like local environment in which to run your Lambda, but it sucks in basically every way a workflow can suck and I don't recommend it.

### Bonus content
#### Update/deploy script
`$ aws2 lambda update-function-code --generate-cli-skeleton yaml-input > cli/lambda-update-function-code.yaml`

`$ aws2 lambda update-function-code --cli-input-yaml file://cli/lambda-update-function-code.yaml`

`$ aws2 lambda update-function-configuration --generate-cli-skeleton yaml-input > cli/lambda-update-function-configuration.yaml`

`$ aws2 lambda update-function-configuration --cli-input-yaml file://cli/lambda-update-function-configuration.yaml`

`$ ./scripts/build-deploy.sh`

todo: advanced deploy script (error handling)