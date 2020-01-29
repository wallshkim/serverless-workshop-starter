/**
 * Originally a copy/paste from:
 * https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html#api-gateway-lambda-authorizer-lambda-function-create
 * 
 * In an actual application, this would be in its own repo as likely it would be shared across many lambdas/endpoints.
 * For workshop purposes, it's here for reference.
 * 
 * This does not require bundling or packing. Just copy/paste it into the inline Lambda editor.
 * 
**/

exports.handler =  function(event, context, callback) {
    console.log(event)
    
    var token = event.authorizationToken; // event.authorizationToken is always what API Gateway sends across the authorization value as, no matter which header it's pulling from on the initial request
    const authorized = token == process.env.validAuthToken
    
    if (authorized) {
        console.log('authorized')
        callback(null, generatePolicy('user', 'Allow', event.methodArn));
    } else {
        console.log('forbidden')
        callback("Unauthorized");   // Return a 401 Unauthorized response
    }
};

// Help function to generate an IAM policy
var generatePolicy = function(principalId, effect, resource) {
    var authResponse = {};
    
    authResponse.principalId = principalId;
    
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; 
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; 
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    
    return authResponse;
}