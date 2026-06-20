const fs = require('fs');

let lines = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8').split('\\n');

// pop the last empty lines
while(lines[lines.length - 1].trim() === '') {
    lines.pop();
}

// pop the last line
console.log("Removing line:", lines.pop());

fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', lines.join('\\n'));
console.log("Done");
