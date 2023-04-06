//Can change the below json values dynamically by using: X = Y% of COx (eg. 60% of 18)
let xPercentageOfMaxMarks = {
    "IA1": {
        "CO1": 11,
        "CO2": 7
    },
    "A1": {
        "CO1": 4,
        "CO2": 2
    },
    "IA2": {
        "CO2": 4,
        "CO3": 11,
        "CO4": 4
    },
    "A2": {
        "CO2": 1,
        "CO3": 4,
        "CO4": 1
    },
    "IA3": {
        "CO4": 7,
        "CO5": 11
    },
    "A3": {
        "CO4": 2,
        "CO5": 4
    },
    "SEE50" : 30,
    "SEE": 36
}

let studentsAboveX = {
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
}

let totalStudents = {
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
};

let jsonData = [
    {
        "_id": "63791811a2552fdc443b934e",
        "Marks Gained": {
            "IA1": {
                "CO1": 17,
                "CO2": 10
            },
            "A1": {
                "CO1": 5,
                "CO2": 3
            },
            "IA2": {
                "CO2": 5,
                "CO3": 17,
                "CO4": 5
            },
            "A2": {
                "CO2": 2,
                "CO3": 6,
                "CO4": 2
            },
            "IA3": {
                "CO4": 12,
                "CO5": 16
            },
            "A3": {
                "CO4": 3,
                "CO5": 5
            },
            "SEE": 47
        },
        "fk_Subject Code": "18cs51",
        "fk_USN": "1ks19cs001"
    },
    {
        "_id": "63791811a2552fdc443b934f",
        "Marks Gained": {
            "IA1": {
                "CO1": 14,
                "CO2": 11
            },
            "A1": {
                "CO1": 5,
                "CO2": 4
            },
            "IA2": {
                "CO2": 5,
                "CO3": 17,
                "CO4": 5
            },
            "A2": {
                "CO2": 2,
                "CO3": 6,
                "CO4": 1
            },
            "IA3": {
                "CO4": 10,
                "CO5": 16
            },
            "A3": {
                "CO4": 3,
                "CO5": 6
            },
            "SEE": 51
        },
        "fk_Subject Code": "18cs51",
        "fk_USN": "1ks19cs002"
    },
    {
        "_id": "63791811a2552fdc443b934f",
        "Marks Gained": {
            "IA1": {
                "CO1": 8,
                "CO2": 11
            },
            "A1": {
                "CO1": 2,
                "CO2": 4
            },
            "IA2": {
                "CO2": 1,
                "CO3": 17,
                "CO4": 5
            },
            "A2": {
                "CO2": "NA",
                "CO3": 6,
                "CO4": 1
            },
            "IA3": {
                "CO4": 10,
                "CO5": 16
            },
            "A3": {
                "CO4": 1,
                "CO5": 6
            },
            "SEE": 50
        },
        "fk_Subject Code": "18cs51",
        "fk_USN": "1ks19cs003"
    }
]

for (let i = 0; i < jsonData.length; i++) {
    let obj = jsonData[i];
    let marksGained = obj["Marks Gained"];

    for (const objectName in marksGained) {
        if (objectName === "SEE") {
            if (marksGained[objectName] != null) {
                totalStudents["SEE"] += 1
            }
            if (marksGained[objectName] > studentsAboveX[objectName]) {
                studentsAboveX[objectName] += 1
            }
        }
        for (const objectName1 in marksGained[objectName]) {
            if (marksGained[objectName][objectName1] != null) {
                totalStudents[objectName][objectName1] += 1
            }
            if (marksGained[objectName][objectName1] > studentsAboveX[objectName][objectName1]) {
                studentsAboveX[objectName][objectName1] += 1
            }
        }
    }
}

// console.log(studentsAboveX)
let coPercentage = {
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
}

for (const objectName in studentsAboveX) {
    if (objectName === "SEE") {
        coPercentage[objectName] = Number(((studentsAboveX[objectName] / totalStudents[objectName]) * 100).toFixed(2))
    }
    for (const objectName1 in studentsAboveX[objectName]) {
        coPercentage[objectName][objectName1] = Number(((studentsAboveX[objectName][objectName1] / totalStudents[objectName][objectName1]) * 100).toFixed(2))
    }
}

let directAttainment = {
    "CO1": 0,
    "CO2": 0,
    "CO3": 0,
    "CO4": 0,
    "CO5": 0
}


const averages = {};

for (const key in coPercentage) {
    if (typeof coPercentage[key] === 'object') {
        for (const subkey in coPercentage[key]) {
            let sum = 0;
            let count = 0;
            for (const otherkey in coPercentage) {
                if (typeof coPercentage[otherkey] === 'object' && coPercentage[otherkey][subkey] !== undefined) {
                    sum += Number(coPercentage[otherkey][subkey]);
                    count++;
                }
            }
            const average = count > 0 ? sum / count : 0;
            averages[subkey] = Number(average.toFixed(2));
        }
    }
    else {
        averages[key] = Number(coPercentage[key]);
    }
}

