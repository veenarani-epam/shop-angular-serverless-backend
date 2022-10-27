'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const title = requestBody.title;
  const description = requestBody.description;
  const price = requestBody.price;
  const count = requestBody.count;

  if (typeof title !== 'string' || typeof description !== 'string' || typeof price !== 'number' || typeof count !== 'number') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit product because of validation errors.'));
    return;
  }

  submitProducts(productInfo(title, description, price, count))
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully submitted product with product ${title}`,
          productId: res.id
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to submit product with product ${title}`
        })
      })
    });
};


const submitProducts = product => {
  console.log('Submitting product');
  const obj = {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price
  }
  const productInfo = {
    TableName: process.env.PRODUCT_TABLE,
    Item: obj,
  };
  const stockObj = {
    id: product.id,
    count: product.count
  }
  const stockInfo = {
    TableName: process.env.STOCKS_TABLE,
    Item: stockObj,
  };
  return dynamoDb.put(productInfo).promise()
    .then(res => {
      return dynamoDb.put(stockInfo).promise()
        .then(res => product);
    });
};

const productInfo = (title, description, price, count) => {
  const timestamp = new Date().getTime();
  return {
    id: uuid.v1(),
    title: title,
    description: description,
    price: price,
    count: count,
    submittedAt: timestamp,
    updatedAt: timestamp,
  };
};