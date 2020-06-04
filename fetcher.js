const request = require('request');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const url = process.argv[2];
const path = process.argv[3];


request(url, (error, response, body) => {
  // if URL error, exits
  if (response > 299 || response < 200 || response === undefined) {
    console.log(`URL resulted in an error. Please enter a valid URL`);
    process.exit();

  } else {
    // checks if valid directory
    fs.realpath(path, (error) => {

      if (error) {
        console.log(`Invalid directory, try again.`);
        process.exit();
      } else {
        
        // checks if file exists
        fs.access(path, fs.F_OK, (err) => {

          // if file doesn't exist, writes file
          if (err) {
            //writes file
            fs.writeFile(path, body, (err) => {
              const stats = fs.statSync(path);
              const bytesSize = stats["size"];
              console.log(`Downloaded and saved ${bytesSize} bytes to ${path}`);
            });
            // if file exists, asks to overwrite
          } else if (!err) {
            rl.question(`File already exists. If you would like to overwrite file, press 'y', otherwise press 'n', followed by <enter>`, (response) => {
              if (response === 'n') {
                process.exit();
              } else if (response === 'y') {

                // writes file
                fs.writeFile(path, body, (err) => {

                  const stats = fs.statSync(path);
                  const bytesSize = stats["size"];
                  console.log(`Downloaded and saved ${bytesSize} bytes to ${path}`);
                });
              }
            })
          } 
        })
      }
    })
  }
});