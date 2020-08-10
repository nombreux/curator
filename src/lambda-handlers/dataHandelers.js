//@ts-check
require('dotenv').config()
const dataReplicaton=require('../data-handler/data-replication-service');




exports.dataReplication = async (event) => {
    if (event.requestContext.http.method !== 'POST') {
        console.info(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    else if(event.isBase64Encoded===false){
        console.info(`data is not properly encoded`);
        throw new Error("base64 encoded data is required.")
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    var profileName=event.headers.profile;
    // /**
    //  * @type {import('../data-handler/data-replication-service').Profile}
    //  */
    //var profileData=process.env[profileName];
    try {
        let res=await dataReplicaton.StartReplication(event.body,profileName);

        console.info(`${new Date().toISOString()} :: Replication function invoked\n`);

        const response = {
            statusCode: 200,
            log: JSON.stringify(res)
        };
    
        // All log statements are written to CloudWatch
        console.info(`${new Date().toISOString()} =====>> ${JSON.stringify(res)}`);
        return response;
        
    } catch (error) {
        const response = {
            statusCode: 400,
            log: error
        };
    
        // All log statements are written to CloudWatch
        console.info(`${new Date().toISOString()} :: ${error}`);
        return response;
    }


}