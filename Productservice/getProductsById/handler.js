'use strict';
const fs = require("fs");

module.exports.productsbyid = async (event) => {
  try {
    let productId = event.pathParameters.productId;
    let product = await getProductsById(productId);
    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (err) {
    return {
      statusCode: 404,
      body: 'No Item Found',
    };
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

function getProductsById(id) {
  const jsonString = fs.readFileSync("./products.json");
  const customer = JSON.parse(jsonString);
  let result = ''
  customer.map(c => {
    if (c.id === id) {
      result = c;
    }
  });
  return result;
}

