const fs = require('fs');
const path = require('path');

const inv = fs.readFileSync('C:/Users/Workspace/staffly-frontend/inventory.md').toString();
const parts = inv.split('### Screen:');

// Read all booklyapp files
const allFilesTxt = fs.readFileSync('C:/Users/Workspace/playground/reactnative/booklyapp/all_files.txt').toString();
const booklyFiles = allFilesTxt.split(/\r?\n/).filter(f => f.trim());

function getInventoryForScreen(name) {
  // Find the part that starts with this name
  for (let i=1; i<parts.length; i++) {
    const p = parts[i];
    if (p.trimStart().startsWith(name)) {
      // Extract until next "### Screen:" at start of line
      // Look for "\n### Screen:" 
      const nextIdx = p.indexOf('\n### Screen:');
      if (nextIdx === -1) {
        return '### Screen:' + p;
      } else {
        return '### Screen:' + p.substring(0, nextIdx);
      }
    }
  }
  return null;
}

function makeCommentBlock(invText) {
  // For JS/JSX files, use /* ... */ or // style - inventory is multi-line markdown, better /* */
  const lines = invText.split(/\r?\n/);
  let out = '/*\n';
  for (let l of lines) {
    out += l + '\n';
  }
  out += '*/\n\n';
  return out;
}

function findMatchingFile(screenName) {
  const name = screenName.toLowerCase();
  // Skip admin dashboard as requested
  if (name.includes('admin portal : shell') || name.includes('admin dashboard')) {
    return null;
  }
  // Try to extract the component name
  // Look for patterns like "AddClientModal", "AdminClients" etc
  const tokens = screenName.split(':');
  const shortName = tokens[tokens.length-1].trim();
  // Also try route-based matching
  const routeMatch = screenName.match(/\(([^)]+)\)/);
  
  // Search for files with similar name
  for (let f of booklyFiles) {
    const basename = path.basename(f).replace('.jsx','').replace('.js','');
    const baseLower = basename.toLowerCase();
    const shortLower = shortName.toLowerCase().replace(/[^a-z0-9]/g,'');
    
    // Direct name match
    if (baseLower === shortLower) {
      return f;
    }
    // Partial match for common patterns
    if (shortLower.includes(baseLower) && baseLower.length > 3) {
      return f;
    }
    if (baseLower.includes(shortLower) && shortLower.length > 3) {
      // Avoid matching admin dashboard
      if (basename === 'AdminDashboard') continue;
      return f;
    }
  }
  return null;
}

// Get all screen entries
const screens = [];
for (let i=1; i<parts.length; i++) {
  const p = parts[i];
  const name = p.split('\n')[0].trim();
  if (name.includes('Admin Portal : Shell') || name.includes('Admin Portal : AdminDashboard') || name === 'AdminDashboard') {
    continue; // skip admin dashboard
  }
  screens.push(name);
}

console.log('Screens to process (after skip):', screens.length);

let applied = 0;
let created = 0;
for (let s of screens) {
  const invText = getInventoryForScreen(s);
  if (!invText) continue;
  const match = findMatchingFile(s);
  if (!match) {
    console.log('NO MATCH for:', s);
    continue;
  }
  try {
    let content = fs.readFileSync(match).toString();
    // Check if inventory already present
    if (content.includes('### Screen:') && content.includes(invText.substring(0, 40))) {
      console.log('SKIP (exists):', path.basename(match));
      continue;
    }
    const commentBlock = makeCommentBlock(invText);
    // Add to top
    content = commentBlock + content;
    fs.writeFileSync(match, content);
    console.log('APPLIED:', path.basename(match), '<-', s);
    applied++;
  } catch (e) {
    console.log('ERR:', match, e.message);
  }
}
console.log('Done. Applied:', applied);
EOF
node C:\Users\Workspace\playground\reactnative\booklyapp\apply_inventory.js 2>&1 | Out-Host