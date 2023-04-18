// const mongo = require("../db/mongodb");

function calculateCOPO (data) {
    try {
        let maxMarks = data["Marks"][0]["Subject"]["Max Marks"]
        //Can change the below json values dynamically by using: X = Y% of COx (eg. 60% of 18)
        let xPercentageOfMaxMarks = {
            "IA1": {
                "CO1": 0.6 * maxMarks["IA1"]["CO1"],
                "CO2": 0.6 * maxMarks["IA1"]["CO2"]
            },
            "A1": {
                "CO1": 0.6 * maxMarks["A1"]["CO1"],
                "CO2": 0.6 * maxMarks["A1"]["CO2"]
            },
            "IA2": {
                "CO2": 0.6 * maxMarks["IA2"]["CO2"],
                "CO3": 0.6 * maxMarks["IA2"]["CO3"],
                "CO4": 0.6 * maxMarks["IA2"]["CO4"]
            },
            "A2": {
                "CO2": 0.6 * maxMarks["A2"]["CO2"],
                "CO3": 0.6 * maxMarks["A2"]["CO3"],
                "CO4": 0.6 * maxMarks["A2"]["CO4"]
            },
            "IA3": {
                "CO4": 0.6 * maxMarks["IA3"]["CO4"],
                "CO5": 0.6 * maxMarks["IA3"]["CO5"]
            },
            "A3": {
                "CO4": 0.6 * maxMarks["A3"]["CO4"],
                "CO5": 0.6 * maxMarks["A3"]["CO5"]
            },
            "SEE50" : 0.5 * maxMarks["SEE"],
            "SEE": 0.6 * maxMarks["SEE"]
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

        let jsonData = data["Marks"]
        jsonData.sort((a, b) => {
            if (a.Student.USN < b.Student.USN) {
                return -1;
            }
            if (a.Student.USN > b.Student.USN) {
                return 1;
            }
            return 0;
        });

        //Total students and the number of students who have scored above X are calculated
        for (let i = 0; i < jsonData.length; i++) {
            let obj = jsonData[i];
            let marksGained = obj["Marks Gained"];

            for (const objectName in marksGained) {
                if (objectName === "SEE") {
                    if (marksGained[objectName] != null && marksGained[objectName] != "NA" && marksGained[objectName] != "AB") {
                        totalStudents["SEE"] += 1
                    }
                    if (marksGained[objectName] >= xPercentageOfMaxMarks[objectName]) {
                        studentsAboveX[objectName] += 1
                    }
                }
                for (const objectName1 in marksGained[objectName]) {
                    if (marksGained[objectName][objectName1] != null && marksGained[objectName][objectName1] != "NA" && marksGained[objectName][objectName1] != "AB") {
                        totalStudents[objectName][objectName1] += 1
                    }
                    if (marksGained[objectName][objectName1] >= xPercentageOfMaxMarks[objectName][objectName1]) {
                        studentsAboveX[objectName][objectName1] += 1
                    }
                }
            }
        }

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

        //Percent of students who have scored above X is calculated
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

        //Direct attainment is calculated
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
        for (const key in averages) {
            if (key === "SEE") {
                continue
            }
            directAttainment[key] = Number(((averages[key] + coPercentage["SEE"]) / 2).toFixed(2))
        }

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

        let indirectAttainment = data["IndirectAttainmentValues"]["values"]
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

        //hardcoded values for weightage
        let directAttainmentWeightage = 0.9
        let indirectAttainmentWeightage = 0.1
        let finalAttainment = {}
        for (const key in directAttainmentTargetLevels) {
            finalAttainment[key] = Number(((directAttainmentWeightage * directAttainmentTargetLevels[key]) + (indirectAttainmentWeightage * indirectAttainmentTargetLevels[key])).toFixed(2))
        }

        let sumForAvg = 0;
        let countForAvg = 0;
        for(let key in finalAttainment) {
            sumForAvg += finalAttainment[key]
            countForAvg += 1
        } 
        let coAttainmentAverage = sumForAvg/countForAvg

        let copoMappingTable = data["COPOMappings"]

        //Calculate PO Average
        const poAverages = {}
        for (const key in copoMappingTable) {
            let sum = 0;
            let weight = 0;
            let hasNonNullValue = false;
            for (const subkey in copoMappingTable[key]) {
                const value = copoMappingTable[key][subkey];
                if (value !== null && value !== 0) {
                    hasNonNullValue = true;
                    sum += value;
                    weight += 1;
                }
            }
            const weightedAvg = hasNonNullValue ? sum / weight : null;
            poAverages[key] = weightedAvg;
        }

        let semYear = ''
        let checkSem = jsonData[0]["Subject"]["Semester"];
        switch(checkSem){
            case "1": semYear = 'I/I'
            break
            case "2": semYear = 'I/II'
            break
            case "3": semYear = 'II/III'
            break
            case "4": semYear = 'II/IV'
            break
            case "5": semYear = 'III/V'
            break
            case "6": semYear = 'III/VI'
            break
            case "7": semYear = 'IV/VII'
            break
            case "8": semYear = 'IV/VIII'
            break
        }
        
        let admittedYear = jsonData[0]["Student"]["USN"].slice(3, 5)
        admittedYear = parseInt('20' + admittedYear)
        let semOfClass = parseInt(jsonData[0]["Subject"]["Semester"])
        admittedYear = admittedYear + Math.round(semOfClass/2) - 1
        let nextYear = admittedYear + 1
        let academicYear = admittedYear.toString() + '-' + nextYear.toString()

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

        jsonData.forEach((obj) => {
            let flattened = flattenObject(obj["Marks Gained"]);
            const valuesArray = Object.values(flattened);
            const filteredArr = valuesArray.filter((value) => {
                return (value == "NA" || value == "AB" || value === undefined || Number.isInteger(value));
            });
            filteredArr.unshift(obj["Student"]["Student Name"])
            filteredArr.unshift(obj["Student"]["USN"])
            i += 1
            filteredArr.unshift(i)
            let index = filteredArr.length - 1;
            let forFifty
            if(filteredArr[index].isInteger){
                forFifty = parseInt(((filteredArr[index])/60) * 50)
            }
            else{
                forFifty = filteredArr[index]
            }
            filteredArr.splice(index, 0, forFifty);
            studentsForExcel.push(filteredArr)
        });

        const startRow = 15;
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();

        workbook.xlsx.readFile('./test.xlsx')
        .then(async () => {
            const worksheet = workbook.getWorksheet('Sheet1');
            const columnB = worksheet.getColumn('B');
            columnB.width = 15;
            const columnC = worksheet.getColumn('C');
            columnC.width = 25;
            worksheet.getCell('D6').value = semYear;
            worksheet.getCell('D7').value = jsonData[0]["Subject"]["Subject Name"];
            worksheet.getCell('D8').value = jsonData[0]["Subject"]["Subject Code"];
            worksheet.getCell('D9').value = academicYear;
            studentsForExcel.forEach((row, index) => {
                const newRow = worksheet.addRow(row);
                newRow.number = startRow + index;
            });
            addBorders(startRow, startRow+i, 1, 19, worksheet)

            calculatedRowNumber = startRow + i + 1
            calculatedRows = []
            let flattenedMinMarks = flattenObject(xPercentageOfMaxMarks);
            const valuesArray = Object.values(flattenedMinMarks);
            valuesArray.unshift(" ")
            valuesArray.unshift(" ")
            valuesArray.unshift("60% of Maximum marks (X)")
            calculatedRows.push(valuesArray)

            let index = valuesArray.length - 2;
            let flattenedAboveX = flattenObject(studentsAboveX);
            const valuesArray1 = Object.values(flattenedAboveX);
            valuesArray1.unshift(" ")
            valuesArray1.unshift(" ")
            valuesArray1.unshift("No. of Students Above X")
            valuesArray1.push(valuesArray1[index])
            calculatedRows.push(valuesArray1)

            let flattenedTotalStudents = flattenObject(totalStudents);
            const valuesArray2 = Object.values(flattenedTotalStudents);
            valuesArray2.unshift(" ")
            valuesArray2.unshift(" ")
            valuesArray2.unshift("Total Students")
            valuesArray2.push(valuesArray2[index])
            calculatedRows.push(valuesArray2)

            let flattenedCOPercentage = flattenObject(coPercentage);
            const valuesArray3 = Object.values(flattenedCOPercentage);
            valuesArray3.unshift(" ")
            valuesArray3.unshift(" ")
            valuesArray3.unshift("CO Percentage")
            valuesArray3.push(valuesArray3[index])
            calculatedRows.push(valuesArray3)

            let headingsRow = [' ', ' ', ' ', "C01", "CO2","C01", "CO2","C02", "CO3","C04", "CO2","C03", "CO4","C04", "CO5","C04", "CO5", "SEE", "SEE"]
            calculatedRows.push(headingsRow)

            addRowsWithSpace(calculatedRows, calculatedRowNumber, worksheet)
            for (let k = 0; k < 5; k++){
                mergeMaado(1, 3, calculatedRowNumber+k, worksheet)
            }
            addBorders(calculatedRowNumber, calculatedRowNumber+4, 1, 19, worksheet)

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

            calculatedRowNumber1 = calculatedRowNumber + 7
            addRowsWithSpace(attainmentTable, calculatedRowNumber1, worksheet)
            const rowAttainmentTable = worksheet.getRow(calculatedRowNumber1);
            rowAttainmentTable.height = 40;
        
            addBorders(calculatedRowNumber1, calculatedRowNumber1+6, 1, 8, worksheet)
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

            coAverageTable.forEach((row, index) => {
                const rowNumber = calculatedRowNumber1 + index;
                Object.keys(row).forEach((key, colIndex) => {
                const colLetter = String.fromCharCode(65 + (10 + colIndex));
                const cell = worksheet.getCell(`${colLetter}${rowNumber}`);
                cell.value = row[key];
                });
            });
            addBorders(calculatedRowNumber1, calculatedRowNumber1+5, 11, 18, worksheet)

            //hardcoded for now, can use db values in place of target levels later on
            let significanceTable = [['CO Attainment Level', 'Significance','','','','', 'For Direct attainment , 50% of CIE and 50% of SEE marks are considered.'], 
            ['Level 3', '60% and above students should have scored >= 60% of Total marks','','','','', 'For indirect attainment, Course end survey is considered.'], 
            ['Level 2', '55% to 59% of students should have scored >= 60% of Total marks','','','','', 'CO attainment is 90%of direct attainment + 10% of Indirect atttainment.'], 
            ['Level 1', '50% to 54% of students should have scored >= 60% of Total marks','','','','', 'PO attainment = CO-PO mapping strength/3 * CO attainment .']]
            calculatedRowNumber2 = calculatedRowNumber1 + 9
            addRowsWithSpace(significanceTable, calculatedRowNumber2, worksheet)
            for (let k = 0; k < 4; k++){
                mergeMaado(2, 6, calculatedRowNumber2+k, worksheet)
                mergeMaado(7, 13, calculatedRowNumber2+k, worksheet)
            }
            addBorders(calculatedRowNumber2, calculatedRowNumber2+3, 1, 13, worksheet)

            const copoMappingTableForExcel = []
            const copoMappingTableMainHeading = ['', '', 'Co-Po Mapping Table']
            copoMappingTableForExcel.push(copoMappingTableMainHeading)
            const copoMappingTableHeading = ['', '', 'CO\'s', 'PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12', 'PSO1', 'PSO2']
            copoMappingTableForExcel.push(copoMappingTableHeading)

            for (let j = 0; j < 5; j++) {
                const subArray = ['', '']
                coLevel = "CO" + (j+1)
                subArray.push(coLevel)
                for (const key in copoMappingTable) {
                    if(copoMappingTable[key][coLevel] != null && copoMappingTable[key][coLevel] != 0){
                        subArray.push(copoMappingTable[key][coLevel])
                    } else {
                        subArray.push('-')
                    }
                }
                copoMappingTableForExcel.push(subArray)
            }

            const avgArray = Object.values(poAverages).map(value => (value === null ? '-' : value));
            avgArray.unshift("AVG")
            avgArray.unshift("")
            avgArray.unshift("")
            copoMappingTableForExcel.push(avgArray)

            calculatedRowNumber3 = calculatedRowNumber2 + 6
            addRowsWithSpace(copoMappingTableForExcel, calculatedRowNumber3, worksheet)
            mergeMaado(3, 17, calculatedRowNumber3, worksheet)
            addBorders(calculatedRowNumber3, calculatedRowNumber3+7, 3, 17, worksheet)
            let cellNumber = 'C' + calculatedRowNumber3
            worksheet.getCell(cellNumber).font = { 
                bold: true
            };

            const poAttainmentTable = []
            const poAttainmentTableMainHeading = ['', '', 'PO Attainment Table']
            poAttainmentTable.push(poAttainmentTableMainHeading)
            const poAttainmentTableHeading = ['', '', 'CO\'s', "CO Attainment", "CO RESULT", 'PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12', 'PSO1', 'PSO2']
            poAttainmentTable.push(poAttainmentTableHeading)

            for (let j = 0; j < 5; j++) {
                const subArray = ['', '']
                coLevel = "CO" + (j+1)
                subArray.push(coLevel)
                subArray.push(finalAttainment[coLevel])
                if(finalAttainment[coLevel] >= 1.8){
                    subArray.push('Y')
                }
                else{
                    subArray.push("N")
                }
                for (const key in copoMappingTable) {
                    if(copoMappingTable[key][coLevel] != null && copoMappingTable[key][coLevel] != 0){
                        subArray.push(copoMappingTable[key][coLevel])
                    } else {
                        subArray.push('-')
                    }
                }
                poAttainmentTable.push(subArray)
            }

            const avgArray1 = Object.values(poAverages).map(value => (value === null ? '-' : value));
            avgArray1.unshift("")
            avgArray1.unshift("")
            avgArray1.unshift("Average")
            avgArray1.unshift("")
            avgArray1.unshift("")
            poAttainmentTable.push(avgArray1)

            calculatedRowNumber4 = calculatedRowNumber3 + 10
            addRowsWithSpace(poAttainmentTable, calculatedRowNumber4, worksheet)
            mergeMaado(3, 19, calculatedRowNumber4, worksheet)
            addBorders(calculatedRowNumber4, calculatedRowNumber4+7, 3, 19, worksheet)
            cellNumber = 'C' + calculatedRowNumber4
            worksheet.getCell(cellNumber).alignment = { 
                horizontal: 'center',
                vertical: 'middle'
            };
            worksheet.getCell(cellNumber).font = { 
                bold: true
            };
            const rowpoAttainmentTable = worksheet.getRow(calculatedRowNumber4+1);
            rowpoAttainmentTable.height = 40;

            worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    if(colNumber != 3 || rowNumber > calculatedRowNumber) 
                    cell.alignment = {
                        horizontal: 'center',
                        vertical: 'middle'
                    };
                });
            });
            for(let k = 1; k < 8; k++){
                const cell = worksheet.getCell(calculatedRowNumber1, k);
                cell.alignment = { wrapText: true };
            }
            for(let k = 1; k < 17; k++){
                const cell = worksheet.getCell(calculatedRowNumber4+1, k);
                cell.alignment = { wrapText: true };
            }
            await workbook.xlsx.writeFile('./public/formatted_output.xlsx');
        })
        return 'formatted_output.xlsx'
    } catch (err) {
        console.error('Error adding data to worksheet:', err);
        return ''
    };
}

