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

    async updateDoc(collectionName, documentId, body) {
        body = Object(body);
        let updatedResult = await this.db
            .collection(collectionName)
            .updateOne({ _id: documentId }, { $set: body });
        return updatedResult.acknowledged;
    }

    async getMarks() {
        let ClassLookUp = {
            $lookup: {
                from: "Class",
                localField: "fk_Class ID",
                foreignField: "_id",
                as: "Classes",
            },
        };

        let StudentLookUp = {
            $lookup: {
                from: "Student",
                localField: "fk_USN",
                foreignField: "USN",
                as: "Students",
            },
        };

        let resultClassAllocation = await this.db.collection("Class Allocation").find().toArray();
        let resultClass = await this.db.collection("Class").find().toArray();
        let resultMarks = await this.db.collection("Marks").find().toArray();
        let resultStudents = await this.db.collection("Student").find().toArray();
        let resultSubjects = await this.db.collection("Subject").find().toArray();
        let resultDepartments = await this.db.collection("Department").find().toArray();
        let result = resultClass.map((c) => {
            //Adding students to class c
            c.students = [];
            resultDepartments.forEach((dep) => {
                if (dep._id == c["fk_Department ID"]) {
                    c.Department = { ...dep };
                    delete c["fk_Department ID"];
                }
            });
            resultClassAllocation.forEach((ca) => {
                if (c._id == ca["fk_Class ID"]) {
                    let student;
                    resultStudents.forEach((s) => {
                        if (s.USN == ca["fk_USN"]) {
                            student = { ...s };
                            student["Marks"] = [];
                        }
                    });
                    resultMarks.map((marks) => {
                        //Adding marks to student
                        if (marks.fk_USN == student?.USN) {
                            let m = { ...marks };
                            resultSubjects.forEach((sub) => {
                                if (sub["Subject Code"] == m["fk_Subject Code"]) {
                                    m.Subject = { ...sub };
                                    delete m["fk_Subject Code"];
                                }
                            });
                            student["Marks"].push(m);
                        }
                    });
                    c.students.push(student);
                }
            });
            return c;
        });
        return result;
    }
}

module.exports = MongoDB;
