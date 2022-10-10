'use strict';

const fs = require("fs");
module.exports.getproductslist = async (event) => {
  try {
    const jsonString = fs.readFileSync("./products.json");
    const customer = JSON.parse(jsonString);
    return {
      statusCode: 200,
      body: JSON.stringify(customer),
    };
  } catch (err) {
    return {
      statusCode: 404,
      body: 'No Data Found',
    };
  }
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
