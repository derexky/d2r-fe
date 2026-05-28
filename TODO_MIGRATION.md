# IYA-Backup Migration — Remaining Work

## Completed this session (commits on `main`):
- WeaponSpeed.tsx — 290 weapons WSM table (ias/weapons)
- Breakpoints.tsx — FCR/FBR/FHR tables (breakpoints)
- AreaLevels.tsx — 5-act monster levels (area-levels)
- Formulas.tsx — damage/hit/block/DS/CB/OW formulas (formulas)
- AffixList.tsx — 196 字首 + 120 字尾，可搜尋/篩選 (magic/affixes)

## Remaining

### Magic Affixes — Extended (magic1.htm + magic2.htm + magic7.htm)
Data already extracted in the last conversation. Use this Python script to regenerate:

```python
import re

def is_category(text):
    return not re.search(r'[A-Za-z+\-0-9/]', text) and len(text) > 0

def parse_affixes3col(fname):
    raw = open(f'/Users/derekyang/iya-backup/htm/{fname}', 'rb').read()
    text = raw.decode('utf-8', errors='replace')
    rows = re.findall(r'<tr[^>]*>(.*?)</tr>', text, re.I|re.S)
    result = []
    current_func = ''
    for r in rows:
        cells = re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', r, re.I|re.S)
        cleaned = [re.sub(r'<[^>]+>','',c).strip().replace('\xa0','').replace('\n',' ').strip() for c in cells]
        cleaned = [re.sub(r'\s+',' ',c) for c in cleaned]
        non_empty = [c for c in cleaned if c]
        if not non_empty: continue
        if non_empty[0] in ('魔法字首','魔法字尾','功能','魔法名稱','屬性'): continue
        if len(non_empty) >= 3 and is_category(non_empty[0]):
            current_func = non_empty[0]
            result.append({'func': current_func, 'name': non_empty[1].strip(), 'stat': non_empty[2]})
        elif len(non_empty) >= 2:
            if len(non_empty) >= 3 and not is_category(non_empty[0]):
                result.append({'func': current_func, 'name': non_empty[0].strip(), 'stat': non_empty[1], 'items': non_empty[2]})
            else:
                result.append({'func': current_func, 'name': non_empty[0].strip(), 'stat': non_empty[1]})
    return result

prefixes = parse_affixes3col('magic3.htm')  # 196 prefixes
suffixes = parse_affixes3col('magic4.htm')  # 120 suffixes
```

**Stats:** 196 prefixes + 120 suffixes = 316 entries total

**Data structure per entry:**
```ts
{ type: 'prefix'|'suffix', func: string, name: string, stat: string, items?: string }
```
- `func`: category/effect type (e.g. '攻擊準確率', '力量')
- `name`: affix name with English (e.g. '青銅 Bronze')
- `stat`: modifier value (e.g. '+10-20 攻擊準確率')
- `items`: (optional) item types and ilvl e.g. '頭飾[4].武器[4].戒指[4]'

**To implement:**
- Create `src/pages/magic/AffixList.tsx`
- Searchable by name/stat, filterable by prefix/suffix and category
- Route: `magic/affixes`
- Nav: add under 裝備研究 or 遊戲機制

**Also consider:** magic1.htm + magic2.htm cover small/large/huge item affixes (5-col format)

## Remaining Source Files Worth Migrating

### superboss.htm — Super Unique Boss Stats
163KB, 161 tables. Complex table structure with:
- Name, Level, XP, HP, Diablo Clone trigger info
- Tricky table layout (each stat in separate sub-table)

### magic1.htm — Prefixes for Small/Large/Huge Items (e.g. charms)
- 105 rows, 5 columns: 功能 | 名稱 | 小型值/等級 | 大型值/等級 | 超大型值/等級
- Complex value format: `"1-8/(1)[1](4-8)[21]"` = tier1(1-5 at ilvl 1), tier2(4-8 at ilvl 21)

### magic2.htm — More Prefixes (simpler format like magic3)
- 68 rows, 3-column format identical to magic3

### magic7.htm — 魔法裝備/稀有字首字尾
- 103 rows, 3-column format

## Files to Skip
- super*.htm / dupe*.htm — screenshot galleries (images not in project)
- PAGE10-29 — old tool guides and exploits
- IYA*.htm / iyaword*.htm / people.htm — community pages
- sellitems.htm — old item trades
- download.htm — outdated links
- videomenu.htm — video menu

## Project Notes
- d2r-fe (React/Vite): /Users/derekyang/d2r-fe, port 5173
- d2r-service (NestJS): /Users/derekyang/d2r-service, port 3001
- SQLite DB: /Users/derekyang/d2r-service/d2r.sqlite
- CodeGraph indexed: both projects
- All routes under AppShell layout in src/App.tsx
- Nav items in src/components/layout/NavTree.tsx
