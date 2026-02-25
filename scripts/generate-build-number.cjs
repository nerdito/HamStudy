const fs = require('fs');
const path = require('path');

const BUILD_FILE = path.join(__dirname, '..', 'build-number.json');

function getBuildNumber() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const dateStr = `${yy}.${mm}.${dd}`;

  let buildData = { date: '', number: 0 };

  if (fs.existsSync(BUILD_FILE)) {
    try {
      buildData = JSON.parse(fs.readFileSync(BUILD_FILE, 'utf8'));
    } catch (e) {
      buildData = { date: '', number: 0 };
    }
  }

  let seq;
  if (buildData.date === dateStr) {
    seq = buildData.number + 1;
  } else {
    seq = 1;
  }

  const seqStr = String(seq).padStart(3, '0');
  const fullBuildNumber = `${dateStr}.${seqStr}`;

  fs.writeFileSync(BUILD_FILE, JSON.stringify({ date: dateStr, number: seq }, null, 2));

  console.log(`Build: ${fullBuildNumber}`);
  
  fs.writeFileSync(
    path.join(__dirname, '..', 'public', 'build-number.json'),
    JSON.stringify({ buildNumber: fullBuildNumber }, null, 2)
  );

  fs.writeFileSync(
    path.join(__dirname, '..', 'src', 'build-number.js'),
    `export const BUILD_NUMBER = '${fullBuildNumber}';\n`
  );
}

getBuildNumber();
