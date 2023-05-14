function addRowsWithSpace (rowsToBeAdded, startRow1, worksheet) {
    let numRowsToAdd1 = rowsToBeAdded.length;
    let numRowsToAdd2 = 5;
    let startRow2 = startRow1 + numRowsToAdd1 + 3;
    worksheet.spliceRows(startRow1, numRowsToAdd1, ...rowsToBeAdded);
    worksheet.spliceRows(startRow2, numRowsToAdd2);
}

function mergeMaado (startCol, endCol, startRow, endRow, worksheet) {
    let cellString = String.fromCharCode(64 + startCol) + startRow + ':' + String.fromCharCode(64 + endCol) + endRow;
    worksheet.mergeCells(cellString);
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

function getDepth(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return 0;
    }

    let maxDepth = 0;

    for (let key in obj) {
        let depth = getDepth(obj[key]);
        if (depth > maxDepth) {
        maxDepth = depth;
        }
    return maxDepth + 1;
    }
}

function generateExcel (data) {
    try {
        let jsonData = data["jsonData"]
        let xPercentageOfMaxMarks = data["xPercentageOfMaxMarks"]
        let studentsAboveX = data["studentsAboveX"]
        let totalStudents = data["totalStudents"]
        let coPercentage = data["coPercentage"]
        let averages = data["averages"]
        let directAttainment = data["directAttainment"]
        let directAttainmentTargetLevels = data["directAttainmentTargetLevels"]
        let indirectAttainment = data["indirectAttainment"]
        let indirectAttainmentTargetLevels = data["indirectAttainmentTargetLevels"]
        let finalAttainment = data["finalAttainment"]
        let copoMappingTable = data["copoMappingTable"]
        let coAttainmentAverage = data["coAttainmentAverage"]
        let poAverages = data["poAverages"]
        let lab = false
        if (Object.keys(jsonData[0]["Subject"]["Max Marks"]).length < 4) {
            lab = true
        }

        let semYear = ''
        let checkSem = jsonData[0]["Subject"]["Semester"];
        switch (checkSem) {
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
        admittedYear = admittedYear + Math.round(semOfClass / 2) - 1
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
            // let forFifty
            // if (!lab) {
            //     if (filteredArr[index] != 'NA' && filteredArr[index] != 'AB') {
            //         forFifty = parseInt(((filteredArr[index]) / 60) * 50)
            //     }
            //     else {
            //         forFifty = filteredArr[index]
            //     }
            //     filteredArr.splice(index, 0, forFifty);
            // }
            studentsForExcel.push(filteredArr)
        });

        const startRow = 12;
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        let excelFile = './template.xlsx'
        // if (lab) {
        //     excelFile = './template1.xlsx'
        // }
        workbook.xlsx.readFile(excelFile)
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
                // worksheet.getCell('D12').value = jsonData[0]["Subject"]["Subject Code"];

                let headingDepth = getDepth(jsonData[0]["Subject"]["Max Marks"]);
                headingDepth += 1
                mergeMaado(1, 1, 12, 12 + headingDepth, worksheet)
                mergeMaado(2, 2, 12, 12 + headingDepth, worksheet)
                mergeMaado(3, 3, 12, 12 + headingDepth, worksheet)
                worksheet.getCell('A12').value = "Sl No."
                worksheet.getCell('B12').value = "USN"
                worksheet.getCell('C12').value = "Student Name"

                let colTracker = 4
                let maxMarksObj = jsonData[0]["Subject"]["Max Marks"]
                for (let ia in maxMarksObj) {
                    // console.log(ia)
                    if (typeof maxMarksObj[ia] === "object") {
                        let objLength = Object.keys(maxMarksObj[ia]).length
                        mergeMaado(colTracker, colTracker+objLength - 1, 13, 13, worksheet)
                        for (let co in maxMarksObj[ia]) {
                            let getCell1 = String.fromCharCode(64 + colTracker) + "13"
                            console.log(ia, co, getCell1)
                            worksheet.getCell(getCell1).value = ia
                            for (let k=0; k < objLength; k++){
                                let getCell2 = String.fromCharCode(64 + colTracker + k) + "14"
                                worksheet.getCell(getCell2).value = co
                            }
                            for (let k=0; k < objLength; k++){
                                let getCell2 = String.fromCharCode(64 + colTracker + k) + "15"
                                worksheet.getCell(getCell2).value = maxMarksObj[ia][co]
                            }
                        }
                        colTracker += objLength
                    } else {
                        let getCell1 = String.fromCharCode(64 + colTracker) + "13"
                        worksheet.getCell(getCell1).value = ia
                        mergeMaado(colTracker, colTracker, 13, 14 ,worksheet)
                        let getCell2 = String.fromCharCode(64 + colTracker) + "15"
                        worksheet.getCell(getCell2).value = maxMarksObj[ia]
                        colTracker += 1
                    }
                }
                mergeMaado(4, colTracker-1, 12, 12, worksheet);

                // startRow = 15
                studentsForExcel.forEach((row, index) => {
                    const newRow = worksheet.addRow(row);
                    newRow.number = startRow + index;
                });
                // let colEnd = 19 
                // if (lab) {
                //     colEnd = 5
                // }
                addBorders(startRow, startRow + i, 1, colTracker-1, worksheet)
                worksheet.getCell('D12').value = jsonData[0]["Subject"]["Subject Code"];
                
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
                calculatedRows.push(valuesArray1)

                let flattenedTotalStudents = flattenObject(totalStudents);
                const valuesArray2 = Object.values(flattenedTotalStudents);
                valuesArray2.unshift(" ")
                valuesArray2.unshift(" ")
                valuesArray2.unshift("Total Students")
                calculatedRows.push(valuesArray2)

                let flattenedCOPercentage = flattenObject(coPercentage);
                const valuesArray3 = Object.values(flattenedCOPercentage);
                valuesArray3.unshift(" ")
                valuesArray3.unshift(" ")
                valuesArray3.unshift("CO Percentage")
                calculatedRows.push(valuesArray3)

                let headingsRow = [' ', ' ', ' ']
                let headingsRow1 = Object.values(jsonData[0]["Subject"]["Max Marks"]).flatMap(innerObj => Object.keys(innerObj));
                headingsRow = headingsRow.concat(headingsRow1)
                headingsRow.push('SEE')
                calculatedRows.push(headingsRow)

                addRowsWithSpace(calculatedRows, calculatedRowNumber, worksheet)
                for (let k = 0; k < 5; k++) {
                    mergeMaado(1, 3, calculatedRowNumber + k, calculatedRowNumber + k, worksheet)
                }
                addBorders(calculatedRowNumber, calculatedRowNumber + 4, 1, colTracker-1, worksheet)

                const keySet = Object.keys(maxMarksObj);
                const noOfCOs = Array.from(new Set(keySet.reduce((acc, key) => [...acc, ...Object.keys(jsonData[0]["Subject"]["Max Marks"][key])], []))).length;

                attainmentTable = []
                attainmentTableForExcelHeadings = ["CO", "CIE", "SEE", "Direct Attainment", "Level", "Course Exit Survey", "Level", "Attainment"]
                attainmentTable.push(attainmentTableForExcelHeadings)

                for (let j = 0; j < noOfCOs; j++) {
                    let subArray = []
                    let coLevel = "CO" + (j + 1)
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

                calculatedRowNumber1 = calculatedRowNumber + 2 + noOfCOs
                addRowsWithSpace(attainmentTable, calculatedRowNumber1, worksheet)
                const rowAttainmentTable = worksheet.getRow(calculatedRowNumber1);
                rowAttainmentTable.height = 40;

                addBorders(calculatedRowNumber1, calculatedRowNumber1 + 1 + noOfCOs, 1, 8, worksheet)

                if (!lab){
                    coAverageTable = []
                    coAverageTableHeading = [' ']
                    for (const key in coPercentage) {
                        if (key != "SEE") {
                            coAverageTableHeading.push(key)
                        }
                    }
                    coAverageTableHeading.push('AVG')
                    coAverageTable.push(coAverageTableHeading)

                    for (let j = 0; j < noOfCOs; j++) {
                        let subArray = []
                        let coLevel = "CO" + (j + 1)
                        subArray.push(coLevel)
                        for (const key in coPercentage) {
                            if (typeof coPercentage[key] === 'object') {
                                let flag = false
                                for (const nestedKey in coPercentage[key]) {
                                    if (coLevel === nestedKey) {
                                        subArray.push(coPercentage[key][nestedKey])
                                        flag = true
                                    }
                                }
                                if (!flag) {
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
                    addBorders(calculatedRowNumber1, calculatedRowNumber1 + noOfCOs, 11, 18, worksheet)
                }

                console.log(targetLevels)
                let significanceTable = [['CO Attainment Level', 'Significance', '', '', '', '', 'For Direct attainment , 50% of CIE and 50% of SEE marks are considered.']]
                significanceTable.push(['Level ' + targetLevels.length, targetLevels[0] + '% and above students should have scored >=' + targetLevels[0] + '% of Total marks', '', '', '', '', 'CO attainment is 90% of direct attainment + 10% of Indirect atttainment.'])
                for( let i = 1; i < targetLevels.length; i++){
                    significanceTable.push(['Level ' + (targetLevels.length - i), targetLevels[i] + '% to ' + (targetLevels[i-1] - 1) + '% of students should have scored >= 60% of Total marks', '', '', '', '', 'CO attainment is 90% of direct attainment + 10% of Indirect atttainment.'])
                }
                
                // ['Level ' + targetLevels.length, Math.max(...targetLevels).toString() + '% and above students should have scored >= 60% of Total marks', '', '', '', '', 'For indirect attainment, Course end survey is considered.'],
                // ['Level 2', Math.max(...targetLevels1).toString() + '% to ' + (Math.max(...targetLevels)-1).toString() + '% of students should have scored >= 60% of Total marks', '', '', '', '', 'CO attainment is 90%of direct attainment + 10% of Indirect atttainment.'],
                
                // ['Level ' + i, Math.min(...targetLevels).toString() + '% to ' + (Math.max(...targetLevels1)-1).toString() + '% of students should have scored >= 60% of Total marks', '', '', '', '', 'PO attainment = CO-PO mapping strength/3 * CO attainment .']]
                calculatedRowNumber2 = calculatedRowNumber1 + 3 + noOfCOs
                addRowsWithSpace(significanceTable, calculatedRowNumber2, worksheet)
                for (let k = 0; k < 4; k++) {
                    mergeMaado(2, 6, calculatedRowNumber2 + k, calculatedRowNumber2 + k, worksheet)
                    mergeMaado(7, 13, calculatedRowNumber2 + k, calculatedRowNumber2 + k, worksheet)
                }
                addBorders(calculatedRowNumber2, calculatedRowNumber2 + 3, 1, 13, worksheet)

                const copoMappingTableForExcel = []
                const copoMappingTableMainHeading = ['', '', 'Co-Po Mapping Table']
                copoMappingTableForExcel.push(copoMappingTableMainHeading)
                const copoMappingTableHeading = ['', '', 'CO\'s', 'PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12', 'PSO1', 'PSO2']
                copoMappingTableForExcel.push(copoMappingTableHeading)

                for (let j = 0; j < noOfCOs; j++) {
                    const subArray = ['', '']
                    coLevel = "CO" + (j + 1)
                    subArray.push(coLevel)
                    for (const key in copoMappingTable) {
                        if (copoMappingTable[key][coLevel] != null && copoMappingTable[key][coLevel] != 0) {
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

                calculatedRowNumber3 = calculatedRowNumber2 + 1 + noOfCOs
                addRowsWithSpace(copoMappingTableForExcel, calculatedRowNumber3, worksheet)
                mergeMaado(3, 17, calculatedRowNumber3, calculatedRowNumber3, worksheet)
                addBorders(calculatedRowNumber3, calculatedRowNumber3 + 2 + noOfCOs, 3, 17, worksheet)
                let cellNumber = 'C' + calculatedRowNumber3
                worksheet.getCell(cellNumber).font = {
                    bold: true
                };

                const poAttainmentTable = []
                const poAttainmentTableMainHeading = ['', '', 'PO Attainment Table']
                poAttainmentTable.push(poAttainmentTableMainHeading)
                const poAttainmentTableHeading = ['', '', 'CO\'s', "CO Attainment", "CO RESULT", 'PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12', 'PSO1', 'PSO2']
                poAttainmentTable.push(poAttainmentTableHeading)

                for (let j = 0; j < noOfCOs; j++) {
                    const subArray = ['', '']
                    coLevel = "CO" + (j + 1)
                    subArray.push(coLevel)
                    subArray.push(finalAttainment[coLevel])
                    if (finalAttainment[coLevel] >= 1.8) {
                        subArray.push('Y')
                    }
                    else {
                        subArray.push("N")
                    }
                    for (const key in copoMappingTable) {
                        if (copoMappingTable[key][coLevel] != null && copoMappingTable[key][coLevel] != 0) {
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

                calculatedRowNumber4 = calculatedRowNumber3 + 5 + noOfCOs
                addRowsWithSpace(poAttainmentTable, calculatedRowNumber4, worksheet)
                mergeMaado(3, 19, calculatedRowNumber4, calculatedRowNumber4, worksheet)
                addBorders(calculatedRowNumber4, calculatedRowNumber4 + 2 + noOfCOs, 3, 19, worksheet)
                cellNumber = 'C' + calculatedRowNumber4
                worksheet.getCell(cellNumber).alignment = {
                    horizontal: 'center',
                    vertical: 'middle'
                };
                worksheet.getCell(cellNumber).font = {
                    bold: true
                };
                const rowpoAttainmentTable = worksheet.getRow(calculatedRowNumber4 + 1);
                rowpoAttainmentTable.height = 40;

                worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                        if (colNumber != 3 || rowNumber > calculatedRowNumber)
                            cell.alignment = {
                                horizontal: 'center',
                                vertical: 'middle'
                            };
                    });
                });
                for (let k = 1; k < 8; k++) {
                    const cell = worksheet.getCell(calculatedRowNumber1, k);
                    cell.alignment = { wrapText: true };
                }
                for (let k = 1; k < 17; k++) {
                    const cell = worksheet.getCell(calculatedRowNumber4 + 1, k);
                    cell.alignment = { wrapText: true };
                }
                excelFileBuffer = await workbook.xlsx.writeBuffer();
            })
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(excelFileBuffer);
            }, 1000)
        })
    } catch (err) {
        console.error('Error adding data to worksheet:', err);
        return new Promise((resolve, reject) => {
            resolve(null);
        })
    };
}

module.exports = generateExcel;