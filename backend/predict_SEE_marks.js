const fs = require('fs');
const csv = require('csvtojson');
const ss = require('simple-statistics');


// Load the CSV file
let predict = async (internal_marks) => {
  const dataset = [];
  let marks = await csv().fromFile('data.csv');
  // Only include rows where Internal_Marks <= 40 and External_Marks <= 60
  marks.forEach(data => {
    if (data.Internal_Marks <= 40 && data.External_Marks <= 60) {
      let internal_marks = !isNaN(Number(data.Internal_Marks)) ? data.Internal_Marks : 0.0;
      let external_marks = !isNaN(Number(data.External_Marks)) ? data.External_Marks : 0.0;
      dataset.push([parseFloat(internal_marks), parseFloat(external_marks)]);
    }
  })
  // Split the dataset into training and testing sets
  const splitIndex = Math.floor(dataset.length * 0.8);
  const trainingData = dataset.slice(0, splitIndex);
  const testingData = dataset.slice(splitIndex);

  // Train the model
  const regression = ss.linearRegression(trainingData);

  // Test the model
  const predictedValues = testingData.map((row) => ss.linearRegressionLine(regression, row[0]));
  let output = predictedValues[0](internal_marks);
  return output;
}

module.exports = predict;