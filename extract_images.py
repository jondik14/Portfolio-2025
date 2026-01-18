import re
import os

def extract_images(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract all image sources
    # Look for both absolute and relative paths
    images = re.findall(r'src="([^"]*)"', content)
    # Filter for images in framerusercontent
    framer_images = [img for img in images if 'framerusercontent.com/images' in img]
    # Remove duplicates and scale parameters
    unique_images = []
    seen = set()
    for img in framer_images:
        base = img.split('?')[0]
        if base not in seen:
            unique_images.append(base)
            seen.add(base)
    
    return unique_images

def generate_html(images):
    html = '<div class="image-grid">\n'
    for img in images:
        # Convert to relative path if it's absolute
        if img.startswith('https://framerusercontent.com/images/'):
            img = '../../framerusercontent.com/images/' + img.split('/')[-1]
        html += f'    <div class="image-item"><img src="{img}" alt="Case Study Image"></div>\n'
    html += '</div>'
    return html

# Process files
files = {
    'drova': 'work/drovasignup/index-old.html',
    'foragecaster': 'work/foragecaster/index-old.html',
    'rpp': 'work/rpp/index-old.html',
    'share': 'lukeniccol.framer.website/work/shareecoomy.html'
}

for name, path in files.items():
    if os.path.exists(path):
        imgs = extract_images(path)
        print(f"\n--- {name} images ({len(imgs)}) ---")
        for img in imgs:
            print(img)
    else:
        print(f"File not found: {path}")
