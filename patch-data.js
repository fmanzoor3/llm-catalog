// Patch data.js to ensure useCaseSets is present
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data.js');
let content = fs.readFileSync(filePath, 'utf8');

// Parse the modelData object
const fn = new Function(content + '; return modelData;');
const modelData = fn();

// Ensure useCaseSets is set
modelData.useCaseSets = {
    default: {
        label: "Use Cases",
        useCases: ["coding", "reasoning", "chatbot", "documents", "content", "extraction", "translation", "vision"]
    }
};

// Write back
const output = 'const modelData = ' + JSON.stringify(modelData) + ';';
fs.writeFileSync(filePath, output, 'utf8');
console.log('Patched data.js successfully!');
console.log('Scoring configs:', Object.keys(modelData.scoringConfig).length);
console.log('Use case sets:', JSON.stringify(modelData.useCaseSets));
