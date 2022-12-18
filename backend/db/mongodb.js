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
            .deleteOne({ _id: documentId });
        return deletedResult.acknowledged;
    }

    async updateDoc(collectionName, documentId, body) {
        body = Object(body);
        let updatedResult = await this.db
            .collection(collectionName)
            .updateOne({ _id: documentId }, { $set: body });
        return updatedResult.acknowledged;
    }

    async addDoc(collectionName, body){
        body['_id']=(new ObjectId).toString();
        let insertedResult = await this.db
            .collection(collectionName)
            .insertOne(body);
        return insertedResult
    }

    async getMarks() {
        let resultClassAllocation = await this.getDocs("Class Allocation");
        let resultClasses = await this.getDocs("Class");
        let resultMarks = await this.getDocs("Marks");
        let resultStudents = await this.getDocs("Student");
        let resultSubjects = await this.getDocs("Subject");
        let resultDepartments = await this.getDocs("Department");

        let result = resultDepartments.map((department) => {
            //Adding classes to department
            department.Classes = [];
            resultClasses.forEach((classObj) => {
                if (department._id == classObj["fk_Department ID"]) {
                    // console.log("class:", classObj);
                    classObj.Subjects = [];
                    resultSubjects.forEach((subject) => {
                        if (
                            subject["fk_Department ID"] == department._id &&
                            subject.fk_Semester == classObj.Semester
                        ) {
                            // console.log("subject:", subject);
                            subject.Students = [];
                            resultStudents.forEach((student) => {
                                resultClassAllocation.forEach((ca) => {
                                    if (
                                        ca.fk_USN == student.USN &&
                                        student["fk_Department ID"] == department._id &&
                                        ca["fk_Class ID"] == classObj._id
                                    ) {
                                        // console.log("Student:", student);
                                        student["Marks Gained"] = {};
                                        resultMarks.forEach((marks) => {
                                            if (
                                                marks["fk_Subject Code"] ==
                                                    subject["Subject Code"] &&
                                                marks.fk_USN == student.USN
                                            ) {
                                                // console.log(marks);
                                                student["Marks Gained"] = { ...marks };
                                            }
                                        });
                                        subject.Students.push({ ...student });
                                    }
                                });
                            });
                            classObj.Subjects.push({ ...subject });
                        }
                    });
                    department.Classes.push({ ...classObj });
                }
            });
            return department;
        });

        return result;
    }

    async addDoc(collectionName, body) {
        body["_id"] = new ObjectId().toString();
        let insertedResult = await this.db.collection(collectionName).insertOne(body);
        return insertedResult;
    }
}

module.exports = MongoDB;
