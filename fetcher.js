// Use the request Library and fs Library
const readline = require('readline');
const request = require('request');
const fs = require('fs');


// command line arguments
const args = process.argv.slice(2);
const url = args[0];

// file info
const fileLocation = args[1];
//console.log(fileLocation);
//let fileName = "";
let directory = "";
let index;
let i = fileLocation.length;

do {
  i -= 1;
  index = i;
} while (fileLocation[i] !== "/");

//fileName = fileLocation.substring(index + 1);

// get the directory and make sure it exists
directory = fileLocation.substring(0, index);

// check if the local directory exists
try {
  if (!fs.existsSync(directory)) {
    console.log("Directory does not exist.");
    return;
  }
} catch (e) {
  console.log("An error occurred.");
}

// readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// request info from the server
request(url, (error, response, body) => {
  if (error) {
    if (error.code === "ENOTFOUND") {
    //console.log('error:', error);
    //console.log('statuscode:', response && response.statusCode);
      console.log("You're URL returned not found. Please try a different URL");
      rl.close();
      return;
    }
  }
  

  fs.access(fileLocation, fs.F_OK, (error) => {
    //console.log(error);

    const question = () => {
      rl.question(`${fileLocation} already exists do you want to overwrite? Y (yes) or N (no): `, (answer) => {
        
        if (answer !== "Y" && answer !== "y" && answer !== "n" && answer !== "N") {
          console.log('Please answer with "y", "Y", "n" or "N".\n');
          question();
        }

        if (answer === "N" || answer === "n") {
          rl.close();
          return;
        }

        if (answer === "Y" || answer === "y") {
          rl.close();
          writeToFile(fileLocation, body);
        }
      });
    };
    // if file doesn't exist
    if (!error) {
      question();
    } else if (error.code === "ENOENT") {
      writeToFile(fileLocation, body);
      rl.close();
    }
    
  });
});

const writeToFile = (fileLocation, body) => {
  fs.writeFile(fileLocation, body, error => {
    if (error) {
      console.error(error);
    }
    console.log(`Downloaded and saved ${body.length} bytes to ${fileLocation}`);
  });
};