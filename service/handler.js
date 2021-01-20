'use strict';

module.exports.hello = async (event, context) => {
  console.log(`FUNCTION_EVENT`, context.awsRequestId)
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        awsRequestId: context.awsRequestId,
      },
      null,
      2
    ),
  };
};

module.exports.logs = async (event) => {
  console.log(`LOG_RECEIVED`, event.body)
  return {
    statusCode: 200
  };
};

