const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const connectMongo = require('./ConnectMongo');
const client = connectMongo.getClientInformation();
let users = null;
async function ConnectToMessageHistoryDB(){
    try{
        await connectMongo.connect();
        users = client.db('Messenger').collection('MessageHistory');
    } catch (err){
        console.log(`Debug>Failed to connect to database. Error Message: '${err}'`)
        return;
    }
    console.log(`Debug> Connection to collection users was successful!`)
    return users;
}

//test

const findMessage = async(username = "admin")=>{
    try{
        const user = await users.findOne({username})
        console.log(`Debug> User Information retrieved: username: '${user.username}' password: '${user.message}'`);
    }catch (err){
        console.log("Failed to query: " + err);
    }
}

module.exports = {
    ConnectToMessageHistoryDB,
    findMessage
}