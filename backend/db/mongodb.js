const { MongoClient } = require("mongodb");

// Connecting to a local port
const uri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

try {
    client.connect();
    const db = client.db("test");
    console.log(`Successfully connected to db ${db.databaseName}`);

    const testCol = db.collection("testCol");

    let cursorFind = testCol.find();
    cursorFind.toArray().then((data) => console.table(data));
} catch (e) {
    console.error(e);
}
