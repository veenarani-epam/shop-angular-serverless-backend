'use strict';

const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports.productsbyid = (event, context, callback) => {
  const params = {
    TableName: process.env.PRODUCT_TABLE,
    Key: {
      id: (event.pathParameters.id),
    },
  };

  dynamoDb.get(params).promise()
    .then(product => {
      const stockParams = {
        TableName: process.env.STOCKS_TABLE,
        Key: {
          id: (product.Item.id),
        },
      };
      dynamoDb.get(stockParams).promise()
        .then(stock => {
          product.Item.count = stock.Item.count;
          const response = {
            statusCode: 200,
            body: JSON.stringify(product.Item),
          };
          return callback(null, response);
        })
        .catch(error => {
          console.error(error);
          callback(new Error('Couldn\'t fetch stock data.'));
          return;
        });
    })
    .catch(error => {
      console.error(error);
      callback(new Error('Couldn\'t fetch products data.'));
      return;
    });
};