import os

# Read inventory
with open('C:/Users/Workspace/staffly-frontend/inventory.md', encoding='utf-8') as f:
    inv = f.read()

parts = inv.split('### Screen:')

# Read all files with utf-8-sig
try:
    with open('C:/Users/Workspace/playground/reactnative/booklyapp/all_files.txt', encoding='utf-8-sig') as f:
        bookly_files = [x.strip() for x in f if x.strip()]
except:
    with open('C:/Users/Workspace/playground/reactnative/booklyapp/all_files.txt', encoding='latin-1') as f:
        bookly_files = [x.strip() for x in f if x.strip()]

def get_inventory_for_screen(name):
    for i in range(1, len(parts)):
        p = parts[i]
        first_line = p.split('\n')[0].strip()
        if first_line == name:
            idx = p.find('\n### Screen:')
            if idx == -1:
                return '### Screen:' + p
            else:
                return '### Screen:' + p[:idx]
    return None

def make_comment_block(inv_text):
    lines = inv_text.split('\n')
    out = '/*\n'
    for l in lines:
        out += l + '\n'
    out += '*/\n\n'
    return out

def find_matching_file(screen_name):
    name_lower = screen_name.lower()
    if 'admin portal : shell' in name_lower or 'admin dashboard' in name_lower:
        return None
    tokens = screen_name.split(':')
    short_name = tokens[-1].strip()
    short_lower = ''.join(c for c in short_name.lower() if c.isalnum())
    for f in bookly_files:
        basename = os.path.basename(f)
        base_clean = basename.replace('.jsx','').replace('.js','')
        base_lower = ''.join(c for c in base_clean.lower() if c.isalnum())
        if base_clean == 'AdminDashboard':
            continue
        if base_lower == short_lower:
            return f
        if len(base_lower) > 4 and base_lower in short_lower:
            return f
        if len(short_lower) > 4 and short_lower in base_lower:
            return f
    return None

applied = 0
no_match = []
for i in range(1, len(parts)):
    p = parts[i]
    sname = p.split('\n')[0].strip()
    sl = sname.lower()
    if 'admin portal : shell' in sl or sname == 'AdminDashboard':
        continue
    inv_text = get_inventory_for_screen(sname)
    if not inv_text:
        continue
    match = find_matching_file(sname)
    if not match:
        no_match.append(sname)
        continue
    try:
        with open(match, 'r', encoding='utf-8') as f:
            content = f.read()
        if inv_text[:30] in content:
            print('SKIP:', os.path.basename(match))
            continue
        cb = make_comment_block(inv_text)
        content = cb + content
        with open(match, 'w', encoding='utf-8') as f:
            f.write(content)
        print('APPLIED:', os.path.basename(match), '<-', sname)
        applied += 1
    except Exception as e:
        print('ERR:', match, e)

print('DONE', applied)
print('NO_MATCH:', len(no_match))
for nm in no_match[:30]:
    print('  ', nm)
