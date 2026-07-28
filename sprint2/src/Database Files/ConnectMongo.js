const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
isConnected = false;

async function connect (){
    try{
        if(isConnected){ 
            console.log('Debug>ConnectMongo.js is already connected to MongoDB server');
            return;
        }
        await client.connect();
    }catch (err){
        throw err;
    }
    isConnected = true;
    console.log('Debug>ConnectMongo.js: connected to MongoDB server!');
}
function getClientInformation(){
    return client;
}

function isConnectedToMongoDB(){
    return isConnected;
}

module.exports = {
    getClientInformation,
    isConnectedToMongoDB,
    connect
}
