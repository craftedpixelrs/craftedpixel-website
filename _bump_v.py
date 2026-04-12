import pathlib
root = pathlib.Path(__file__).parent
count = 0
for f in sorted(root.glob('*.html')):
    text = f.read_text(encoding='utf-8')
    new = text.replace('?v=2"', '?v=3"')
    if new != text:
        f.write_text(new, encoding='utf-8')
        count += 1
print(f'Bumped to v=3 in {count} files.')
