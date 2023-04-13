// place in backend/routes
// const mongo = require("../db/mongodb");

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
            if (marksGained[objectName] != null || marksGained[objectName] != "NA") {
                totalStudents["SEE"] += 1
            }
            if (marksGained[objectName] > studentsAboveX[objectName]) {
                studentsAboveX[objectName] += 1
            }
        }
        for (const objectName1 in marksGained[objectName]) {
            if (marksGained[objectName][objectName1] != null || marksGained[objectName][objectName1] != "NA") {
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

// console.log(coPercentage)

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
//   "3" : 60,
//   "2" : 55,
//   "1" : 50
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

// console.log(finalAttainment)

let sumForAvg = 0;
let countForAvg = 0;

for(let key in finalAttainment) {
    sumForAvg += finalAttainment[key]
    countForAvg += 1
} 
let coAttainmentAverage = sumForAvg/countForAvg

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

// console.log(poAverages)

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
    filteredArr.unshift("Name")
    filteredArr.unshift(usnArray[i])
    i += 1
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
const startRow = 15;
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

attainmentTable = []

attainmentTableForExcelHeadings = ["CO", "CIE", "SEE", "Direct Attainment", "Level", "Course Exit Survey", "Level", "Attainment"]
attainmentTable.push(attainmentTableForExcelHeadings)

for(let j = 0; j<5; j++) {
    let subArray = []
    let coLevel = "CO" + (j+1)
    subArray.push(coLevel)
    subArray.push(averages[coLevel])
    subArray.push(averages["SEE"])
    subArray.push(directAttainment[coLevel])
    subArray.push(directAttainmentTargetLevels[coLevel])
    subArray.push(indirectAttainment[coLevel])
    subArray.push(indirectAttainmentTargetLevels[coLevel])
    subArray.push(finalAttainment[coLevel])
    attainmentTable.push(subArray)
}

coAttainmentAverageSubArray = ["Average", " ", " ", " ", " ", " ", " ", coAttainmentAverage]
attainmentTable.push(coAttainmentAverageSubArray)
// console.log(attainmentTable)

calculatedRowNumber1 = calculatedRowNumber + 7
const newRows2 = XLSX.utils.sheet_add_aoa(worksheet, attainmentTable, { origin: { r: calculatedRowNumber1, c: 0 } });

coAverageTable = []
coAverageTableHeading = [' ']
for (const key in coPercentage){
    if(key != "SEE"){
        coAverageTableHeading.push(key)
    }
}
coAverageTableHeading.push('AVG')
coAverageTable.push(coAverageTableHeading)

for(let j=0; j<5; j++){
    let subArray = []
    let coLevel = "CO" + (j+1)
    subArray.push(coLevel)
    for (const key in coPercentage) {
        if (typeof coPercentage[key] === 'object') {
            let flag = false
            for (const nestedKey in coPercentage[key]) {
                if(coLevel === nestedKey){
                    subArray.push(coPercentage[key][nestedKey])
                    flag = true
                }
            }
            if(!flag){
                subArray.push(' ')
            }
        } else {
            continue
        }
    }
    subArray.push(averages[coLevel])
    coAverageTable.push(subArray)
}
// console.log(coAverageTable)
// let startCol = 11; - Formatting tables next to each other as per sample report
// for (let j = 0; j < coAverageTable.length; j++) {
//     for (let k = 0; k < j.length; k++){
//         let cell = worksheet.Cells(calculatedRowNumber1 + j, startCol + k);
//         cell.Value = coAverageTable[j][k];
//     }
// }

const newRows3 = XLSX.utils.sheet_add_aoa(worksheet, coAverageTable, { origin: { r: calculatedRowNumber1, c: 10 } });

//hardcoded for now, can use db values in place of target levels later on
let significanceTable = [['CO Attainment Level', 'Significance','','','','','','', 'For Direct attainment , 50% of CIE and 50% of SEE marks are considered.'], 
['Level 3', '60% and above students should have scored >= 60% of Total marks','','','','','','', 'For indirect attainment, Course end survey is considered.'], 
['Level 2', '55% to 59% of students should have scored >= 60% of Total marks','','','','','','', 'CO attainment is 90%of direct attainment + 10% of Indirect atttainment.'], 
['Level 1', '50% to 54% of students should have scored >= 60% of Total marks','','','','','','', 'PO attainment = CO-PO mapping strength/3 * CO attainment .']]
calculatedRowNumber2 = calculatedRowNumber1 + 9
const newRows4 = XLSX.utils.sheet_add_aoa(worksheet, significanceTable, { origin: { r: calculatedRowNumber2, c: 0 } });

worksheet['!merges'] = [
    {
        s: { r: calculatedRowNumber2, c: 1 },
        e: { r: calculatedRowNumber2, c: 7 }
    },{
        s: { r: calculatedRowNumber2, c: 8 },
        e: { r: calculatedRowNumber2, c: 14 }
    },
    {
        s: { r: calculatedRowNumber2+1, c: 1 },
        e: { r: calculatedRowNumber2+1, c: 7 }
    },{
        s: { r: calculatedRowNumber2+2, c: 1 },
        e: { r: calculatedRowNumber2+2, c: 7 }
    },
    {
        s: { r: calculatedRowNumber2+3, c: 1 },
        e: { r: calculatedRowNumber2+3, c: 7 }
    },{
        s: { r: calculatedRowNumber2+1, c: 8 },
        e: { r: calculatedRowNumber2+1, c: 14 }
    },{
        s: { r: calculatedRowNumber2+2, c: 8 },
        e: { r: calculatedRowNumber2+2, c: 14 }
    },
    {
        s: { r: calculatedRowNumber2+3, c: 8 },
        e: { r: calculatedRowNumber2+3, c: 14 }
    },
    {
        s: { r: calculatedRowNumber2+6, c: 12 },
        e: { r: calculatedRowNumber2+6, c: 14 }
    },
    {
        s: { r: calculatedRowNumber2+16, c: 9 },
        e: { r: calculatedRowNumber2+16, c: 11 }
    }
];


const copoMappingTableForExcel = []
const copoMappingTableMainHeading = ['','','','','','','Co-Po Mapping Table','','','','','','']
copoMappingTableForExcel.push(copoMappingTableMainHeading)
const copoMappingTableHeading = ['CO\'s', 'PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12', 'PSO1', 'PSO2']
copoMappingTableForExcel.push(copoMappingTableHeading)


for (let j = 0; j < 5; j++) {
    for (const obj of copoMappingTable) {
        const subArray = []
        coLevel = "CO" + (j+1)
        subArray.push(coLevel)
        for (const key in obj) {
            if (key.startsWith("P")) {
                if(obj[key][coLevel] != null){
                    subArray.push(obj[key][coLevel])
                } else {
                    subArray.push('-')
                }
            }
        }
        copoMappingTableForExcel.push(subArray)
    }
}

const avgArray = Object.values(poAverages).map(value => (value === null ? '-' : value));
avgArray.unshift("AVG")
copoMappingTableForExcel.push(avgArray)

// console.log(copoMappingTableForExcel)
calculatedRowNumber3 = calculatedRowNumber2 + 6
const newRows5 = XLSX.utils.sheet_add_aoa(worksheet, copoMappingTableForExcel, { origin: { r: calculatedRowNumber3, c: 6 } });

const poAttainmentTable = []
const poAttainmentTableMainHeading = ['','','','','','','','','PO Attainment Table','','','','','','','']
poAttainmentTable.push(poAttainmentTableMainHeading)
const poAttainmentTableHeading = ['CO\'s', "CO Attainment in %", "CO RESULT", 'PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12', 'PSO1', 'PSO2']
poAttainmentTable.push(poAttainmentTableHeading)


for (let j = 0; j < 5; j++) {
    for (const obj of copoMappingTable) {
        const subArray = []
        coLevel = "CO" + (j+1)
        subArray.push(coLevel)
        subArray.push(finalAttainment[coLevel])
        if(finalAttainment[coLevel] == 3){
            subArray.push('Y')
        }
        else{
            subArray.push("N")
        }
        for (const key in obj) {
            if (key.startsWith("P")) {
                if(obj[key][coLevel] != null){
                    subArray.push(obj[key][coLevel])
                } else {
                    subArray.push('-')
                }
            }
        }
        poAttainmentTable.push(subArray)
    }
}

const avgArray1 = Object.values(poAverages).map(value => (value === null ? '-' : value));
avgArray1.unshift("")
avgArray1.unshift("")
avgArray1.unshift("Average")
poAttainmentTable.push(avgArray1)

calculatedRowNumber4 = calculatedRowNumber3 + 10
const newRows6 = XLSX.utils.sheet_add_aoa(worksheet, poAttainmentTable, { origin: { r: calculatedRowNumber4, c: 1 } });

XLSX.writeFile(workbook, 'output.xlsx');
// XLSX.writeFile(workbook, 'test.xlsx');




// // const XLSX = require('xlsx');
// const Chart = require('chart.js');
// const { createCanvas } = require('canvas');
// const fs = require('fs');

// Register fonts for Chart.js to use
// registerFont('./fonts/Roboto-Regular.ttf', { family: 'Roboto' });
// registerFont('./fonts/Roboto-Bold.ttf', { family: 'Roboto', weight: 'bold' });

// Load the existing workbook
// workbook = XLSX.readFile('test.xlsx');

// Get the worksheet
// worksheet = workbook.Sheets['Sheet1'];

// Create a Chart.js chart
// const chartData = {
//   labels: ['John Doe', 'Jane Smith'],
//   datasets: [{
//     label: 'Age',
//     data: [30, 25],
//     backgroundColor: 'rgba(75, 192, 192, 0.2)',
//     borderColor: 'rgba(75, 192, 192, 1)',
//     borderWidth: 1
//   }]
// };
// const chartOptions = {
//   scales: {
//     y: {
//       beginAtZero: true,
//       max: 40
//     }
//   }
// };
// const canvas = createCanvas(500, 300); // Create a canvas
// const ctx = canvas.getContext('2d');
// const chart = new Chart(ctx, {
//   type: 'bar',
//   data: chartData,
//   options: chartOptions
// });

// // Save the chart as an image file
// const buffer = canvas.toBuffer('image/png');
// fs.writeFileSync('chart.png', buffer);

// // Read the image file as a base64-encoded string
// const imageBase64 = fs.readFileSync('chart.png').toString('base64');

// // Create a worksheet image object
// const image = XLSX.utils.base64_to_img(imageBase64);

// // Set the position and dimensions of the image on the worksheet
// image['!pos'] = {
//   x: 'B2',
//   y: 60, // Set the row number to 40
//   w: 10,
//   h: 7
// };

// // Add the image to the worksheet
// worksheet['!images'] = [image];

// Write the updated workbook to a file

// console.log('Chart image inserted into Excel file at row 40 successfully!');

// const Excel = require('exceljs');
// const Chart = require('chartjs-node');

// // Read existing Excel file
// workbook = new Excel.Workbook();
// workbook.xlsx.readFile('test.xlsx')
// .then(() => {
//   // Reference a specific worksheet by its name
//   const sheetName = 'Sheet1';
//   const worksheet = workbook.getWorksheet(sheetName);

//   // Modify the worksheet as needed
//   // For example, add data to the worksheet
//   const data = [
//     ['Year', 'Sales'],
//     ['2018', 100],
//     ['2019', 200],
//     ['2020', 300]
//   ];
//   worksheet.addRows(data);

//   // Create a chart using chartjs-node
//   const chartNode = new Chart(800, 600);
//   chartNode.drawChart({
//     type: 'bar',
//     data: {
//       labels: ['2018', '2019', '2020'],
//       datasets: [{
//         label: 'Sales',
//         data: [100, 200, 300],
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1
//       }]
//     },
//     options: {
//       title: {
//         display: true,
//         text: 'CO Attainment'
//       },
//       legend: {
//         display: true,
//         position: 'top'
//       },
//       scales: {
//         yAxes: [{
//           ticks: {
//             beginAtZero: true
//           }
//         }]
//       }
//     }
//   });

//   // Save the chart as an image
//   const chartImage = chartNode.getImageBuffer('image/png');

//   // Insert the chart image into the worksheet
//   return worksheet.addImage(chartImage, {
//     tl: { col: 1, row: 40 },
//     br: { col: 6, row: 50 },
//     editAs: 'oneCell'
//   });
// })
// .then(() => {
//   // Save the modified workbook back to the same file
//   return workbook.xlsx.writeFile('test.xlsx');
// })
// .then(() => {
//   console.log('Chart added successfully!');
// })
// .catch((err) => {
//   console.error(err);
// });




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

// const ws = XLSX.utils.aoa_to_sheet([  ['Name', 'Age', 'Gender'],
//   ['John', 25, 'Male'],
//   ['Jane', 30, 'Female'],
//   ['Bob', 40, 'Male']
// ]);

// // set border style for cells
// const borderStyle = { 
//   top: { style: 'thin' }, 
//   bottom: { style: 'thin' }, 
//   left: { style: 'thin' }, 
//   right: { style: 'thin' } 
// };
// const range = XLSX.utils.decode_range(ws['!ref']);
// for (let R = range.s.r; R <= range.e.r; ++R) {
//   for (let C = range.s.c; C <= range.e.c; ++C) {
//     const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
//     ws[cellAddress].s = borderStyle;
//   }
// }

// // add worksheet to workbook and save
// XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
// XLSX.writeFile(wb, 'example.xlsx');
