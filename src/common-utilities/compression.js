//@ts-check

const {unzip} = require('zlib');
const { promisify } = require('util');
const stream=require('stream');
// eslint-disable-next-line no-unused-vars
const { Stream } = require('stream');

/**
 * 
 * @param {string} data Data from the Http Req. Body in base64 string format.
 * @returns {Promise<Stream>} The processable data from the http req. Body.
 */
async function getMediaFromBody(data){
  
    let readStream=new stream.Readable({read(){}});
    let memoryBuff=Buffer.from(data,'base64');
//console.log(memoryBuff.toString('utf-8'));
    return new Promise((res,rej)=>{
        try {      
            unzip(memoryBuff,(err,memoryBuff)=>{
                
                if(!err){                  
                    readStream.push(memoryBuff);
                    readStream.push(null);
                    //readStream.read();
                    res(readStream);
                }               
            });
            
        } catch (error) {
            rej(error);
        }   
    })
    // unzip(memoryBuff)
    //     .then((dataContext)=>{
    //         readStream.push(dataContext);
    //         readStream.push(null);
    // //     })
    //     .catch(err=>console.log(err));
    // return readStream; 
 }   


//  for testing purpose 
//  {  var c=await csv.CsvToJson(readStream,",");
//    fs.writeFile("./test3.json",JSON.stringify(c),()=>{
//          console.log("finish");
//       }) 

//     readStream.read()  
    
//     const destination = fs.createWriteStream('./input.csv');
//     readStream.pipe(destination) }


module.exports={
    GetMediaFromBody:getMediaFromBody 
}

// async function test(){
//     let c="H4sIAFDHJV8EA+2RzU7DMBCEc0biHXiAlWXHadIjLQcugHpA3J1201q4cbVx/94e56fUKXBCqkDKSElmdqzPThIXshjnuVRK8FyKJOYpL9QizzEZ+ytl7uCiX4oLzrMsi3iri6dvsyQSMhNCJnIkUr9eSsmjOx5dQdvKKYr4Vfb6g9ILKDRVrlRrBKM6g2ulTXuPYUO2wKrStry98X8SXkkfNMxw2Trm3f3RburFbG7XwXT5OVvgDo3dINUIAQ+KCBFmq6Mxuuoi62IIu6hCop072+BimBit4NkSaWOawLoQonrFtyAJE2dU6RS84B49qousjn3YRXXG1V8TC71cufZdE5iSRueZE9rZU2B1CHn94kzbW3pvQSN4Q0J42nqwbTxrfA8Tzn8+UwpTv5cuER7tHumUWJNCXL/5cqxo0KBBgwb9W30APbJAlAAKAAA="; 
//     let d="H4sIAPjNJV8AA-3S307CMBgF8F2b-A57gNp0bGy3DjXeqCHReN-wD2gsK-kKg7d3f0AokXhFjPH8LraefstZRxjlrw_3NDFUhNxtXHAJopEmSXcXSeTfhYhElgRRnEVRnKRZmgUiiodJGoTiIqc5saqctGEY1HV9U0gnzz330_yPUgWbKlu5Ui6Iablb0EIq3V8HbGnNlKpKmfL6KhKCvVm1UWxMs37Fm9Xt1izbh_nELI52Z197Ba1JmyXZtiJid9JaIjaeb7VW1S7yXfTKTkZHjWbiTFc3YLlWkj0ba5XWXeC74FV5g--KYpY7LUsn2QvV1Fb1kffRL_NHh7rm16Spms1d_60JG1lFrunM7drsA2-D1-cNDm21sR990ZC9kyX2tGqKTbfm_dqrOd4_e6aUjZp3qZLYo6nJ7hPvkn8qb3J6rN_-7wIAAAAAAAAAAAAAAAAAAAAA_HefB9vbgAAoAAA";
//     let e="H4sICI3PJV8AA0JBU0VEZWNvZWQgLnR4dAB1kE1vwjAMhu9I_BMr4mPbmcKBC5s4TLtH4BZrbl25GR3_fmlToEbsEr2P3-iJWzpCTtqEypcI7IeApSdO5wJqlRybhqSaTuazGXwq_RLssUjJxbS6SN1ddgcpR9PiNjviGVlq1E4xh41XRYT96cJMzYBuQCN7qEZGOQTpdQvImDy8iyox9-AGMCpTPBMtIQvsq-DhA1vsVAldQiuz1V0X_ybmVJxC-tYXWCthiM5Mz3IF14HxmeJua0W_k-gVvlARdj9RLH12KRvNeP7vTm-wjm9RhbCVFvVKrie7lWke1_oDUZCtLTwCAAA";
//     let v=await getMediaFromBody(e)
//     var x=await require('./csv-parser').CsvToJson(v,",");


//     console.log(x)
// }

// test()