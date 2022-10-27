'use strict';
const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));


module.exports.getproductslist = async (event, context, callback) => {

  const productsTableScanParams = {
    TableName: process.env.PRODUCT_TABLE,
  }
  const stockTableScanParams = {
    TableName: process.env.STOCKS_TABLE,

  }
  try {
    console.log('Request getProductsList');
    const products = await scan(productsTableScanParams);
    const stocks = await scan(stockTableScanParams);
    const result = products.map((product) => {
      const stock = stocks.find((st) => st.id == product.id);
      console.log(stock);
      product.count = stock.count;
      return product;
    });
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(result)
    });
  } catch (e) {
    console.log('Error:', e.message);
    return callback(null, {
      statusCode: 500,
      body: { message: 'An error occured during execution' },
    });
  }

};

async function scan(params) {
  try {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const response = await dynamoDB.scan(params).promise();
    return response.Items;
  } catch (e) {
    console.log(`An error occured during DynamoDB scan request. Params: ${JSON.stringify(params)} Error: ${e.message}`, e.message);
    throw e;
  }
};