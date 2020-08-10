/* eslint-disable no-unused-vars */
//@ts-check

const utilities=require('../common-utilities/csv-parser.js');
const dynamoDb=require('../data-access-service/dynamo-core.js');
const compression=require('../common-utilities/compression');

/**
 * 
 * @typedef BasicTableInfo
 * @type {Object}
 * @property {string} Name - Name of the table.
 * @property {string} PartitionKey - PartitionKey of the table.
 * @property {string} SortKey - Sortkey of the table
 */


/**
 * Replicated the data from the csv file to the dynamo db.
 * 
 * @param {{}[]} csvDataInJson The processed data in the csv file recived through the lambda api in JSON format.
 * @param {BasicTableInfo} table Name of the table.
 * 
 * @returns {Promise<string>} - logs of the operation
 */
async function insertToDB(csvDataInJson,table){   
    var date=new Date();
    
    var logs="";
    for (const iterator of csvDataInJson) {
        let id=iterator[`${table.Name}`];
        let item=new Object();
        for (const property of Object.entries(iterator)) {
            item[property[0]]={S: property[1] }                
        }
        let res=await dynamoDb.InsertData(item,table.Name)
        if(res.isSuccessful){
            logs=logs+`${date.toUTCString()} ::=>`+"\t"+`Success for accountId :: ${id}`+'\n'+JSON.stringify(res)+'\n';
        }
        else
        {
            logs=logs+`${date.toUTCString()} ::=>`+"\t"+`Failure for accountId :: ${id}`+'\n'+JSON.stringify(res)+'\n';
        }               
    }
    return logs;
} 


/**
 * 
 * @param {string} rawDataFromHttpReq The base64 encoded data from the http req.
 * @param {string} delimiter Seperator for the csv file.
 * @returns {Promise<{}[]>} body of the request in string format. 
 */
async function getCsvDataString(rawDataFromHttpReq,delimiter ){
    let body=await compression.GetMediaFromBody(rawDataFromHttpReq);
    // @ts-ignore
    return await utilities.CsvToJson(body,delimiter);
}

/**
 * 
 * @param {{}[]} csvDataInJson The processed data in the csv file recived through the lambda api in JSON format.
 * @param {BasicTableInfo} table The basic table informatiion.
 * @param {Array<string>} feildNames Array of the feild names to be included/choosen from the CSV file.
 * @returns {Promise<Object| String>} Log of the operation
 */

async function updateDB(csvDataInJson,table,feildNames){
    let date=new Date();
    let logs=[];
    //test
    // console.log(csvDataInJson)
    //
    for (const items of csvDataInJson) {
        let attributeNamesList=[];
        let attributeValuesList=[];
        let updateExpression=[];
        let expressionAttributeNames={};
        let expressionAttributeValues={};
        var key={};
        let tableName=table.Name.trim();
        let partitionKey=table.PartitionKey.trim();
        let sortKey=table.SortKey.trim();

        //for key json.
        key[partitionKey]={S:items[partitionKey]};
        key[sortKey]={S:items[sortKey]};

        //for the formation of ExpressionAttributeNames and ExpressionAttributeValues json expression.
        let count=0;
        for (const name of feildNames) {
            
            if(name!==partitionKey && name!==sortKey){
                expressionAttributeNames[`#${count}`]=name;
                attributeNamesList.push(`#${count}`);

                expressionAttributeValues[`:${count}`]={S:items[name]};
                attributeValuesList.push(`:${count}`);                
            }
            count=count+1;
        }

        // for setting the UpdateExpression json attribute
        let arraylength=attributeNamesList.length;
        if(attributeNamesList.length===attributeValuesList.length){            
            for (let i = 0; i < arraylength; i++) {
                i;
                updateExpression.push(`${attributeNamesList.pop()}=${attributeValuesList.pop()}`);                
            }           
        }

        let params={};
        params.ExpressionAttributeNames=expressionAttributeNames;            
        params.ExpressionAttributeValues=expressionAttributeValues;
        params.Key=key;
        params.ReturnValues="ALL_NEW";
        params.TableName=tableName;
        params.UpdateExpression=`SET ${updateExpression.toString()}`;

        let res=await dynamoDb.UpdateTable(params);
       // logs.push(`${date.toISOString()} :: Update/Insert status for ${items[table.SortKey]} :=> ${res.message} \n `)
        logs.push({            
            partitionKey:items[partitionKey],
            sortKey:items[sortKey],
            statusCode:res.statusCode,
            'update-insert-status':res.isSuccessful,
            message:res.message,
            updatedData:res.data,
            logMsg:`${date.toISOString()} :: Update/Insert status for ${items[table.SortKey]} :=> ${res.message} `,
            time:date.toISOString()
        });

    }
//return JSON.stringify(logs)   
    return logs;
}



module.exports={
    InsertToDB:insertToDB,
    UpdateDB:updateDB,
    GetCsvDataString:getCsvDataString,
    
}





// /**
//  * @type {BasicTableData}
//  */ 
// async function exp(){
// console.log(await dataReplicationService([{
//     "accountid_partitionKey": "aug19ntflx@yahoo.com",
//     "user": "Akash",
//     "subscribtion": "150",
//     "startdate": "10-Mar",
//     "source": "friend",
//     "screen": "",
//     "collection": "self",
//     "title_sortkey": "wap-p"
// }, {
//     "accountid_partitionKey": "aug19ntflx@yahoo.com",
//     "user": "Soumik",
//     "subscribtion": "150",
//     "startdate": "10-Mar",
//     "source": "friend",
//     "screen": "",
//     "collection": "self",
//     "title_sortkey": "wap-p+9"
// }],"lolzzzz"))
// }

// exp()
