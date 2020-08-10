/* eslint-disable no-unused-vars */
//@ts-check

const fs=require("fs");
const readline = require('readline');

/**
 * @param {fs.ReadStream} data - The CSV File
 * @param {string} delimiter - The delimiter in the csv file
 * @return {Promise<{}[]>}  Returns the json array object from the csv file
 */
async function csvToJson(data,delimiter)
{  
   let columnHeader=[];
   let jsonArray=[];
   let columnHeaderReadFlag=false;
   
   var rl=readline.createInterface({input: data});
   for await (const iterator of rl) {
      var row=iterator.toString().trim().split(delimiter);
      if(columnHeaderReadFlag && iterator.length>0){
         let jObject={};
         for(var i=0;i<columnHeader.length;i++){
            jObject[columnHeader[i]]=row[i];
         }         
         jsonArray.push(jObject);
      }
      else if(!columnHeaderReadFlag && iterator.length>0){
         //changing the case of the data---header to lower case
         columnHeader=iterator.toString().toLowerCase().trim().split(delimiter);
         columnHeaderReadFlag=true;
      }
   }
   return jsonArray
} 

module.exports={
   CsvToJson:csvToJson 
}
// async function test(){
//    var b=fs.createReadStream("./Netflix_customer_data.csv");
//    var c=await csvToJson(b,",");

// fs.writeFile("./test3.json",JSON.stringify(c),()=>{
//       console.log("finish");
//    }) 
// }

// test() 