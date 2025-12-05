/**
 * Jest Setup File
 * Loads all modules into global scope for testing
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Helper to load a JS file and run it in the global context
function loadScript(filename) {
    const filepath = path.join(__dirname, '..', 'js', filename);
    const code = fs.readFileSync(filepath, 'utf8');
    const script = new vm.Script(code, { filename: filepath });
    script.runInThisContext();
}

// Mock crypto.getRandomValues for Node.js environment
if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
    const nodeCrypto = require('crypto');
    global.crypto = {
        getRandomValues: function(arr) {
            const bytes = nodeCrypto.randomBytes(arr.length * arr.BYTES_PER_ELEMENT);
            for (let i = 0; i < arr.length; i++) {
                if (arr.BYTES_PER_ELEMENT === 4) {
                    arr[i] = bytes.readUInt32LE(i * 4);
                } else if (arr.BYTES_PER_ELEMENT === 1) {
                    arr[i] = bytes[i];
                }
            }
            return arr;
        }
    };
}

// Load utils first (provides escapeHTML, downloadCSV, etc.)
loadScript('utils.js');

// Load csv-parser
loadScript('csv-parser.js');

// Load raffle-engine
loadScript('raffle-engine.js');

// Load animation controller
loadScript('animation.js');
