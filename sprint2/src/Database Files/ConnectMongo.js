const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://admin:Team10BasicAdmin1829@team10messenger.ebcy0so.mongodb.net/?appName=Team10Messenger"; //replace this with your connection string
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