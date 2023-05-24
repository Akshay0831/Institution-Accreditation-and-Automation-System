const express = require('express');
const mongo = require("../db/mongodb");
const admin = require("firebase-admin");
const router = express.Router();

function generateTemporaryPassword(temporaryPasswordLength = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let temporaryPassword = '';

    for (let i = 0; i < temporaryPasswordLength; i++)
        temporaryPassword += characters.charAt(Math.floor(Math.random() * characters.length));

    return temporaryPassword;
}

router.route("/")
    .get(async (req, res) => {
        let teachers = await mongo.getDocs("Teacher");
        teachers = await Promise.all(teachers.map(async (teacherObj) => {
            teacherObj.Department = await mongo.getDoc("Department", { _id: teacherObj.Department });
            return teacherObj;
        }));
        let gotTeachers = teachers.length > 0;
        res.status(gotTeachers ? 200 : 400).json(gotTeachers ? teachers : "Couldn't fetch teachers");
    })


    .post(async (req, res) => {
        try {
            const teacherObj = req.body.Teacher;
            const teacherAdded = await mongo.addDoc("Teacher", teacherObj);

            if (teacherAdded.acknowledged) {
                // Create a teacher login in Firebase Auth
                // Get the user ID for the teacher
                const userId = teacherAdded.insertedId;

                // Create the user in Firebase Auth without a set password
                await admin.auth().createUser({
                    uid: userId,
                    email: teacherObj.Mail,
                    emailVerified: true,
                    password: generateTemporaryPassword()
                });
                await admin.auth().setCustomUserClaims(userId, { userType: "Teacher" });
                // // Send a password reset email to the user
                // await admin.auth().generatePasswordResetLink(teacherObj.Mail);

                res.status(200).json("Created new teacher");
            } else {
                res.status(400).json("Couldn't create new teacher");
            }
        } catch (error) {
            console.error('Error creating teacher login:', error);
            // If adding to Firebase fails, remove the added teacher document
            await mongo.deleteDoc("Teacher", { _id: teacherAdded.insertedId });

            res.status(500).json("Failed creating Teacher");
        }
    })

    .put(async (req, res) => {
        try {
            const teacherObj = req.body.Teacher;
            const teacherId = req.body._id;

            // Retrieve the existing email of the teacher from the MongoDB document
            const existingTeacher = await mongo.getDoc("Teacher", { _id: teacherId });

            // Compare the existing email with the new email
            if (existingTeacher.Mail !== teacherObj.Mail) {
                // Update the email for the corresponding Firebase user
                await admin.auth().updateUser(teacherId, {
                    email: teacherObj.Mail
                });
            }

            // Update the email in the MongoDB document
            const teacherUpdated = await mongo.updateDoc("Teacher", { _id: teacherId }, teacherObj);

            res.status(teacherUpdated ? 200 : 400).json(teacherUpdated ? "Updated teacher" : "Couldn't update teacher");
        } catch (error) {
            console.error('Error updating teacher:', error);
            res.status(500).json("Failed updating teacher");
        }
    })

    .delete(async (req, res) => {
        try {
            const teacherId = req.body._id;
            // Delete the Firebase user associated with the teacher
            await admin.auth().deleteUser(teacherId);

            // Delete the teacher document from the MongoDB collection
            const isTeacherDeleted = await mongo.deleteDoc("Teacher", { _id: teacherId });
            const isAllocationDeleted = await mongo.deleteDoc("Teacher Allocation", { Teacher: teacherId });
            const isDepartmentUpdated = await mongo.updateDoc("Department", { HoD: teacherId }, { HoD: "" });

            const isDeleteSuccess = isAllocationDeleted && isTeacherDeleted && isDepartmentUpdated;

            res.status(isDeleteSuccess ? 200 : 400).json({ message: isDeleteSuccess ? "Deleted Successfully" : "Delete Unsuccessful" });
        } catch (error) {
            console.error('Error deleting teacher login:', error);
            res.status(500).json("Failed deleting teacher login");
        }
    });

module.exports = router;