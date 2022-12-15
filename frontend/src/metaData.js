export const MetaData = {
    Class: {
        _id: "pk",
        "fk_Department ID": "fk_Department",
        Section: "str",
        Semester: "int",
    },
    "Class Allocation": {
        _id: "pk",
        "fk_Class ID": "fk_Class",
        fk_USN: "fk_Student",
    },
    "CO PO Map": {
        "fk_Scheme Code": "fk",
        "fk_Subject Code": "fk_Subject",
        CO: "str",
        PO: "str",
        Values: "str",
    },
    Department: {
        _id: "pk",
        "Department Name": "str",
        "fk_Hod ID": "fk_Teacher",
    },
    Marks: {
        _id: "pk",
        "Marks Gained": "Array(Array(int))",
        "Max Marks": "Array_int",
        "fk_Subject Code": "fk_Subject",
        fk_USN: "fk_Student",
    },
    Student: {
        _id: "pk",
        "fk_Department ID": "fk_Department",
        "Student Name": "str",
        USN: "pk",
    },
    Subject: {
        _id: "pk",
        "Test Assignment Ratio": {
            Assignment: "int",
            Test: "int",
        },
        MarksMeta: "Object(Object())",
        "Scheme Code": "str",
        "Subject Code": "pk",
        "Subject Name": "str",
    },
    Teacher: {
        _id: "pk",
        "fk_Department ID": "fk_Department",
        Mail: "str_unique",
        Role: "str",
        "Teacher Name": "str",
    },
    "Teacher Allocation": {
        _id: "pk",
        "fk_Class ID": "fk_Class",
        "fk_Department ID": "fk_Department",
        "fk_Subject Code": "fk_Subject",
        "fk_Teacher ID": "fk_Teacher",
    },
};
