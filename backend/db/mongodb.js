const { MongoClient, ObjectId } = require("mongodb");
class MongoDB {
    constructor(database) {
        this.uri = "mongodb+srv://prajwalkulkarni01:zHLNFYN-KvmJ75W@prodject.lgxin4n.mongodb.net/?retryWrites=true&w=majority";
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

    async getDoc(collectionName, id) {
        const collection = this.db.collection(collectionName);
        let cursorFind = await collection.findOne({ _id: id });
        return cursorFind;
    }

    async deleteDoc(collectionName, documentId) {
        let deletedResult = await this.db
            .collection(collectionName)
            .deleteOne({ _id: documentId });
        return deletedResult.acknowledged;
    }

    async updateDoc(collectionName, searchObj, body) {
        body = Object(body);
        let updatedResult = await this.db
            .collection(collectionName)
            .updateOne(searchObj, { $set: body });
        return updatedResult.acknowledged;
    }

    async addDoc(collectionName, body) {
        body['_id'] = (new ObjectId).toString();
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

                    //Adding Subjects to classes
                    classObj.Subjects = [];
                    resultSubjects.forEach((subject) => {
                        if (subject["fk_Department ID"] == department._id && subject.fk_Semester == classObj.Semester) {

                            // Adding Students to classes
                            subject.Students = [];
                            resultStudents.forEach((student) => {
                                resultClassAllocation.forEach((ca) => {
                                    if (ca.fk_USN == student.USN &&
                                        student["fk_Department ID"] == department._id &&
                                        ca["fk_Class ID"] == classObj._id) {

                                        // Adding marks to each student in each subject
                                        student["Marks Gained"] = {};
                                        resultMarks.forEach((marks) => {
                                            if (marks["fk_Subject Code"] == subject["Subject Code"] && marks.fk_USN == student.USN) {
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

    async deleteThenInsert(collectionName, queryToDelete, insertsArray) {
        for (let i in insertsArray) insertsArray[i]['_id'] = (new ObjectId).toString();
        let collection = this.db.collection(collectionName)
        return ((await collection.deleteMany(queryToDelete)).acknowledged && (await collection.insertMany(insertsArray)).acknowledged);
    }

    async getStudents() {
        let resultStudents = await this.getDocs("Student");
        let resultClasses = await this.getDocs("Class");
        let resultClassAllocations = await this.getDocs("Class Allocation");
        let resultDepartments = await this.getDocs("Department");

        let result = resultDepartments.map(department => {
            department.Classes = [];
            resultClasses.forEach(classObj => {
                if (department._id == classObj["fk_Department ID"]) {
                    classObj.Students = [];
                    resultStudents.forEach(student => {
                        resultClassAllocations.forEach(ca => {
                            if (ca.fk_USN == student.USN &&
                                student["fk_Department ID"] == department._id &&
                                ca["fk_Class ID"] == classObj._id) {
                                classObj.Students.push({ ...student });
                            }
                        })
                    });
                    department.Classes.push({ ...classObj });
                }
            });
            return department;
        });
        return result;
    }
}

module.exports = MongoDB;
