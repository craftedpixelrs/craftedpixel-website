import pathlib, shutil

root = pathlib.Path(__file__).parent

# Copy favicon.ico to root for /assets/img//favicon.ico requests
sc = root / 'assets' / 'img' / 'favicon.ico'
dst = root / 'favicon.ico'
if src.exists():
    shutil.copy2(src, dst)
    print(f'Copied favicon.ico to root')

# Update HTML: add .ico link before the SVG icon link
count = 0
OLD = '<link rel="icon" href="/assets/img/logo.svg" type="image/svg+xml" />'
NEW = '<link rel="icon" href="/assets/img//favicon.ico" sizes="48x48" />\n  <link rel="icon" href="/assets/img/logo.svg" type="image/svg+xml" />'

for f in sorted(root.glob('*.html')):
    text = f.read_text(encoding='utf-8')
    if OLD in text and 'favicon.ico' not in text:
        text = text.replace(OLD, NEW)
        f.write_text(text, encoding='utf-8')
        count += 1

print(f'Updated {count} HTML files with favicon.ico link')
