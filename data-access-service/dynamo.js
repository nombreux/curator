/* eslint-disable no-unused-vars */
const AWS=require('aws-sdk')
const cred=new AWS.Credentials(); 
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10',region:"ap-south-1",credentials:cred});

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
            else{res(err)}
        })
    })    
}

async function testd(){
    console.log(await createTable("betaa"))
}

testd()