// console.log(averages)

for (const key in averages) {
    if (key === "SEE") {
        continue
    }
    directAttainment[key] = Number(((averages[key] + coPercentage["SEE"]) / 2).toFixed(2))
}

// console.log(directAttainment)

// let targetLevels = {
//   "60" : 3,
//   "55" : 2,
//   "50" : 1
// }

//hardcoded targetLevels, it can be fetched from db
let directAttainmentTargetLevels = {}
for (const key in directAttainment) {
    if (directAttainment[key] >= 60) {
        directAttainmentTargetLevels[key] = 3
    }
    else if (directAttainment[key] >= 55) {
        directAttainmentTargetLevels[key] = 2
    }
    else if (directAttainment[key] >= 50) {
        directAttainmentTargetLevels[key] = 1
    }
    else {
        directAttainmentTargetLevels[key] = 0
    }
}

// console.log(directAttainmentTargetLevels)
//need to get this data from db
let indirectAttainment = {
    "CO1": 91,
    "CO2": 91,
    "CO3": 91,
    "CO4": 91,
    "CO5": 91
}

let indirectAttainmentTargetLevels = {}
for (const key in indirectAttainment) {
    if (indirectAttainment[key] >= 60) {
        indirectAttainmentTargetLevels[key] = 3
    }
    else if (indirectAttainment[key] >= 55) {
        indirectAttainmentTargetLevels[key] = 2
    }
    else if (indirectAttainment[key] >= 50) {
        indirectAttainmentTargetLevels[key] = 1
    }
    else {
        indirectAttainmentTargetLevels[key] = 0
    }
}

// console.log(indirectAttainmentTargetLevels)

//hardcoded values for weightage
let directAttainmentWeightage = 0.9
let indirectAttainmentWeightage = 0.1
let finalAttainment = {}
for (const key in directAttainmentTargetLevels) {
    finalAttainment[key] = Number(((directAttainmentWeightage * directAttainmentTargetLevels[key]) + (indirectAttainmentWeightage * indirectAttainmentTargetLevels[key])).toFixed(2))
}

console.log(finalAttainment)

let copoMappingTable = [
    {
        "_id": "63a0050c1181da46a46864d0",
        "fk_Subject Code": "63790c36a2552fdc443b9334",
        "PO1": {
            "CO1": 3,
            "CO2": 3,
            "CO3": 3,
            "CO4": 3,
            "CO5": 3
        },
        "PO2": {
            "CO1": 1,
            "CO2": 2,
            "CO3": 2,
            "CO4": 2,
            "CO5": 1
        },
        "PO3": {
            "CO1": 1,
            "CO2": 2,
            "CO3": 2,
            "CO4": 2,
            "CO5": 1
        },
        "PO4": {
            "CO1": null,
            "CO2": null,
            "CO3": null,
            "CO4": null,
            "CO5": null
        },
        "PO5": {
            "CO1": 2,
            "CO2": 2,
            "CO3": 2,
            "CO4": 2,
            "CO5": null
        },
        "PO6": {
            "CO1": null,
            "CO2": null,
            "CO3": null,
            "CO4": null,
            "CO5": null
        },
        "PO7": {
            "CO1": null,
            "CO2": null,
            "CO3": null,
            "CO4": null,
            "CO5": null
        },
        "PO8": {
            "CO1": null,
            "CO2": null,
            "CO3": null,
            "CO4": null,
            "CO5": null
        },
        "PO9": {
            "CO1": 2.00,
            "CO2": 2.00,
            "CO3": 2.00,
            "CO4": null,
            "CO5": null
        },
        "PO10": {
            "CO1": null,
            "CO2": null,
            "CO3": null,
            "CO4": null,
            "CO5": null
        },
        "PO11": {
            "CO1": null,
            "CO2": null,
            "CO3": null,
            "CO4": null,
            "CO5": null
        },
        "PO12": {
            "CO1": null,
            "CO2": null,
            "CO3": null,
            "CO4": null,
            "CO5": null
        },
        "PSO1": {
            "CO1": 2,
            "CO2": 2,
            "CO3": 2,
            "CO4": 2,
            "CO5": 2
        },
        "PSO2": {
            "CO1": null,
            "CO2": 2,
            "CO3": 2,
            "CO4": 2,
            "CO5": 2
        }
    }
]

const poAverages = {}

for (const obj of copoMappingTable) {
    for (const key in obj) {
        if (key.startsWith("P")) {
            let sum = 0;
            let weight = 0;
            let hasNonNullValue = false;
            for (const subkey in obj[key]) {
                const value = obj[key][subkey];
                if (value !== null) {
                    hasNonNullValue = true;
                    sum += value;
                    weight += 1;
                }
            }
            const weightedAvg = hasNonNullValue ? sum / weight : null;
            poAverages[key] = weightedAvg;
        }
    }
}

