# Example Code for a Blog

Blog: https://matt.martz.codes/lock-down-dynamodb-with-iam-policy-conditions

To run this yourself, clone the repo and run:

```bash
npx projen
npx projen build
# npx cdk deploy # RUNNING THIS MAY COST YOU MONEY
npx cdk destroy # don't forget to destroy afterwards!
```

At the end of the deploy script (after you accept the changes) there will be a URL:

```bash
Outputs:
blogIsolationStack.blogIsolationApiEndpoint237C4FAE = https://12d6dsdjl0.execute-api.us-east-1.amazonaws.com/prod/
```

From there you can:

```bash
curl https://12d6dsdjl0.execute-api.us-east-1.amazonaws.com/prod/init # init the database
curl https://12d6dsdjl0.execute-api.us-east-1.amazonaws.com/prod/grant/1
curl https://12d6dsdjl0.execute-api.us-east-1.amazonaws.com/prod/grant/1/1
curl https://12d6dsdjl0.execute-api.us-east-1.amazonaws.com/prod/grant/2
curl https://12d6dsdjl0.execute-api.us-east-1.amazonaws.com/prod/grant/2/1
curl https://12d6dsdjl0.execute-api.us-east-1.amazonaws.com/prod/grant/1?credentials=1
curl https://12d6dsdjl0.execute-api.us-east-1.amazonaws.com/prod/grant/1/1?credentials=1
curl https://12d6dsdjl0.execute-api.us-east-1.amazonaws.com/prod/grant/2?credentials=1
curl https://12d6dsdjl0.execute-api.us-east-1.amazonaws.com/prod/grant/2/1?credentials=1
curl https://12d6dsdjl0.execute-api.us-east-1.amazonaws.com/prod/grant/1?credentials=2
curl https://12d6dsdjl0.execute-api.us-east-1.amazonaws.com/prod/grant/1/1?credentials=2
curl https://12d6dsdjl0.execute-api.us-east-1.amazonaws.com/prod/grant/2?credentials=2
curl https://12d6dsdjl0.execute-api.us-east-1.amazonaws.com/prod/grant/2/1?credentials=2
curl https://12d6dsdjl0.execute-api.us-east-1.amazonaws.com/prod/noGrant/1
curl https://12d6dsdjl0.execute-api.us-east-1.amazonaws.com/prod/noGrant/1?credentials=1
```