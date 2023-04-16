// const mongo = require("../db/mongodb");

function calculateCOPO (data) {
    try {
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
            let forFifty = parseInt(((filteredArr[index])/60) * 50)
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
            for(let k = 1; k < 8; k++){
                const cell = worksheet.getCell(calculatedRowNumber1, k);
                cell.alignment = { wrapText: true };
            }
        
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
            worksheet.getCell(cellNumber).alignment = { 
                horizontal: 'center',
                vertical: 'middle'
            };
            worksheet.getCell(cellNumber).font = { 
                bold: true
            };

            const poAttainmentTable = []
            const poAttainmentTableMainHeading = ['', '', 'PO Attainment Table']
            poAttainmentTable.push(poAttainmentTableMainHeading)
            const poAttainmentTableHeading = ['', '', 'CO\'s', "CO Attainment in %", "CO RESULT", 'PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12', 'PSO1', 'PSO2']
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