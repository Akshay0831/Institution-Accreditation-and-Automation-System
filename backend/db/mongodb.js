const { MongoClient } = require("mongodb");

exports.getDocs = async (collectionName) => {
    // Connecting to a local port
    const uri = "mongodb://127.0.0.1:27017";

    const client = new MongoClient(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });
    client.connect();
    const db = client.db("projectdb");

    const collection = db.collection(collectionName);
    let cursorFind = collection.find();
    let docs = await cursorFind.toArray();
    setTimeout(() => {
        client.close();
    }, 2000);
    return docs;
};