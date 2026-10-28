const fs = require('fs');
const inv = fs.readFileSync('C:/Users/Workspace/staffly-frontend/inventory.md').toString();
const parts = inv.split('### Screen:');
const results = [];
for (let i=1; i<parts.length; i++) {
  const p = parts[i];
  const name = p.split('\n')[0].trim();
  const routeMatch = p.match(/\*\*Associated Route\/Context\*\*:([^\n]+)/);
  const fileLink = p.match(/\*\*Component Source File[^\]]+\]\(([^\)]+)\)/);
  const absMatch = p.match(/C:\\\\Users\\\\Workspace\\\\staffly-frontend[^\s\)]+\.jsx|C:\\\\Users\\\\Workspace\\\\staffly-frontend[^\s\)]+\.js/);
  const absMatch2 = p.match(/C:\\Users\\Workspace\\staffly-frontend[^\s\)]+\.jsx|C:\\Users\\Workspace\\staffly-frontend[^\s\)]+\.js/);
  results.push({name, route: routeMatch?.[1]?.trim(), fileLink: fileLink?.[1], abs: absMatch2?.[0]});
}
fs.writeFileSync('C:/Users/Workspace/playground/reactnative/booklyapp/inv_map.json', JSON.stringify(results, null, 2));
console.log('done', results.length);
