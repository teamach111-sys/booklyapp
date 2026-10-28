const fs = require('fs');
const path = require('path');

const inv = fs.readFileSync('C:/Users/Workspace/staffly-frontend/inventory.md').toString();
const parts = inv.split('### Screen:');
const allFilesTxt = fs.readFileSync('C:/Users/Workspace/playground/reactnative/booklyapp/all_files.txt').toString();
const booklyFiles = allFilesTxt.split(/\r?\n/).filter(function(f){ return f.trim(); });

function getInventoryForScreen(name) {
  for (let i=1; i<parts.length; i++) {
    var p = parts[i];
    if (p.trimStart().indexOf(name) === 0 || p.indexOf(name) !== -1 && p.split('\n')[0].trim() === name) {
      var nextIdx = p.indexOf('\n### Screen:');
      if (nextIdx === -1) return '### Screen:' + p;
      return '### Screen:' + p.substring(0, nextIdx);
    }
  }
  // fallback by exact start
  for (let i=1; i<parts.length; i++) {
    var p = parts[i];
    if (p.split('\n')[0].trim() === name) {
      var nextIdx = p.indexOf('\n### Screen:');
      if (nextIdx === -1) return '### Screen:' + p;
      return '### Screen:' + p.substring(0, nextIdx);
    }
  }
  return null;
}

function makeCommentBlock(invText) {
  var lines = invText.split(/\r?\n/);
  var out = '/*\n';
  for (var j=0; j<lines.length; j++) {
    out += lines[j] + '\n';
  }
  out += '*/\n\n';
  return out;
}

function findMatchingFile(screenName) {
  var nameLower = screenName.toLowerCase();
  if (nameLower.indexOf('admin portal : shell') !== -1 || nameLower.indexOf('admin dashboard') !== -1) {
    return null;
  }
  var tokens = screenName.split(':');
  var shortName = tokens[tokens.length-1].trim();
  var shortLower = shortName.toLowerCase().replace(/[^a-z0-9]/g,'');
  for (var k=0; k<booklyFiles.length; k++) {
    var f = booklyFiles[k];
    var basename = path.basename(f).replace('.jsx','').replace('.js','');
    var baseLower = basename.toLowerCase().replace(/[^a-z0-9]/g,'');
    if (basename === 'AdminDashboard') continue;
    if (baseLower === shortLower) return f;
    if (shortLower.indexOf(baseLower) !== -1 && baseLower.length > 4) return f;
    if (baseLower.indexOf(shortLower) !== -1 && shortLower.length > 4) return f;
  }
  return null;
}

var applied = 0;
for (var i=1; i<parts.length; i++) {
  var p = parts[i];
  var sname = p.split('\n')[0].trim();
  if (sname.toLowerCase().indexOf('admin portal : shell') !== -1) continue;
  if (sname.indexOf('AdminDashboard') !== -1) continue;
  var invText = getInventoryForScreen(sname);
  if (!invText) continue;
  var match = findMatchingFile(sname);
  if (!match) {
    console.log('NO MATCH:', sname);
    continue;
  }
  try {
    var content = fs.readFileSync(match).toString();
    if (content.indexOf(invText.substring(0, 30)) !== -1) {
      console.log('SKIP:', path.basename(match));
      continue;
    }
    var cb = makeCommentBlock(invText);
    content = cb + content;
    fs.writeFileSync(match, content);
    console.log('APPLIED:', path.basename(match));
    applied++;
  } catch(e) {
    console.log('ERR:', match, e.message);
  }
}
console.log('DONE', applied);
EOF
node apply_inventory2.js 2>&1 | Out-Host | tail -50