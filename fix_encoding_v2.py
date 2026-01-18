import os

def fix_file(filepath):
    with open(filepath, 'rb') as f:
        content = f.read()
    
    # Common mojibake patterns
    replacements = [
        (b'\xc3\xa2\xe2\x82\xac\xe2\x80\x9c', b'-'),
        (b'\xe2\x80\x93', b'-'),
        (b'\xe2\x80\x94', b'-'),
        (b'\xc3\xa2\xe2\x82\xac\xe2\x84\xa2', b"'"),
        (b'\xc3\xaf\xc2\xb8\xc2\x8f', b''), # emoji variant selector
        (b'\xc2\xa0', b' '), # non-breaking space
        (b'\xc3\xa2\xe2\x80\xa0\xe2\x80\x99', b'&rarr;'),
    ]
    
    for old, new in replacements:
        content = content.replace(old, new)
    
    # Also handle the specific pattern from the log: \xc2\xa0\xc3\xaf\xc2\xb8\xc2\x8f
    content = content.replace(b'\xc2\xa0\xc3\xaf\xc2\xb8\xc2\x8f', b'')
    
    with open(filepath, 'wb') as f:
        f.write(content)

fix_file('index.html')
fix_file('work/rpp/index.html')
print("Fixed encoding issues.")