console.log(poAverages)

// const rowsToAdd = jsonData.map(obj => Object.values(obj));
function flattenObject(obj) {
    let flattened = {};
    for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
        let nestedObj = flattenObject(obj[key]);
        for (let nestedKey in nestedObj) {
            flattened[key + '.' + nestedKey] = nestedObj[nestedKey];
        }
        } else {
        flattened[key] = obj[key];
        }
    }
    return flattened;
}

let studentsForExcel = []
let i = 0
const usnArray = jsonData.map(obj => obj.fk_USN);

jsonData.forEach((obj) => {
    let flattened = flattenObject(obj);
    const valuesArray = Object.values(flattened);
    const filteredArr = valuesArray.filter((value) => {
        return (value === "NA" || value === undefined || Number.isInteger(value));
    });
    filteredArr.unshift(usnArray[i])
    i += 1
    filteredArr.unshift("Name")
    filteredArr.unshift(i)
    let index = filteredArr.length - 1; // get the index of the last but one element
    let forFifty = parseInt(((filteredArr[index])/60) * 50)
    filteredArr.splice(index, 0, forFifty);
    studentsForExcel.push(filteredArr)
});


// const arr = objectToArray(jsonData);
// console.log(arr);

const XLSX = require('xlsx');

const workbook = XLSX.readFile('test.xlsx');
const worksheet = workbook.Sheets['Sheet1'];
const startRow = 116;
const newRows = XLSX.utils.sheet_add_aoa(worksheet, studentsForExcel, { origin: { r: startRow, c: 0 } });
// XLSX.writeFile(workbook, 'test.xlsx');

calculatedRowNumber = startRow + i + 1
calculatedRows = []

let flattenedMinMarks = flattenObject(xPercentageOfMaxMarks);
const valuesArray = Object.values(flattenedMinMarks);
valuesArray.unshift("60% of Maximum marks (X)")
calculatedRows.push(valuesArray)

let index = valuesArray.length - 2;
let flattenedAboveX = flattenObject(studentsAboveX);
const valuesArray1 = Object.values(flattenedAboveX);
valuesArray1.unshift("No. of Students Above X")
// valuesArray1.splice(index, 0, flattenedAboveX[index]);
// valuesArray1.push(valuesArray1[valuesArray1 - 1]);
// valuesArray1.push(valuesArray1.slice(-1)[0])
valuesArray1.push(valuesArray1[index])
calculatedRows.push(valuesArray1)


let flattenedTotalStudents = flattenObject(totalStudents);
const valuesArray2 = Object.values(flattenedTotalStudents);
valuesArray2.unshift("Total Students")
// console.log(valuesArray2.length)
// valuesArray2.splice(index, 0, flattenedTotalStudents[index]);
// valuesArray2.push(valuesArray2[valuesArray2 - 1]);
// console.log(valuesArray2[index+1])
valuesArray2.push(valuesArray2[index])
calculatedRows.push(valuesArray2)

let flattenedCOPercentage = flattenObject(coPercentage);
const valuesArray3 = Object.values(flattenedCOPercentage);
// valuesArray3.splice(index, 0, flattenedCOPercentage[index]);
valuesArray3.unshift("CO Percentage")
valuesArray3.push(valuesArray3[index])
// valuesArray3.push(valuesArray3[valuesArray3 - 1]);
calculatedRows.push(valuesArray3)

let headingsRow = [' ', "C01", "CO2","C01", "CO2","C02", "CO3","C04", "CO2","C03", "CO4","C04", "CO5","C04", "CO5", "SEE", "SEE"]
calculatedRows.push(headingsRow)

const newRows1 = XLSX.utils.sheet_add_aoa(worksheet, calculatedRows, { origin: { r: calculatedRowNumber, c: 0 } });
XLSX.writeFile(workbook, 'test.xlsx');




// const mergeRange = {
//     s: { r: 22, c: 1 },
//     e: { r: 22, c: 4 }
//     };

//   // Merge the cells in the specified range (for the Name column only)
//     worksheet.mergeCells(XLSX.utils.encode_range(mergeRange));

// Define the rows to add as an array of objects
// const rowsToAdd1 = xPercentageOfMaxMarks.map(obj => Object.values(obj));
// const rowsToAdd1 = [xPercentageOfMaxMarks].map(obj => [...Object.values(obj), 'merged cells']);


// Define the headers for the normal cells
// const headers = ['Name', 'Age', 'Email'];

// Add the rows to the worksheet starting from line 15
// const startRow1 = 22;
// const startCol = 0;
// let rowNum = startRow1;
// let newRows1 = XLSX.utils.sheet_add_aoa(worksheet, rowsToAdd1, { origin: { r: rowNum, c: startCol } });
// rowNum += newRows1.length;

// Save the workbook
// XLSX.writeFile(workbook, 'test.xlsx');
