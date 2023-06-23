const excelForCourse = require("./excelForCourse");

function deepCopyObject(originalObject, defaultValue = null) {
    const copiedObject = {};
    for (let key in originalObject) {
        if (typeof originalObject[key] === 'object')
            copiedObject[key] = deepCopyObject(originalObject[key], defaultValue);
        else if (defaultValue != null)
            copiedObject[key] = defaultValue;
        else
            copiedObject[key] = originalObject[key];
    }
    return copiedObject;
}

function calculateAttainmentLevel(targetLevelsLen, coObject, targetLevels) {
    let coObjectTargetLevels = {}
    for (const key in coObject) {
        let attainedFlag = false
        for (let k = 0; k < targetLevelsLen; k++) {
            if (coObject[key] >= targetLevels[k]) {
                coObjectTargetLevels[key] = targetLevelsLen - k
                attainedFlag = true
                break
            }
        }
        if (!attainedFlag) {
            coObjectTargetLevels[key] = 0
        }
    }
    return coObjectTargetLevels
}

async function calculateCOPO(data) {
    let generateReport = data.generateReport;
    console.log("🚀 ~ file: coCalculation.js:38 ~ calculateCOPO ~ data:", data["Marks"][0]["Subject"])
    let maxMarks = data["Marks"][0]["Subject"]["Max Marks"][data.batch];
    // console.log(maxMarks)

    let marksThreshold = data.Threshold ? data.Threshold : 0.6;
    let xPercentageOfMaxMarks = data["Marks"][0]["Subject"]["Max Marks"][data.batch];
    let studentsAboveX = deepCopyObject(xPercentageOfMaxMarks, 0)
    let totalStudents = deepCopyObject(xPercentageOfMaxMarks, 0)
    let coPercentage = deepCopyObject(xPercentageOfMaxMarks, 0)
    let jsonData = data["Marks"]
    let directAttainmentTargetLevels
    let indirectAttainment = data["IndirectAttainmentValues"]?.["values"]
    let indirectAttainmentTargetLevels
    let directAttainmentWeightage = 0.9
    let indirectAttainmentWeightage = 0.1
    let sumForAvg = 0;
    let countForAvg = 0;
    let finalAttainment = {}
    let coAttainmentAverage
    let copoMappingTable = data["COPOMappings"]
    const coKeys = new Set();
    const directAttainment = {};
    const averages = {};
    const poAverages = {}

    for (let key1 in xPercentageOfMaxMarks) {
        if (typeof xPercentageOfMaxMarks[key1] === "object") {
            for (let key2 in xPercentageOfMaxMarks[key1]) {
                xPercentageOfMaxMarks[key1][key2] = xPercentageOfMaxMarks[key1][key2] * marksThreshold;
            }
        } else {
            xPercentageOfMaxMarks[key1] = xPercentageOfMaxMarks[key1] * marksThreshold;
        }
    }

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

    //Percent of students who have scored above X is calculated
    for (const objectName in studentsAboveX) {
        if (objectName === "SEE") {
            coPercentage[objectName] = Number(((studentsAboveX[objectName] / totalStudents[objectName]) * 100).toFixed(2))
        }
        for (const objectName1 in studentsAboveX[objectName]) {
            coPercentage[objectName][objectName1] = Number(((studentsAboveX[objectName][objectName1] / totalStudents[objectName][objectName1]) * 100).toFixed(2))
        }
    }

    for (const key in maxMarks) {
        const innerObj = maxMarks[key];
        for (const innerKey in innerObj) {
            coKeys.add(innerKey);
        }
    }

    for (const key of coKeys) {
        directAttainment[key] = 0;
    }

    //Direct attainment is calculated
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

    targetLevels = data["targetValues"]
    targetLevels.sort((a, b) => b - a);
    let targetLevelsLen = data["targetValues"].length
    directAttainmentTargetLevels = calculateAttainmentLevel(targetLevelsLen, directAttainment, targetLevels)
    indirectAttainmentTargetLevels = calculateAttainmentLevel(targetLevelsLen, indirectAttainment, targetLevels)

    for (const key in directAttainmentTargetLevels) {
        finalAttainment[key] = Number(((directAttainmentWeightage * directAttainmentTargetLevels[key]) + (indirectAttainmentWeightage * indirectAttainmentTargetLevels[key])).toFixed(2))
    }
    for (let key in finalAttainment) {
        sumForAvg += finalAttainment[key]
        countForAvg += 1
    }
    coAttainmentAverage = sumForAvg / countForAvg

    //Calculate PO Average
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

    if (generateReport == true) {
        try {
            let excelFileBuffer = await excelForCourse({
                ...{
                    jsonData,
                    xPercentageOfMaxMarks,
                    studentsAboveX,
                    totalStudents,
                    coPercentage,
                    averages,
                    directAttainment,
                    directAttainmentTargetLevels,
                    indirectAttainment,
                    indirectAttainmentTargetLevels,
                    coAttainmentAverage,
                    finalAttainment,
                    copoMappingTable,
                    targetLevels,
                    poAverages,
                    batch: data.batch
                }
            });
            return excelFileBuffer;
        } catch (err) {
            console.error('Error adding data to worksheet:', err);
            new Promise((resolve, reject) => {
                resolve(null);
            })
        };
    }
    else {
        let poAverageObject = {}
        poAverageObject["Subject Name"] = data["Marks"][0]["Subject"]["Subject Name"]
        poAverageObject["Subject Code"] = data["Marks"][0]["Subject"]["Subject Code"]
        poAverageObject["PO Averages"] = poAverages
        return new Promise((resolve, reject) => {
            resolve(poAverageObject);
        })
    }
}

module.exports = calculateCOPO;