const models = {
    Class: {
        "Section": "",
        "Semester": "",
        "fk_Department": ""
    },
    "Class Allocation": {
        "fk_Class ID": "",
        "fk_USN": ""
    },
    "CO PO Map": {
        "fk_Subject Code": "",
        "CO": "",
        "PO": "",
        "Value": ""
    },
    Department: {
        "Department Name": "",
        "fk_HoD ID": ""
    },
    Marks: {
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
        "fk_Subject Code": "",
        "fk_USN": ""
    },
    Student: {
        "Student Name": "",
        "USN": "",
        "fk_Department": ""
    },
    Subject: {
        "Scheme Code": "",
        "Subject Code": "",
        "Subject Name": "",
        "Test Assignment Ratio": 0,
        "fk_Department": "",
        "Max Marks": {
            "IA1": {
                "CO1": 18,
                "CO2": 12
            },
            "A1": {
                "CO1": 6,
                "CO2": 4
            },
            "IA2": {
                "CO2": 6,
                "CO3": 18,
                "CO4": 6
            },
            "A2": {
                "CO2": 2,
                "CO3": 6,
                "CO4": 2
            },
            "IA3": {
                "CO4": 12,
                "CO5": 18
            },
            "A3": {
                "CO4": 4,
                "CO5": 6
            },
            "SEE": 60
        },
        "Semester": 0
    },
    Teacher: {
        "Mail": "",
        "Role": "",
        "Teacher Name": "",
        "fk_Department": ""
    },
    "Teacher Allocation": {
        "fk_Class ID": "",
        "fk_Department": "",
        "fk_Subject Code": "",
        "fk_Teacher ID": ""
    }
};

module.exports = models;