const fs = require('fs');
const readline = require('readline');

async function processTranscript() {
    const fileStream = fs.createReadStream('C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7e20230d-6b37-4018-8f6f-7a1233641d37\\.system_generated\\logs\\transcript_full.jsonl');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lastInstruksiHtml = null;
    let lastInstruksiJs = null;
    let lastEksplorasiHtml = null;
    let lastEksplorasiJs = null;

    let searchMode = null; 

    // We want to find contents from around step_index < 9500 (before the VN implementation started).
    for await (const line of rl) {
        try {
            const entry = JSON.parse(line);
            if (entry.step_index && entry.step_index > 9600) {
                // Break early if we've passed the point where I started doing the VN implementation (which was around step 9600 based on the time it happened).
                // Actually, let's not break early just in case, but prioritize saving the ones before my recent actions.
            }

            // check if it's a tool output of Get-Content or read_file or replace_file_content that contains the full file
            if (entry.type === "TOOL_RESPONSE") {
                const output = entry.content || "";
                if (output.includes('instruksi-toko.html')) {
                    // Check if it's a full read output
                    if (output.includes('<!DOCTYPE html>')) {
                        lastInstruksiHtml = output;
                    }
                }
                if (output.includes('eksplorasi.html') && output.includes('<!DOCTYPE html>')) {
                    lastEksplorasiHtml = output;
                }
                if (output.includes('instruksi-toko.js') && output.includes('document.addEventListener')) {
                    lastInstruksiJs = output;
                }
                if (output.includes('eksplorasi.js') && output.includes('drawRandomStory')) {
                    lastEksplorasiJs = output;
                }
            }
        } catch (e) {
            // ignore JSON parse error
        }
    }

    // Output findings
    console.log("lastInstruksiHtml size:", lastInstruksiHtml ? lastInstruksiHtml.length : 0);
    console.log("lastEksplorasiHtml size:", lastEksplorasiHtml ? lastEksplorasiHtml.length : 0);
    console.log("lastInstruksiJs size:", lastInstruksiJs ? lastInstruksiJs.length : 0);
    console.log("lastEksplorasiJs size:", lastEksplorasiJs ? lastEksplorasiJs.length : 0);

    // Save them to temp files to inspect
    if (lastInstruksiHtml) fs.writeFileSync('d:/New folder (3)/temp_instruksi.html', lastInstruksiHtml);
    if (lastEksplorasiHtml) fs.writeFileSync('d:/New folder (3)/temp_eksplorasi.html', lastEksplorasiHtml);
}

processTranscript();
