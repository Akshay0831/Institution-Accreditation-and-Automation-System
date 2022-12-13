const { MongoClient, ObjectId } = require("mongodb");
class MongoDB {
    constructor(database) {
        this.uri = "mongodb://127.0.0.1:27017";
        this.client = new MongoClient(this.uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        this.database = database;
        this.client.connect();
        this.db = this.client.db(this.database);
    }

    async getDocs(collectionName) {
        const collection = this.db.collection(collectionName);
        let cursorFind = collection.find();
        let docs = await cursorFind.toArray();
        return docs;
    }

    async deleteDoc(collectionName, documentId) {
        let deletedResult = await this.db
            .collection(collectionName)
            .deleteOne({ _id: ObjectId(documentId) });
        return deletedResult.acknowledged;
    }

    async updateDoc(collectionName, documentId, body){
        body=Object(body);
        let updatedResult = await this.db
            .collection(collectionName)
            .updateOne({_id: documentId}, {$set: body});
        return updatedResult.acknowledged;
    }
}

module.exports = MongoDB;
