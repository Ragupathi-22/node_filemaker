const fs= require('fs');
const fsPromise =require('fs').promises;
const path=require('path');
const {format}=require('date-fns')
const {v4 :uuid}= require('uuid');

const logEvent =async(message,logName)=>{
    
    const date= `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logMessage=`${date}\t${uuid()}\t${message}\n`;
    
    try{
        if(!fs.existsSync(path.join(__dirname,'../logs'))){
            await fsPromise.mkdir('logs');
        }
        await fsPromise.appendFile(path.join(__dirname,'../logs',logName),logMessage);
    }catch(e){
        console.log('Error while adding log events'+e);
    }

}

module.exports=logEvent;