//@ts-check
require('dotenv').config();
const dataHandler=require('./data-handeling-service');


// Configuration to be loaded from environment variables
/**
 * 
 * @typedef Profile
 * @type {object}
 * @property {string} profileName
 * @property {string} feildNames
 * @property {string} delimiter
 * @property {import('./data-handeling-service').BasicTableInfo} baicTableInfo
 * 
 */

 /**
  * 
  * @param {string} rawHttpPostData The http body data from the http request in base64 string.
  * @param {string} profileName the profile name from the header.
  */


async function startReplication(rawHttpPostData,profileName){
    /**
     * @todo route all the functions from data-handelling service.
     * 
     */
  
   // let sessionLog=[];
    //sessionLog.push(`${date.toISOString()} :: Replication function invoked\n`);

    /**
     * @type {Profile}
     */

    let profileData=JSON.parse((process.env[profileName]));
    let csvData= await dataHandler.GetCsvDataString(rawHttpPostData,profileData.delimiter);

    let result=await dataHandler.UpdateDB(
                                            csvData,
                                            profileData.baicTableInfo,
                                            profileData.feildNames.toLowerCase().split(',')   //input feild names are converted to lower case
                                        );

    return result;    
    
}   

module.exports={
    StartReplication:startReplication
}