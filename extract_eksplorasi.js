const fs = require('fs');
const readline = require('readline');

async function extractEksplorasiHistory() {
    const fileStream = fs.createReadStream('C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7e20230d-6b37-4018-8f6f-7a1233641d37\\.system_generated\\logs\\transcript_full.jsonl');
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    
    let htmlVersions = [];
    
    for await (const line of rl) {
        try {
            const entry = JSON.parse(line);
            const content = JSON.stringify(entry);
            
            // Check for file content matching eksplorasi.html
            if (content.includes('eksplorasi.html')) {
                // If it's a tool output
                if (entry.type === "TOOL_RESPONSE" && entry.content && entry.content.includes('<style>')) {
                    htmlVersions.push(entry.content);
                }
            }
        } catch (e) {}
    }
    
    if (htmlVersions.length > 0) {
        // Just save the first one found, assuming it's the oldest in this session
        fs.writeFileSync('d:/New folder (3)/old_eksplorasi_html.txt', htmlVersions[0]);
        console.log("Found an old eksplorasi.html version. Length:", htmlVersions[0].length);
    } else {
        console.log("No old eksplorasi.html versions found.");
    }
}
extractEksplorasiHistory();
