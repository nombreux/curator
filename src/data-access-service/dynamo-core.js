/* eslint-disable no-unused-vars */
require('dotenv').config()

const AWS=require('aws-sdk');
const cred=new AWS.Credentials(process.env.accessKeyId,process.env.secretAccessKey);
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10',region:process.env.region,credentials:cred});

/**
 * @typedef DynamoDbResponse
 * @type {object}
 * @property {boolean} isSuccessful - If its a success or failure.
 * @property {string} message - Message of the operation.
 * @property {number} statusCode - StatusCode of the API call.
 * @property {string} data - Gives the data if there is any
 */

/**
 * 
 * @param {String} tableName - Name of the table
 * @returns {Promise<Object>} CreateTable Respondse
 */
async function createTable(tableName)
{
    var params = {
        TableName : tableName,
        KeySchema: [       
            { AttributeName: "accountid_partitionKey", KeyType: "HASH"},  //Partition key
            { AttributeName: "title_sortkey", KeyType: "RANGE" }  //Sort key
        ],
        AttributeDefinitions: [       
            { AttributeName: "accountid_partitionKey", AttributeType: "S" },
            { AttributeName: "title_sortkey", AttributeType: "S" }
        ],
        ProvisionedThroughput: {       
            ReadCapacityUnits: 2, 
            WriteCapacityUnits: 2
        }
    };
    return new Promise((res,rej)=>{
        dynamodb.createTable(params,(err,data)=>{
            if(!err){res(data)}
            else{console.log(err)
                res(err)}
        })
    })    
}

/**
 * Inserts data in the table
 * @param {*} dataInJsonFormat - Data to be inserted
 * @param {String} tableName - Name of the Table
 * @return {Promise<DynamoDbResponse>} - Result
 */
async function insertData(dataInJsonFormat,tableName){
    var params = {
        TableName:tableName,      
        Item:dataInJsonFormat
        };

   return new Promise((res,rej)=>{
       /**
         * @type {DynamoDbResponse}
        */
        var response=new Object()
        dynamodb.putItem(params, function(err, data) {
            if (err) {
                response.isSuccessful=false;
                response.message=err.message
                response.statusCode=err.statusCode
                res(response);
            } else {
                response.isSuccessful=true;
                response.message="Successful"
                response.statusCode=200
                res(response);
            }
        }) 
   });
}


/**
 * 
 * @param {String} query - Dynamo DB Query
 * @return {Promise<DynamoDbResponse>} The Respondse of the query
 */
async function fetchByQuery(query){

    var docClient = new AWS.DynamoDB.DocumentClient();
    return new Promise((res,rej)=>{
        docClient.query(query, function(err, data) {
            if (err) {
                console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
                res(err);
            } else {
                console.log("Query succeeded.");
                res(data);
            }
        });
    })


}

/**
 * 
 * @param {Object} data Data to update the table
 * @return {Promise<DynamoDbResponse>} Update Table respondse
 */

async function updateTable(data){
   // var docClient = new AWS.DynamoDB.DocumentClient();
  // console.log(data);
    return new Promise((resolve,rej)=>{
        dynamodb.updateItem(data, function(err, data) {
            if (err) {
                /**
                 * @type {DynamoDbResponse}
                 */
                
                var res={
                    
                    statusCode:err.statusCode,
                    message:err.message,
                    isSuccessful:false,
                    data:"No Data" 
                };             
                resolve(res);
            } else {
                /**
                 * @type {DynamoDbResponse}
                 */
                let res={
                    statusCode:200,
                    message:"record is successfully updated/inserted in the table as per the configuration.",
                    isSuccessful:true,
                    data:data.Attributes
                }
                resolve(res)
            }
        });
    })

}
module.exports={
   // CreateTable:createTable,
    InsertData:insertData,
    FetchByQuery:fetchByQuery,
    UpdateTable:updateTable
}
                    



