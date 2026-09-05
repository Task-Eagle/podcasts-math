const fs = require('fs');
const path = require('path');

const audioDir = path.join(__dirname, 'audio');
const outputFile = path.join(__dirname, 'podcasts.json');

// Ensure /audio/ directory exists
if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir);
}

// Read all files inside /audio
const files = fs.readdirSync(audioDir);

// Filter for supported audio formats
const audioFiles = files.filter(file => /\.(mp3|wav|m4a|ogg)$/i.test(file));

const podcasts = audioFiles.map((file, index) => {
    const baseName = path.parse(file).name;
    const mdPath = path.join(audioDir, `${baseName}.md`);
    const txtPath = path.join(audioDir, `${baseName}.txt`);

    let description = '';
    let transcript = '';

    // Read matching .md file if it exists
    if (fs.existsSync(mdPath)) {
        description = fs.readFileSync(mdPath, 'utf8');
    }

    // Read matching .txt file if it exists
    if (fs.existsSync(txtPath)) {
        transcript = fs.readFileSync(txtPath, 'utf8');
    }

    // Clean up filename to create a readable default title
    const formattedTitle = baseName
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());

    return {
        id: String(index + 1),
        title: formattedTitle,
        category: 'general',
        date: new Date().toISOString().split('T')[0],
        duration: '--:--',
        author: 'Lecturer',
        file: `audio/${file}`,
        type: 'audio',
        description: description || 'No description provided.',
        transcript: transcript || 'No transcript provided.'
    };
});

fs.writeFileSync(outputFile, JSON.stringify(podcasts, null, 2));
console.log(`Successfully generated podcasts.json with ${podcasts.length} lecture(s).`);