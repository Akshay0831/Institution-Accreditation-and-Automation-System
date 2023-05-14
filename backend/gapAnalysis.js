const ExcelJS = require('exceljs');

function addBorders (startRow, endRow, startCol, endCol, sheet) {
    const border = {
        top: { style: 'medium' },
        bottom: { style: 'medium' },
        left: { style: 'medium' },
        right: { style: 'medium' }
    };

    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
            const cell = sheet.getCell(row, col);
            cell.border = border;
        }
    }
}

function generateGapAnalysisReport (data) {
    let A = 27
    let G = 14
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet1');
    // const sheet = workbook.getWorksheet('Sheet1');
    const columnB = sheet.getColumn('B');
    columnB.width = 40;
    const columnC = sheet.getColumn('C');
    columnC.width = 12;
    
    let poCount = {'PO1' : 0, 'PO2' : 0, 'PO3' : 0, 'PO4' : 0, 'PO5' : 0, 'PO6' : 0, 'PO7' : 0, 'PO8' : 0, 'PO9' : 0, 'PO10' : 0, 'PO11' : 0, 'PO12' : 0, 'PSO1' : 0, 'PSO2' : 0}
    let poSum = {'PO1' : 0, 'PO2' : 0, 'PO3' : 0, 'PO4' : 0, 'PO5' : 0, 'PO6' : 0, 'PO7' : 0, 'PO8' : 0, 'PO9' : 0, 'PO10' : 0, 'PO11' : 0, 'PO12' : 0, 'PSO1' : 0, 'PSO2' : 0}
    sheet.addRow(['Sl No.', 'Subject Name', 'Subject Code', 'PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12', 'PSO1', 'PSO2']);

    let i = 1;
    data.forEach((subject) => {
        const row = [];
        row.push(subject['Subject Name']);
        row.push(subject['Subject Code']);
        for (const po in subject['PO Averages']) {
            if(subject['PO Averages'][po] != null){
                row.push(subject['PO Averages'][po]);
                poCount[po] += 1;
                poSum[po] += subject['PO Averages'][po];
            }
            else {
                row.push('');
            }
        }
        row.unshift(i);
        sheet.addRow(row);
        i += 1;
    });

    let sumRow = ['', 'SUM = A', ''];
    let values = Object.values(poSum);
    sumRow = sumRow.concat(values);
    sheet.addRow(sumRow);

    let countRow = ['', '(Total no. of courses addressing each PO)= T', ''];
    let values1 = Object.values(poCount);
    countRow = countRow.concat(values1);
    sheet.addRow(countRow);

    console.log(sumRow)
    let poGaps = {}
    for (let entry in poSum){
        if(poSum[entry] < A){
            poGaps[entry] =  ((27-poSum[entry])/(27))*100;
        }
        else{
            poGaps[entry] = ''
        }
    };

    let poGaps1 = {}
    for (let entry in poCount){
        if(poCount[entry] < G){
            poGaps1[entry] = G - poCount[entry];
        }
        else{
            poGaps1[entry] = ''
        }
    };

    let gapRow = ['', 'GAP G= (27-A)/(27))*100', '']
    let values2 = Object.values(poGaps);
    gapRow = gapRow.concat(values2);
    sheet.addRow(gapRow);

    let gapRow1 = ['', 'Gaps in T', '']
    let values3 = Object.values(poGaps1);
    gapRow1 = gapRow1.concat(values3);
    sheet.addRow(gapRow1);

    sheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            if (colNumber != 2 || rowNumber > i)
                cell.alignment = {
                    horizontal: 'center',
                    vertical: 'middle'
                };
        });
    });
    addBorders(1, i+4, 1, 17, sheet);
    workbook.xlsx.writeFile('data1.xlsx').then(() => {
        console.log('Excel file created successfully');
    }).catch((error) => {
        console.log('Error creating Excel file:', error);
    });
}

let data = [
    {
    "Subject Name":"Unix Programming",
    "Subject Code":"18CS56",
    "PO Averages":{
        "PO1":3,
        "PO2":1.6,
        "PO3":1.6,
        "PO4":null,
        "PO5":2,
        "PO6":null,
        "PO7":null,
        "PO8":null,
        "PO9":2,
        "PO10":null,
        "PO11":null,
        "PO12":null,
        "PSO1":2,
        "PSO2":2
    }
}, {
    "Subject Name":"DSA",
    "Subject Code":"18CS32",
    "PO Averages":{
        "PO1":2,
        "PO2":1.6,
        "PO3":1.6,
        "PO4":1,
        "PO5":null,
        "PO6":null,
        "PO7":null,
        "PO8":null,
        "PO9":2,
        "PO10":null,
        "PO11":null,
        "PO12":null,
        "PSO1":2,
        "PSO2":2
    }
}
]

generateGapAnalysisReport(data);

// module.exports = generateGapAnalysisReport;