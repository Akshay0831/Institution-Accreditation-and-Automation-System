module.exports.MetaData = {
    class: {
        _id: "pk",
        "$Department ID": "fk_Department",
        Section: "str",
        Semester: "int",
    },
    "Class Allocation": {
        _id: "pk",
        "$Class ID": "fk_Class",
        $USN: "fk_Student",
    },
    "CO PO Map": {
        "$Scheme Code": "fk",
        "$Subject Code": "fk_Subject",
        CO: "str",
        PO: "str",
        Values: "str",
    },
    Department: {
        _id: "pk",
        "Department Name": "str",
        "$Hod ID": "fk_Teacher",
    },
    Marks: {
        _id: "pk",
        "Marks Gained": "Array(Array(int))",
        "Max Marks": "Array_int",
        "$Subject Code": "fk_Subject",
        $USN: "fk_Student",
    },
    Student: {
        _id: "pk",
        "$Department ID": "fk_Department",
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
        "$Department ID": "fk_Department",
        Mail: "str_unique",
        Role: "str",
        "Teacher Name": "str",
    },
    "Teacher Allocation": {
        _id: "pk",
        "$Class ID": "fk_Class",
        "$Department ID": "fk_Department",
        "$Subject Code": "fk_Subject",
        "$Teacher ID": "fk_Teacher",
    },
};