function addRowsWithSpace(rowsToBeAdded, startRow1, worksheet){
    let numRowsToAdd1 = rowsToBeAdded.length;
    let numRowsToAdd2 = 5;
    let startRow2 = startRow1 + numRowsToAdd1 + 3;
    worksheet.spliceRows(startRow1, numRowsToAdd1, ...rowsToBeAdded);
    worksheet.spliceRows(startRow2, numRowsToAdd2);
}

function mergeMaado(startCol, endCol, row, worksheet){
    worksheet.mergeCells(`${String.fromCharCode(64 + startCol)}${row}:${String.fromCharCode(64 + endCol)}${row}`);
}

function addBorders (startRow, endRow, startCol, endCol, worksheet) {
    const border = {
        top: { style: 'medium' },
        bottom: { style: 'medium' },
        left: { style: 'medium' },
        right: { style: 'medium' }
    };

    for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
        const cell = worksheet.getCell(row, col);
        cell.border = border;
    }
    }
}

let data ={
    "Marks": [
        {
            "_id": "643a3e542839d2be81ae9851",
            "Student": {
                "_id": "643a3e542839d2be81ae984b",
                "Student Name": "AMARAVATHI M",
                "USN": "1KS18CS002",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
                    "CO2": 5
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 3
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 16,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 7,
                    "CO5": 6
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 42
            }
        },
        {
            "_id": "643a3e542839d2be81ae9852",
            "Student": {
                "_id": "643a3e542839d2be81ae984c",
                "Student Name": "ADARSH K",
                "USN": "1KS18CS001",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 17,
                    "CO2": 10
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 17,
                    "CO4": 5
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 5,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 6,
                    "CO5": 9
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 47
            }
        },
        {
            "_id": "643a3e542839d2be81ae9853",
            "Student": {
                "_id": "643a3e542839d2be81ae984d",
                "Student Name": "ANIKETH.H",
                "USN": "1KS18CS003",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
                    "CO2": 10
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 18,
                    "CO4": 5
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 5,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 6,
                    "CO5": 18
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 26
            }
        },
        {
            "_id": "643a66482839d2be81ae9966",
            "Student": {
                "_id": "643a66442839d2be81ae9856",
                "Student Name": "AVINASH PRASAD",
                "USN": "1KS18CS008",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 16,
                    "CO2": 11
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
                    "CO4": 11,
                    "CO5": 14
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 36
            }
        },
        {
            "_id": "643a66482839d2be81ae9967",
            "Student": {
                "_id": "643a66442839d2be81ae9854",
                "Student Name": "ARUNA P",
                "USN": "1KS18CS006",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 17,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 17,
                    "CO4": 5
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 7,
                    "CO5": 15
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 50
            }
        },
        {
            "_id": "643a66482839d2be81ae9968",
            "Student": {
                "_id": "643a66452839d2be81ae98d9",
                "Student Name": "KALPITHA.A.J",
                "USN": "1KS19CS408",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 5,
                    "CO3": 12,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 5,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 12,
                    "CO5": 6
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 32
            }
        },
        {
            "_id": "643a66492839d2be81ae996a",
            "Student": {
                "_id": "643a66442839d2be81ae9855",
                "Student Name": "ASHWINI J",
                "USN": "1KS18CS007",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
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
                    "CO4": 15,
                    "CO5": 9
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 46
            }
        },
        {
            "_id": "643a66492839d2be81ae996b",
            "Student": {
                "_id": "643a66442839d2be81ae985a",
                "Student Name": "SAHANA.V",
                "USN": "1KS19CS413",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 5,
                    "CO2": 2
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
                    "CO4": 6,
                    "CO5": 18
                },
                "A3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "SEE": 36
            }
        },
        {
            "_id": "643a66492839d2be81ae9969",
            "Student": {
                "_id": "643a66452839d2be81ae98d8",
                "Student Name": "DHANALAKSHMI.B",
                "USN": "1KS19CS406",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 12,
                    "CO2": 6
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 3
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 7,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 5,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 27
            }
        },
        {
            "_id": "643a66492839d2be81ae996c",
            "Student": {
                "_id": "643a66442839d2be81ae9857",
                "Student Name": "RAMYA.R",
                "USN": "1KS19CS410",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
                    "CO2": 10
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 5,
                    "CO3": 15,
                    "CO4": 4
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 5,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 3,
                    "CO5": 9
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 34
            }
        },
        {
            "_id": "643a66492839d2be81ae996d",
            "Student": {
                "_id": "643a66442839d2be81ae9858",
                "Student Name": "B DEVA DEEKSHITH",
                "USN": "1KS18CS009",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 17,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 17,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 5,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 11,
                    "CO5": 10
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 42
            }
        },
        {
            "_id": "643a66492839d2be81ae996e",
            "Student": {
                "_id": "643a66442839d2be81ae9859",
                "Student Name": "BHAGWAT GOUTAM",
                "USN": "1KS18CS010",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 14,
                    "CO2": 10
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 5,
                    "CO3": 16,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 5,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 5,
                    "CO5": 12
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 29
            }
        },
        {
            "_id": "643a66492839d2be81ae996f",
            "Student": {
                "_id": "643a66442839d2be81ae985e",
                "Student Name": "BRIJESH.S",
                "USN": "1KS18CS014",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 14,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 3
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 15,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 4,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 3,
                    "CO5": 11
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 26
            }
        },
        {
            "_id": "643a66492839d2be81ae9970",
            "Student": {
                "_id": "643a66442839d2be81ae9860",
                "Student Name": "CHANDAN KUMAR",
                "USN": "1KS18CS016",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 16,
                    "CO4": 5
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 4,
                    "CO5": 8
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 32
            }
        },
        {
            "_id": "643a66492839d2be81ae9971",
            "Student": {
                "_id": "643a66442839d2be81ae985f",
                "Student Name": "CHAITHRA R",
                "USN": "1KS18CS015",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 17,
                    "CO4": 6
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
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 44
            }
        },
        {
            "_id": "643a66492839d2be81ae9972",
            "Student": {
                "_id": "643a66452839d2be81ae98dc",
                "Student Name": "RANJITHA.H.D",
                "USN": "1KS19CS411",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 11,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 3
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 14,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 5,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 47
            }
        },
        {
            "_id": "643a66492839d2be81ae9973",
            "Student": {
                "_id": "643a66452839d2be81ae98da",
                "Student Name": "GOLLA YASWANTH",
                "USN": "1KS19CS407",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 9,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 8,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 1,
                    "CO3": 4,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 34
            }
        },
        {
            "_id": "643a66492839d2be81ae9974",
            "Student": {
                "_id": "643a66442839d2be81ae985b",
                "Student Name": "RUSHI.C.S",
                "USN": "1KS19CS412",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 13,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 3,
                    "CO3": 4,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 4,
                    "CO5": 9
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 39
            }
        },
        {
            "_id": "643a66492839d2be81ae9975",
            "Student": {
                "_id": "643a66452839d2be81ae98db",
                "Student Name": "KARTHIK PRAKASH HUDEDAMANI",
                "USN": "1KS19CS409",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 16,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 3
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 16,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 5,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 46
            }
        },
        {
            "_id": "643a66492839d2be81ae9976",
            "Student": {
                "_id": "643a66442839d2be81ae985c",
                "Student Name": "BHOOMIKA H",
                "USN": "1KS18CS012",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
                    "CO2": 10
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 17,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 6,
                    "CO5": 17
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 48
            }
        },
        {
            "_id": "643a66492839d2be81ae9977",
            "Student": {
                "_id": "643a66442839d2be81ae985d",
                "Student Name": "BHUVANA CHANDRIKA GANTI",
                "USN": "1KS18CS013",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 17,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 11,
                    "CO5": 16
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 51
            }
        },
        {
            "_id": "643a66492839d2be81ae9978",
            "Student": {
                "_id": "643a66442839d2be81ae9862",
                "Student Name": "Y.MRUDULA JAIN",
                "USN": "1KS19CS414",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 5,
                    "CO2": 2
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
                    "CO4": 6,
                    "CO5": 12
                },
                "A3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "SEE": 44
            }
        },
        {
            "_id": "643a66492839d2be81ae9979",
            "Student": {
                "_id": "643a66442839d2be81ae9861",
                "Student Name": "DHANANJAYA S",
                "USN": "1KS18CS018",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 11
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
                    "CO4": 10,
                    "CO5": 11
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 40
            }
        },
        {
            "_id": "643a66492839d2be81ae997a",
            "Student": {
                "_id": "643a66442839d2be81ae9863",
                "Student Name": "DANDU NIHARIKA",
                "USN": "1KS18CS017",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 14,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 12,
                    "CO5": 17
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 45
            }
        },
        {
            "_id": "643a66492839d2be81ae997b",
            "Student": {
                "_id": "643a66442839d2be81ae9865",
                "Student Name": "FARIYA N",
                "USN": "1KS18CS020",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 15,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 10,
                    "CO5": 13
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 40
            }
        },
        {
            "_id": "643a66492839d2be81ae997c",
            "Student": {
                "_id": "643a66442839d2be81ae9864",
                "Student Name": "DHRUV JYOTI SHUKLA",
                "USN": "1KS18CS019",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 5,
                    "CO3": 17,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 11,
                    "CO5": 12
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 33
            }
        },
        {
            "_id": "643a66492839d2be81ae997d",
            "Student": {
                "_id": "643a66442839d2be81ae9866",
                "Student Name": "GAGANSURI M S",
                "USN": "1KS18CS022",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 16,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 5,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 7,
                    "CO5": 15
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 34
            }
        },
        {
            "_id": "643a66492839d2be81ae997e",
            "Student": {
                "_id": "643a66442839d2be81ae9867",
                "Student Name": "GOUTHAM M",
                "USN": "1KS18CS024",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 17,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 10,
                    "CO5": 10
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 57
            }
        },
        {
            "_id": "643a66492839d2be81ae997f",
            "Student": {
                "_id": "643a66442839d2be81ae986b",
                "Student Name": "KANDIMALLA KRISHNA PAVITHRA",
                "USN": "1KS18CS027",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 14,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 5,
                    "CO3": 17,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 6,
                    "CO5": 13
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 33
            }
        },
        {
            "_id": "643a66492839d2be81ae9980",
            "Student": {
                "_id": "643a66442839d2be81ae9869",
                "Student Name": "GUNAL BINANI",
                "USN": "1KS18CS025",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 12,
                    "CO4": "NA"
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 4,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 27
            }
        },
        {
            "_id": "643a66492839d2be81ae9981",
            "Student": {
                "_id": "643a66442839d2be81ae986c",
                "Student Name": "KAVITA CHAUDHARY",
                "USN": "1KS18CS029",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 16,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 17,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 10,
                    "CO5": 14
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 42
            }
        },
        {
            "_id": "643a66492839d2be81ae9982",
            "Student": {
                "_id": "643a66442839d2be81ae986a",
                "Student Name": "HARSHITH C PRASAD",
                "USN": "1KS18CS026",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 14,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 14,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 4,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 35
            }
        },
        {
            "_id": "643a66492839d2be81ae9983",
            "Student": {
                "_id": "643a66442839d2be81ae9868",
                "Student Name": "GANESH A",
                "USN": "1KS18CS023",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 14,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 14,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 9,
                    "CO5": 11
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 50
            }
        },
        {
            "_id": "643a66492839d2be81ae9984",
            "Student": {
                "_id": "643a66442839d2be81ae986e",
                "Student Name": "KENCHAM ARUN",
                "USN": "1KS18CS030",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 14,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 15,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 2,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 5,
                    "CO5": 7
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 44
            }
        },
        {
            "_id": "643a66492839d2be81ae9985",
            "Student": {
                "_id": "643a66442839d2be81ae986d",
                "Student Name": "KARTHIK K",
                "USN": "1KS18CS028",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 17,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 7,
                    "CO5": 4
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 26
            }
        },
        {
            "_id": "643a66492839d2be81ae9986",
            "Student": {
                "_id": "643a66442839d2be81ae986f",
                "Student Name": "KILARI ASHWIK",
                "USN": "1KS18CS031",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 17,
                    "CO2": 11
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
                    "CO4": 5,
                    "CO5": 16
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 26
            }
        },
        {
            "_id": "643a66492839d2be81ae9988",
            "Student": {
                "_id": "643a66442839d2be81ae9872",
                "Student Name": "KRITHIKA.K.N",
                "USN": "1KS18CS034",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 16,
                    "CO2": 11
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
                    "CO5": 6
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 33
            }
        },
        {
            "_id": "643a66492839d2be81ae9987",
            "Student": {
                "_id": "643a66442839d2be81ae9871",
                "Student Name": "KRUTHIKA.S.VASISHT",
                "USN": "1KS18CS035",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 5,
                    "CO3": 18,
                    "CO4": 5
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 9,
                    "CO5": 6
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 40
            }
        },
        {
            "_id": "643a66492839d2be81ae9989",
            "Student": {
                "_id": "643a66442839d2be81ae9870",
                "Student Name": "KILARI JASWANTH",
                "USN": "1KS18CS032",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 17,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 2,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 12,
                    "CO5": 16
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 39
            }
        },
        {
            "_id": "643a66492839d2be81ae998b",
            "Student": {
                "_id": "643a66442839d2be81ae9875",
                "Student Name": "LEKKALA SHARANDEEP CHOWDARY",
                "USN": "1KS18CS036",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 16,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 4,
                    "CO3": 18,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 4,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 8,
                    "CO5": 2
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 47
            }
        },
        {
            "_id": "643a66492839d2be81ae998a",
            "Student": {
                "_id": "643a66442839d2be81ae9873",
                "Student Name": "KIRAN VEERANNA DAMBAL",
                "USN": "1KS18CS033",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 16,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 17,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 6,
                    "CO5": 13
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 45
            }
        },
        {
            "_id": "643a66492839d2be81ae998c",
            "Student": {
                "_id": "643a66442839d2be81ae9874",
                "Student Name": "LATHA V",
                "USN": "1KS18CS037",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
                    "CO2": 11
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
                    "CO4": 10,
                    "CO5": 17
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 56
            }
        },
        {
            "_id": "643a66492839d2be81ae998d",
            "Student": {
                "_id": "643a66442839d2be81ae9877",
                "Student Name": "LIKHITHA.N",
                "USN": "1KS18CS039",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 14,
                    "CO2": 6
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
                    "CO4": 6,
                    "CO5": 6
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 51
            }
        },
        {
            "_id": "643a66492839d2be81ae998e",
            "Student": {
                "_id": "643a66442839d2be81ae9876",
                "Student Name": "LAVANYA.C.R",
                "USN": "1KS18CS038",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 16,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 6,
                    "CO5": 18
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 45
            }
        },
        {
            "_id": "643a66492839d2be81ae998f",
            "Student": {
                "_id": "643a66442839d2be81ae987a",
                "Student Name": "MADDULA JITENDRA",
                "USN": "1KS18CS041",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 16,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 16,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 8,
                    "CO5": 7
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 32
            }
        },
        {
            "_id": "643a66492839d2be81ae9990",
            "Student": {
                "_id": "643a66442839d2be81ae9879",
                "Student Name": "MADHUSUDHAN.S.R",
                "USN": "1KS18CS042",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 16,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 15,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 10,
                    "CO5": 10
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 39
            }
        },
        {
            "_id": "643a66492839d2be81ae9991",
            "Student": {
                "_id": "643a66442839d2be81ae9878",
                "Student Name": "LOKESH R",
                "USN": "1KS18CS040",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 14,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 17,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 1,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 10,
                    "CO5": 14
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 51
            }
        },
        {
            "_id": "643a66492839d2be81ae9992",
            "Student": {
                "_id": "643a66442839d2be81ae987b",
                "Student Name": "MAHARAJ S",
                "USN": "1KS18CS043",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 14,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 18,
                    "CO4": 5
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 5,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 20
            }
        },
        {
            "_id": "643a66492839d2be81ae9995",
            "Student": {
                "_id": "643a66442839d2be81ae9881",
                "Student Name": "MIKKIN K M",
                "USN": "1KS18CS050",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
                    "CO2": 10
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 17,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 8,
                    "CO5": 7
                },
                "A3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "SEE": 32
            }
        },
        {
            "_id": "643a66492839d2be81ae9996",
            "Student": {
                "_id": "643a66442839d2be81ae9880",
                "Student Name": "MEGHASHREE A",
                "USN": "1KS18CS049",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 17,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 5,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 11,
                    "CO5": 10
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 38
            }
        },
        {
            "_id": "643a66492839d2be81ae9994",
            "Student": {
                "_id": "643a66442839d2be81ae987f",
                "Student Name": "MANVITH P",
                "USN": "1KS18CS046",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 17,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 14,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 1,
                    "CO3": 2,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 9,
                    "CO5": 6
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 26
            }
        },
        {
            "_id": "643a66492839d2be81ae9993",
            "Student": {
                "_id": "643a66442839d2be81ae987c",
                "Student Name": "MAHESH B V",
                "USN": "1KS18CS044",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 17,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 5,
                    "CO2": 3
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 17,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 7,
                    "CO5": 1
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 34
            }
        },
        {
            "_id": "643a66492839d2be81ae9997",
            "Student": {
                "_id": "643a66442839d2be81ae9882",
                "Student Name": "MONICA S",
                "USN": "1KS18CS051",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
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
                "SEE": 54
            }
        },
        {
            "_id": "643a66492839d2be81ae9998",
            "Student": {
                "_id": "643a66442839d2be81ae9886",
                "Student Name": "NAGARJUN N",
                "USN": "1KS18CS055",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 16,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 5,
                    "CO2": 3
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 15,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 4,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 28
            }
        },
        {
            "_id": "643a66492839d2be81ae9999",
            "Student": {
                "_id": "643a66442839d2be81ae9885",
                "Student Name": "N SAI JAHANAVI",
                "USN": "1KS18CS054",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 14,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 9,
                    "CO5": 11
                },
                "A3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "SEE": 35
            }
        },
        {
            "_id": "643a66492839d2be81ae999a",
            "Student": {
                "_id": "643a66442839d2be81ae9884",
                "Student Name": "MONIKA.K.C",
                "USN": "1KS18CS052",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 11
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
                    "CO4": 8,
                    "CO5": 8
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 46
            }
        },
        {
            "_id": "643a66492839d2be81ae999b",
            "Student": {
                "_id": "643a66442839d2be81ae9888",
                "Student Name": "NARASIMHA MAIYA G S",
                "USN": "1KS18CS057",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 17,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 17,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 11,
                    "CO5": 16
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 58
            }
        },
        {
            "_id": "643a66492839d2be81ae999c",
            "Student": {
                "_id": "643a66442839d2be81ae9887",
                "Student Name": "NANDINI J K",
                "USN": "1KS18CS056",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
                    "CO2": 10
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 15,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 9,
                    "CO5": 10
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 52
            }
        },
        {
            "_id": "643a66492839d2be81ae999d",
            "Student": {
                "_id": "643a66442839d2be81ae988b",
                "Student Name": "NIKHIL VASAN",
                "USN": "1KS18CS060",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 13,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 8,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 1,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 5,
                    "CO5": 7
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 42
            }
        },
        {
            "_id": "643a66492839d2be81ae999f",
            "Student": {
                "_id": "643a66442839d2be81ae988a",
                "Student Name": "NIKHIL.M",
                "USN": "1KS18CS059",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 10,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 12,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 6,
                    "CO5": 4
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 27
            }
        },
        {
            "_id": "643a66492839d2be81ae999e",
            "Student": {
                "_id": "643a66442839d2be81ae9889",
                "Student Name": "NARASIMHARAJU R",
                "USN": "1KS18CS058",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 5,
                    "CO2": 3
                },
                "IA2": {
                    "CO2": "NA",
                    "CO3": "NA",
                    "CO4": "NA"
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 2,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 3,
                    "CO5": 15
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": "AB"
            }
        },
        {
            "_id": "643a66492839d2be81ae99a0",
            "Student": {
                "_id": "643a66442839d2be81ae988f",
                "Student Name": "P SAI RAM",
                "USN": "1KS18CS065",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 17,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 4,
                    "CO2": 3
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
                    "CO4": 10,
                    "CO5": 17
                },
                "A3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "SEE": 51
            }
        },
        {
            "_id": "643a66492839d2be81ae99a1",
            "Student": {
                "_id": "643a66442839d2be81ae988e",
                "Student Name": "NITISH KUMAR.M.R",
                "USN": "1KS18CS063",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 5
                },
                "A1": {
                    "CO1": 4,
                    "CO2": 5
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 12,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 7,
                    "CO5": 1
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 35
            }
        },
        {
            "_id": "643a66492839d2be81ae99a2",
            "Student": {
                "_id": "643a66442839d2be81ae9890",
                "Student Name": "NOOR SUMAIYA",
                "USN": "1KS18CS064",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 16,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 5,
                    "CO2": 3
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
                    "CO4": 6,
                    "CO5": 13
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 35
            }
        },
        {
            "_id": "643a66492839d2be81ae99a3",
            "Student": {
                "_id": "643a66442839d2be81ae987e",
                "Student Name": "MD SUJAN",
                "USN": "1KS18CS047",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 13,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 13,
                    "CO4": 5
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 8,
                    "CO5": 9
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 33
            }
        },
        {
            "_id": "643a66492839d2be81ae99a4",
            "Student": {
                "_id": "643a66442839d2be81ae9883",
                "Student Name": "MOPURI SREELAKSHMI",
                "USN": "1KS18CS053",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 3
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
                    "CO4": 11,
                    "CO5": 15
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 38
            }
        },
        {
            "_id": "643a66492839d2be81ae99a5",
            "Student": {
                "_id": "643a66442839d2be81ae9891",
                "Student Name": "PAVAN P",
                "USN": "1KS18CS066",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 17,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 5,
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
                    "CO4": 11,
                    "CO5": 14
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 42
            }
        },
        {
            "_id": "643a66492839d2be81ae99a7",
            "Student": {
                "_id": "643a66442839d2be81ae9894",
                "Student Name": "ANUSHRUTI SINGH",
                "USN": "1KS18CS005",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 18,
                    "CO4": 5
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 7,
                    "CO5": 11
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 26
            }
        },
        {
            "_id": "643a66492839d2be81ae99a6",
            "Student": {
                "_id": "643a66442839d2be81ae9893",
                "Student Name": "PRANAV M S",
                "USN": "1KS18CS069",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 16,
                    "CO2": 8
                },
                "A1": {
                    "CO1": 5,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 16,
                    "CO4": 6
                },
                "A2": {
                    "CO2": "NA",
                    "CO3": "NA",
                    "CO4": "NA"
                },
                "IA3": {
                    "CO4": 6,
                    "CO5": 9
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 30
            }
        },
        {
            "_id": "643a66492839d2be81ae99a8",
            "Student": {
                "_id": "643a66442839d2be81ae9895",
                "Student Name": "PRATEEK HAVALE",
                "USN": "1KS18CS070",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 10
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
                    "CO5": 17
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 47
            }
        },
        {
            "_id": "643a66492839d2be81ae99a9",
            "Student": {
                "_id": "643a66442839d2be81ae9896",
                "Student Name": "PRAVEEN KUMAR K",
                "USN": "1KS18CS071",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 5,
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
                "SEE": 51
            }
        },
        {
            "_id": "643a66492839d2be81ae99aa",
            "Student": {
                "_id": "643a66442839d2be81ae9897",
                "Student Name": "PREETHI K",
                "USN": "1KS18CS072",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 17,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 5,
                    "CO2": 2
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 18,
                    "CO4": 6
                },
                "A2": {
                    "CO2": "NA",
                    "CO3": "NA",
                    "CO4": "NA"
                },
                "IA3": {
                    "CO4": 6,
                    "CO5": 6
                },
                "A3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "SEE": 38
            }
        },
        {
            "_id": "643a66492839d2be81ae99ab",
            "Student": {
                "_id": "643a66442839d2be81ae988d",
                "Student Name": "NIKITHA M",
                "USN": "1KS18CS062",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
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
                    "CO5": 17
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 59
            }
        },
        {
            "_id": "643a66492839d2be81ae99ac",
            "Student": {
                "_id": "643a66442839d2be81ae988c",
                "Student Name": "NIKIL B S ",
                "USN": "1KS18CS061",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 16,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 17,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 11,
                    "CO5": 11
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 48
            }
        },
        {
            "_id": "643a66492839d2be81ae99ae",
            "Student": {
                "_id": "643a66442839d2be81ae989a",
                "Student Name": "R DEKSHITHA",
                "USN": "1KS18CS075",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 5,
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
                "SEE": 35
            }
        },
        {
            "_id": "643a66492839d2be81ae99ad",
            "Student": {
                "_id": "643a66442839d2be81ae9898",
                "Student Name": "PUJARI VISHNU PRIYA",
                "USN": "1KS18CS073",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 17,
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
                "SEE": 42
            }
        },
        {
            "_id": "643a66492839d2be81ae99af",
            "Student": {
                "_id": "643a66442839d2be81ae9899",
                "Student Name": "PULLUR PAVAN KUMAR",
                "USN": "1KS18CS074",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 17,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 5,
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
                    "CO4": 10,
                    "CO5": 18
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 41
            }
        },
        {
            "_id": "643a66492839d2be81ae99b0",
            "Student": {
                "_id": "643a66442839d2be81ae987d",
                "Student Name": "MANIKONDA THARUN",
                "USN": "1KS18CS045",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 16,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 12,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 5,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 8,
                    "CO5": 10
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 45
            }
        },
        {
            "_id": "643a66492839d2be81ae99b1",
            "Student": {
                "_id": "643a66442839d2be81ae989c",
                "Student Name": "RAMYA R",
                "USN": "1KS18CS077",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 5,
                    "CO2": 3
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
                    "CO4": 11,
                    "CO5": 18
                },
                "A3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "SEE": 28
            }
        },
        {
            "_id": "643a66492839d2be81ae99b2",
            "Student": {
                "_id": "643a66442839d2be81ae989e",
                "Student Name": "RAIPALLE SHREYAA",
                "USN": "1KS18CS079",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 5,
                    "CO2": 1
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 16,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 11,
                    "CO5": 9
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 41
            }
        },
        {
            "_id": "643a66492839d2be81ae99b3",
            "Student": {
                "_id": "643a66442839d2be81ae989f",
                "Student Name": "RAKSHA S",
                "USN": "1KS18CS080",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 3,
                    "CO2": 2
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 18,
                    "CO4": 6
                },
                "A2": {
                    "CO2": "NA",
                    "CO3": "NA",
                    "CO4": "NA"
                },
                "IA3": {
                    "CO4": 11,
                    "CO5": 5
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 45
            }
        },
        {
            "_id": "643a66492839d2be81ae99b4",
            "Student": {
                "_id": "643a66442839d2be81ae989d",
                "Student Name": "RAHUL.P",
                "USN": "1KS18CS078",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 16,
                    "CO2": 12
                },
                "A1": {
                    "CO1": "NA",
                    "CO2": "NA"
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 18,
                    "CO4": 6
                },
                "A2": {
                    "CO2": "NA",
                    "CO3": "NA",
                    "CO4": "NA"
                },
                "IA3": {
                    "CO4": 6,
                    "CO5": 10
                },
                "A3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "SEE": 27
            }
        },
        {
            "_id": "643a66492839d2be81ae99b5",
            "Student": {
                "_id": "643a66442839d2be81ae98a0",
                "Student Name": "RAKSHITH KUMAR.N",
                "USN": "1KS18CS081",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 5,
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
                    "CO4": 9,
                    "CO5": 13
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 50
            }
        },
        {
            "_id": "643a66492839d2be81ae99b7",
            "Student": {
                "_id": "643a66442839d2be81ae98a4",
                "Student Name": "SAMHITHA",
                "USN": "1KS18CS086",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 4,
                    "CO2": 5
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
                    "CO4": 8,
                    "CO5": 11
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 26
            }
        },
        {
            "_id": "643a66492839d2be81ae99b6",
            "Student": {
                "_id": "643a66442839d2be81ae98a1",
                "Student Name": "REKHA N C",
                "USN": "1KS18CS082",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 5,
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
                    "CO4": 11,
                    "CO5": 18
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 51
            }
        },
        {
            "_id": "643a66492839d2be81ae99b8",
            "Student": {
                "_id": "643a66442839d2be81ae98a3",
                "Student Name": "RUBA ABDUL RAHMAN",
                "USN": "1KS18CS084",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 4,
                    "CO2": 1
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 18,
                    "CO4": 6
                },
                "A2": {
                    "CO2": "NA",
                    "CO3": "NA",
                    "CO4": "NA"
                },
                "IA3": {
                    "CO4": "NA",
                    "CO5": 13
                },
                "A3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "SEE": 28
            }
        },
        {
            "_id": "643a66492839d2be81ae99b9",
            "Student": {
                "_id": "643a66442839d2be81ae98a2",
                "Student Name": "RITHANA.N.RAJ",
                "USN": "1KS18CS083",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 6
                },
                "A1": {
                    "CO1": 3,
                    "CO2": 1
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
                    "CO4": 9,
                    "CO5": 5
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 26
            }
        },
        {
            "_id": "643a66492839d2be81ae99ba",
            "Student": {
                "_id": "643a66442839d2be81ae98a5",
                "Student Name": "SANDEEP KUMAR",
                "USN": "1KS18CS087",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 2,
                    "CO2": 3
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
                    "CO4": 11,
                    "CO5": 9
                },
                "A3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "SEE": 32
            }
        },
        {
            "_id": "643a66492839d2be81ae99bb",
            "Student": {
                "_id": "643a66442839d2be81ae98a6",
                "Student Name": "SAURAV KUMAR",
                "USN": "1KS18CS088",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 5,
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
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "A3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "SEE": "AB"
            }
        },
        {
            "_id": "643a66492839d2be81ae99bc",
            "Student": {
                "_id": "643a66442839d2be81ae98a8",
                "Student Name": "SHASHANK G",
                "USN": "1KS18CS091",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 11
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
                "SEE": 44
            }
        },
        {
            "_id": "643a66492839d2be81ae99bd",
            "Student": {
                "_id": "643a66452839d2be81ae98ab",
                "Student Name": "SHASHANK MISHRA",
                "USN": "1KS18CS092",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 14,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 4,
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
                    "CO5": 6
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 18
            }
        },
        {
            "_id": "643a66492839d2be81ae99be",
            "Student": {
                "_id": "643a66442839d2be81ae98a7",
                "Student Name": "SAURAV S MAKAM",
                "USN": "1KS18CS089",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 3,
                    "CO2": "NA"
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 18,
                    "CO4": 6
                },
                "A2": {
                    "CO2": "NA",
                    "CO3": "NA",
                    "CO4": "NA"
                },
                "IA3": {
                    "CO4": 10,
                    "CO5": 10
                },
                "A3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "SEE": 26
            }
        },
        {
            "_id": "643a664a2839d2be81ae99bf",
            "Student": {
                "_id": "643a66442839d2be81ae98a9",
                "Student Name": "SHALINI S",
                "USN": "1KS18CS090",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 5,
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
                "SEE": 53
            }
        },
        {
            "_id": "643a664a2839d2be81ae99c0",
            "Student": {
                "_id": "643a66452839d2be81ae98ac",
                "Student Name": "SHIVA PRAKASH T",
                "USN": "1KS18CS094",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 13,
                    "CO2": 11
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
                    "CO4": 6,
                    "CO5": 18
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 39
            }
        },
        {
            "_id": "643a664a2839d2be81ae99c2",
            "Student": {
                "_id": "643a66452839d2be81ae98af",
                "Student Name": "SOURABH SANTOSH KAMBLE",
                "USN": "1KS18CS097",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 17,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 5,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 12,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 12,
                    "CO5": 17
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 29
            }
        },
        {
            "_id": "643a664a2839d2be81ae99c1",
            "Student": {
                "_id": "643a66452839d2be81ae98aa",
                "Student Name": "SHIVANGI SRIVASTAVA",
                "USN": "1KS18CS093",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 4,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 18,
                    "CO4": 6
                },
                "A2": {
                    "CO2": "NA",
                    "CO3": "NA",
                    "CO4": "NA"
                },
                "IA3": {
                    "CO4": 11,
                    "CO5": 16
                },
                "A3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "SEE": 50
            }
        },
        {
            "_id": "643a664a2839d2be81ae99c3",
            "Student": {
                "_id": "643a66452839d2be81ae98ad",
                "Student Name": "SHUBHASHINI.R",
                "USN": "1KS18CS095",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 17,
                    "CO2": 10
                },
                "A1": {
                    "CO1": 5,
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
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "SEE": 46
            }
        },
        {
            "_id": "643a664a2839d2be81ae99c4",
            "Student": {
                "_id": "643a66442839d2be81ae9892",
                "Student Name": "POOJASHREE K",
                "USN": "1KS18CS067",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 5,
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
                "SEE": 51
            }
        },
        {
            "_id": "643a664a2839d2be81ae99c5",
            "Student": {
                "_id": "643a66452839d2be81ae98b0",
                "Student Name": "SRI CHANDANA P",
                "USN": "1KS18CS098",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
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
                    "CO5": 12
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 42
            }
        },
        {
            "_id": "643a664a2839d2be81ae99c6",
            "Student": {
                "_id": "643a66452839d2be81ae98b1",
                "Student Name": "SRIVIDYA H R",
                "USN": "1KS18CS099",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
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
                    "CO3": 12,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 12,
                    "CO5": 13
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 35
            }
        },
        {
            "_id": "643a664a2839d2be81ae99c7",
            "Student": {
                "_id": "643a66452839d2be81ae98ae",
                "Student Name": "SINDU A S",
                "USN": "1KS18CS096",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
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
                    "CO4": 11,
                    "CO5": 16
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 48
            }
        },
        {
            "_id": "643a664a2839d2be81ae99c8",
            "Student": {
                "_id": "643a66452839d2be81ae98b7",
                "Student Name": "SURAJ C JAWOOR",
                "USN": "1KS18CS105",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 3,
                    "CO2": 2
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 18,
                    "CO4": 6
                },
                "A2": {
                    "CO2": "NA",
                    "CO3": "NA",
                    "CO4": "NA"
                },
                "IA3": {
                    "CO4": 3,
                    "CO5": 6
                },
                "A3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "SEE": 38
            }
        },
        {
            "_id": "643a664a2839d2be81ae99c9",
            "Student": {
                "_id": "643a66452839d2be81ae98b4",
                "Student Name": "SUDHANSHU JOSHI",
                "USN": "1KS18CS102",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 5,
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
                "SEE": 56
            }
        },
        {
            "_id": "643a664a2839d2be81ae99ca",
            "Student": {
                "_id": "643a66452839d2be81ae98b2",
                "Student Name": "SUBRAMANYA N",
                "USN": "1KS18CS100",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": "NA",
                    "CO2": 5
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 16,
                    "CO4": 6
                },
                "A2": {
                    "CO2": "NA",
                    "CO3": "NA",
                    "CO4": "NA"
                },
                "IA3": {
                    "CO4": 6,
                    "CO5": 12
                },
                "A3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "SEE": 39
            }
        },
        {
            "_id": "643a664a2839d2be81ae99cb",
            "Student": {
                "_id": "643a66442839d2be81ae989b",
                "Student Name": "R PRATIKSHA",
                "USN": "1KS18CS076",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 5,
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
                "SEE": 56
            }
        },
        {
            "_id": "643a664a2839d2be81ae99cc",
            "Student": {
                "_id": "643a66452839d2be81ae98b3",
                "Student Name": "SUDHAKAR YASWANTH",
                "USN": "1KS18CS101",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 5,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": "NA",
                    "CO4": 6
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
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 42
            }
        },
        {
            "_id": "643a664a2839d2be81ae99cd",
            "Student": {
                "_id": "643a66452839d2be81ae98b5",
                "Student Name": "SUJAY G S",
                "USN": "1KS18CS103",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 5,
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
                "SEE": 42
            }
        },
        {
            "_id": "643a664a2839d2be81ae99ce",
            "Student": {
                "_id": "643a66452839d2be81ae98b6",
                "Student Name": "SUNAINA NAYAK",
                "USN": "1KS18CS104",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 11
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
                "SEE": 63
            }
        },
        {
            "_id": "643a664a2839d2be81ae99cf",
            "Student": {
                "_id": "643a66452839d2be81ae98b8",
                "Student Name": "SUSHMITHA S",
                "USN": "1KS18CS106",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 10
                },
                "A1": {
                    "CO1": 5,
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
                    "CO4": 6,
                    "CO5": 10
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 40
            }
        },
        {
            "_id": "643a664a2839d2be81ae99d0",
            "Student": {
                "_id": "643a66452839d2be81ae98ba",
                "Student Name": "THAMMINENI HEMANTH CHOWDARY",
                "USN": "1KS18CS108",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 5,
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
                    "CO5": 16
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 52
            }
        },
        {
            "_id": "643a664a2839d2be81ae99d1",
            "Student": {
                "_id": "643a66452839d2be81ae98bb",
                "Student Name": "THIRUMALAI SHAKTIVEL C",
                "USN": "1KS18CS109",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
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
                "SEE": 51
            }
        },
        {
            "_id": "643a664a2839d2be81ae99d2",
            "Student": {
                "_id": "643a66452839d2be81ae98bc",
                "Student Name": "VARIDHI MADHURANATH",
                "USN": "1KS18CS111",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 10
                },
                "A1": {
                    "CO1": 5,
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
                "SEE": 44
            }
        },
        {
            "_id": "643a664a2839d2be81ae99d4",
            "Student": {
                "_id": "643a66452839d2be81ae98c0",
                "Student Name": "VIJAY.N.S",
                "USN": "1KS18CS115",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 10
                },
                "A1": {
                    "CO1": "NA",
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 16,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 11,
                    "CO5": 8
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 33
            }
        },
        {
            "_id": "643a664a2839d2be81ae99d3",
            "Student": {
                "_id": "643a66452839d2be81ae98bd",
                "Student Name": "VAISHAK P",
                "USN": "1KS18CS110",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
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
                "SEE": 39
            }
        },
        {
            "_id": "643a664a2839d2be81ae99d5",
            "Student": {
                "_id": "643a66452839d2be81ae98b9",
                "Student Name": "SWETHA BIJANAPALLI",
                "USN": "1KS18CS107",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 10
                },
                "A1": {
                    "CO1": 5,
                    "CO2": 2
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
                    "CO5": 11
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 42
            }
        },
        {
            "_id": "643a664a2839d2be81ae99d6",
            "Student": {
                "_id": "643a66452839d2be81ae98be",
                "Student Name": "VEDAVEDYA B H",
                "USN": "1KS18CS112",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 10
                },
                "A1": {
                    "CO1": 5,
                    "CO2": 3
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
                    "CO4": 7,
                    "CO5": 2
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 42
            }
        },
        {
            "_id": "643a664a2839d2be81ae99d7",
            "Student": {
                "_id": "643a66452839d2be81ae98c2",
                "Student Name": "VIJETHA",
                "USN": "1KS18CS117",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 5,
                    "CO2": 3
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
                    "CO4": 6,
                    "CO5": 12
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 45
            }
        },
        {
            "_id": "643a664a2839d2be81ae99d8",
            "Student": {
                "_id": "643a66452839d2be81ae98c1",
                "Student Name": "VEERA SREENIDHI.R",
                "USN": "1KS18CS113",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 5,
                    "CO2": 2
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 15,
                    "CO4": 6
                },
                "A2": {
                    "CO2": "NA",
                    "CO3": "NA",
                    "CO4": "NA"
                },
                "IA3": {
                    "CO4": 11,
                    "CO5": 12
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 28
            }
        },
        {
            "_id": "643a664a2839d2be81ae99d9",
            "Student": {
                "_id": "643a66452839d2be81ae98bf",
                "Student Name": "VENKATESH M N",
                "USN": "1KS18CS114",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 10
                },
                "A1": {
                    "CO1": 3,
                    "CO2": 1
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
                    "CO4": 6,
                    "CO5": 3
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 29
            }
        },
        {
            "_id": "643a664a2839d2be81ae99da",
            "Student": {
                "_id": "643a66452839d2be81ae98c3",
                "Student Name": "VIJAYASHREE.N.R",
                "USN": "1KS18CS116",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 2,
                    "CO2": 3
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
                "SEE": 34
            }
        },
        {
            "_id": "643a664a2839d2be81ae99dc",
            "Student": {
                "_id": "643a66452839d2be81ae98c5",
                "Student Name": "VISHNUPRIYA D",
                "USN": "1KS18CS119",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": "NA",
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
                    "CO4": 6,
                    "CO5": 17
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 58
            }
        },
        {
            "_id": "643a664a2839d2be81ae99db",
            "Student": {
                "_id": "643a66452839d2be81ae98c4",
                "Student Name": "VIINOD H MALALI",
                "USN": "1KS18CS118",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
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
                "SEE": 51
            }
        },
        {
            "_id": "643a664a2839d2be81ae99dd",
            "Student": {
                "_id": "643a66452839d2be81ae98c6",
                "Student Name": "VYJAYANTHI K S",
                "USN": "1KS18CS120",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 5,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 18,
                    "CO4": 6
                },
                "A2": {
                    "CO2": "NA",
                    "CO3": "NA",
                    "CO4": "NA"
                },
                "IA3": {
                    "CO4": 12,
                    "CO5": 18
                },
                "A3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "SEE": 28
            }
        },
        {
            "_id": "643a664a2839d2be81ae99df",
            "Student": {
                "_id": "643a66452839d2be81ae98c9",
                "Student Name": "ZAINA KHAN",
                "USN": "1KS18CS123",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 5,
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
                    "CO4": 6,
                    "CO5": 17
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 53
            }
        },
        {
            "_id": "643a664a2839d2be81ae99e0",
            "Student": {
                "_id": "643a66452839d2be81ae98ce",
                "Student Name": "BHAGYASHREE.V ",
                "USN": "1KS18CS128",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 5,
                    "CO2": 2
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
                    "CO4": 9,
                    "CO5": 15
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 35
            }
        },
        {
            "_id": "643a664a2839d2be81ae99e1",
            "Student": {
                "_id": "643a66452839d2be81ae98cd",
                "Student Name": "ARVIND PATHAK",
                "USN": "1KS18CS127",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 5,
                    "CO2": 3
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 16,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 11,
                    "CO5": 16
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 47
            }
        },
        {
            "_id": "643a664a2839d2be81ae99de",
            "Student": {
                "_id": "643a66452839d2be81ae98c7",
                "Student Name": "YASHWANTH.K",
                "USN": "1KS18CS121",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 6
                },
                "A1": {
                    "CO1": 5,
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
                    "CO5": 16
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 30
            }
        },
        {
            "_id": "643a664a2839d2be81ae99e2",
            "Student": {
                "_id": "643a66452839d2be81ae98cb",
                "Student Name": "R SOUMYA",
                "USN": "1KS18CS125",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
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
                "SEE": 62
            }
        },
        {
            "_id": "643a664a2839d2be81ae99e4",
            "Student": {
                "_id": "643a66452839d2be81ae98cf",
                "Student Name": "BI BI AYESHA",
                "USN": "1KS18CS129",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": "NA",
                    "CO2": 3
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
                "SEE": 39
            }
        },
        {
            "_id": "643a664a2839d2be81ae99e5",
            "Student": {
                "_id": "643a66452839d2be81ae98d5",
                "Student Name": "B.K.SUSMITHA",
                "USN": "1KS19CS402",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 16,
                    "CO2": 9
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 13,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 6,
                    "CO5": 6
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 51
            }
        },
        {
            "_id": "643a664a2839d2be81ae99e3",
            "Student": {
                "_id": "643a66452839d2be81ae98d0",
                "Student Name": "SHALINI.K.P ",
                "USN": "1KS18CS131",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 5,
                    "CO2": 2
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
                "SEE": 26
            }
        },
        {
            "_id": "643a664a2839d2be81ae99e6",
            "Student": {
                "_id": "643a66452839d2be81ae98d2",
                "Student Name": "AKSHAY.B.R",
                "USN": "1KS19CS400",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 15,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 15,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 5,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 47
            }
        },
        {
            "_id": "643a664a2839d2be81ae99e7",
            "Student": {
                "_id": "643a66452839d2be81ae98d4",
                "Student Name": "BHAVANI.K.G",
                "USN": "1KS19CS403",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 16,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 15,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 1,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 4,
                    "CO5": 11
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 50
            }
        },
        {
            "_id": "643a664a2839d2be81ae99e8",
            "Student": {
                "_id": "643a66452839d2be81ae98d3",
                "Student Name": "ARPITHA.G",
                "USN": "1KS19CS401",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 3,
                    "CO2": 1
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 16,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 4,
                    "CO5": 12
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 26
            }
        },
        {
            "_id": "643a664a2839d2be81ae99eb",
            "Student": {
                "_id": "643a66452839d2be81ae98c8",
                "Student Name": "YOGITA RAIKAR",
                "USN": "1KS18CS122",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
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
                    "CO5": 17
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 47
            }
        },
        {
            "_id": "643a664a2839d2be81ae99ea",
            "Student": {
                "_id": "643a66452839d2be81ae98d7",
                "Student Name": "CHAITRA.K",
                "USN": "1KS19CS405",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 16,
                    "CO2": 10
                },
                "A1": {
                    "CO1": 6,
                    "CO2": 4
                },
                "IA2": {
                    "CO2": "NA",
                    "CO3": "NA",
                    "CO4": "NA"
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 6,
                    "CO5": 11
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 39
            }
        },
        {
            "_id": "643a664a2839d2be81ae99ec",
            "Student": {
                "_id": "643a66452839d2be81ae98d1",
                "Student Name": "LIKITHA.S ",
                "USN": "1KS18CS130",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 5,
                    "CO2": 2
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 18,
                    "CO4": "NA"
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 12,
                    "CO5": 17
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 47
            }
        },
        {
            "_id": "643a664a2839d2be81ae99e9",
            "Student": {
                "_id": "643a66452839d2be81ae98d6",
                "Student Name": "BHAVYASHREE.R",
                "USN": "1KS19CS404",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 12
                },
                "A1": {
                    "CO1": 3,
                    "CO2": 1
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 16,
                    "CO4": 6
                },
                "A2": {
                    "CO2": 2,
                    "CO3": 6,
                    "CO4": 2
                },
                "IA3": {
                    "CO4": 5,
                    "CO5": 10
                },
                "A3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "SEE": 26
            }
        },
        {
            "_id": "643a664a2839d2be81ae99ed",
            "Student": {
                "_id": "643a66452839d2be81ae98ca",
                "Student Name": "SHEWANI CHIB",
                "USN": "1KS18CS124",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 4,
                    "CO2": 2
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
                    "CO4": 11,
                    "CO5": 18
                },
                "A3": {
                    "CO4": 4,
                    "CO5": 6
                },
                "SEE": 36
            }
        },
        {
            "_id": "643a664a2839d2be81ae99ee",
            "Student": {
                "_id": "643a66452839d2be81ae98cc",
                "Student Name": "RAYYAAN MOHIADDIN ",
                "USN": "1KS18CS126",
                "Department": {
                    "_id": "6378cae1a2552fdc443b92b3",
                    "Department Name": "CSE",
                    "HoD": "6433ef4768d71f34e74c0de7"
                }
            },
            "Subject": {
                "_id": "6433f19785306e164894a65c",
                "Scheme Code": "18",
                "Subject Code": "18CS56",
                "Subject Name": "Unix Programming",
                "Test Assignment Ratio": 3,
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
                        "CO3": 12,
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
                "Semester": "5",
                "Department": "6378cae1a2552fdc443b92b3"
            },
            "Marks Gained": {
                "IA1": {
                    "CO1": 18,
                    "CO2": 11
                },
                "A1": {
                    "CO1": 4,
                    "CO2": 3
                },
                "IA2": {
                    "CO2": 6,
                    "CO3": 18,
                    "CO4": 6
                },
                "A2": {
                    "CO2": "NA",
                    "CO3": "NA",
                    "CO4": "NA"
                },
                "IA3": {
                    "CO4": 11,
                    "CO5": 16
                },
                "A3": {
                    "CO4": "NA",
                    "CO5": "NA"
                },
                "SEE": "AB"
            }
        }
    ],
    "IndirectAttainmentValues": {
        "_id": "643a5c1de3e49fb48318535b",
        "Subject": "6433f19785306e164894a65c",
        "values": {
            "CO1": 51,
            "CO2": 67,
            "CO3": 72,
            "CO4": 80,
            "CO5": 92
        }
    },
    "COPOMappings": {
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
            "CO1": 0,
            "CO2": 0,
            "CO3": 0,
            "CO4": 0,
            "CO5": 0
        },
        "PO5": {
            "CO1": 2,
            "CO2": 2,
            "CO3": 2,
            "CO4": 2,
            "CO5": 0
        },
        "PO6": {
            "CO1": 0,
            "CO2": 0,
            "CO3": 0,
            "CO4": 0,
            "CO5": 0
        },
        "PO7": {
            "CO1": 0,
            "CO2": 0,
            "CO3": 0,
            "CO4": 0,
            "CO5": 0
        },
        "PO8": {
            "CO1": 0,
            "CO2": 0,
            "CO3": 0,
            "CO4": 0,
            "CO5": 0
        },
        "PO9": {
            "CO1": 2,
            "CO2": 2,
            "CO3": 2,
            "CO4": 0,
            "CO5": 0
        },
        "PO10": {
            "CO1": 0,
            "CO2": 0,
            "CO3": 0,
            "CO4": 0,
            "CO5": 0
        },
        "PO11": {
            "CO1": 0,
            "CO2": 0,
            "CO3": 0,
            "CO4": 0,
            "CO5": 0
        },
        "PO12": {
            "CO1": 0,
            "CO2": 0,
            "CO3": 0,
            "CO4": 0,
            "CO5": 0
        },
        "PSO1": {
            "CO1": 2,
            "CO2": 2,
            "CO3": 2,
            "CO4": 2,
            "CO5": 2
        },
        "PSO2": {
            "CO1": 0,
            "CO2": 2,
            "CO3": 2,
            "CO4": 2,
            "CO5": 2
        }
    }
}

console.log(calculateCOPO(data))