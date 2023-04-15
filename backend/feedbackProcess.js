const xlsx = require('xlsx');

// Load the workbook
function getIndirectAttainmentValues(fileName) {
  const workbook = xlsx.readFile("./public/" + fileName);

  // Get the sheet containing the responses
  // const worksheet = workbook.Sheets['Form Responses 1'];
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  // Define the ratings mapping
  const rateLookup = {
    "Excellent": 5,
    "Very Good": 4,
    "Good": 3,
    "Satisfactory": 2,
    "Poor": 1
  };

  // Define the question to CO mapping
  const questionToCoMapping = {
    "Q1": "CO1",
    "Q2": "CO2",
    "Q3": "CO3",
    "Q4": "CO4",
    "Q5": "CO5"
  };

  // Get the range of cells containing data
  const range = worksheet['!ref'];
  // Extract the last row number from the range
  const lastRow = parseInt(range.split(':')[1].substring(1));

  // Define the indirect attainment object
  let indirectAttainment = {
    "CO1": 0,
    "CO2": 0,
    "CO3": 0,
    "CO4": 0,
    "CO5": 0
  };

  // Iterate over the rows of the worksheet
  for (let i = 2; i <= lastRow; i++) {
    // Get the USN, Name, question number, and ratings from the row
    const usn = worksheet[`B${i}`].v;
    const name = worksheet[`C${i}`].v;
    const studentFeedbacks = [
      worksheet[`D${i}`].v,
      worksheet[`E${i}`].v,
      worksheet[`F${i}`].v,
      worksheet[`G${i}`].v,
      worksheet[`H${i}`].v,
    ];
    // Iterate over the questions and calculate the indirect attainment for each CO based on the ratings
    for (const questionNumber in questionToCoMapping) {
      const coNumber = questionToCoMapping[questionNumber];
      const ratingIndex = parseInt(questionNumber.substring(1)) - 1;
      const rating = studentFeedbacks[ratingIndex];

      // console.log(coNumber, rating, rateLookup, rateLookup[rating]);
      if (coNumber && rating && rateLookup[rating]) {
        indirectAttainment[coNumber] += rateLookup[rating];
      }
    }
  }

  // Calculate the final indirect attainment for each CO
  for (const coNumber in indirectAttainment) {
    indirectAttainment[coNumber] = Math.round(indirectAttainment[coNumber] / (lastRow * 5) * 100);
  }

  // Print the indirect attainment object
  return indirectAttainment;
}

module.exports = getIndirectAttainmentValues;

