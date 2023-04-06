const models = {
    Class: {
        "_id": "",
        "Section": "",
        "Semester": "",
        "Department": ""
    },
    "Class Allocation": {
        "_id": "",
        "Class": "",
        "Student": ""
    },
    "CO PO Map": {
        "_id": "",
        "Subject": "",
        "CO": "",
        "PO": "",
        "Value": ""
    },
    Department: {
        "_id": "",
        "Department Name": "",
        "HoD": ""
    },
    Marks: {
        "_id": "",
        "Marks Gained": {
            "IA1": {
                "CO1": 0,
                "CO2": 0
            },
            "A1": {
                "CO1": 0,
                "CO2": 0
            },
            "IA2": {
                "CO2": 0,
                "CO3": 0,
                "CO4": 0
            },
            "A2": {
                "CO2": 0,
                "CO3": 0,
                "CO4": 0
            },
            "IA3": {
                "CO4": 0,
                "CO5": 0
            },
            "A3": {
                "CO4": 0,
                "CO5": 0
            },
            "SEE": 0
        },
        "Subject": "",
        "Student": ""
    },
    Student: {
        "_id": "",
        "Student Name": "",
        "USN": "",
        "Department": ""
    },
    Subject: {
        "_id": "",
        "Scheme Code": "",
        "Subject Code": "",
        "Subject Name": "",
        "Max Marks": {
            "IA1": {
                "CO1": 0,
                "CO2": 0
            },
            "A1": {
                "CO1": 0,
                "CO2": 0
            },
            "IA2": {
                "CO2": 0,
                "CO3": 0,
                "CO4": 0
            },
            "A2": {
                "CO2": 0,
                "CO3": 0,
                "CO4": 0
            },
            "IA3": {
                "CO4": 0,
                "CO5": 0
            },
            "A3": {
                "CO4": 0,
                "CO5": 0
            },
            "SEE": 0
        },
        "Semester": 0,
        "Department": ""
    },
    Teacher: {
        "_id": "",
        "Mail": "",
        "Role": "",
        "Teacher Name": "",
        "Department": ""
    },
    "Teacher Allocation": {
        "_id": "",
        "Class": "",
        "Subject": "",
        "Teacher": "",
        "Department": ""
    }
};

module.exports = models;