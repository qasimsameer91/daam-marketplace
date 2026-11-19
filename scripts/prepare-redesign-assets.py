"""Optimize the supplied decorative references. Originals stay in the reference pack."""
from pathlib import Path
from PIL import Image

source = Path('design-references/daam/ASSETS')
destination = Path('public/editorial')
destination.mkdir(parents=True, exist_ok=True)
for file in source.glob('*.png'):
    image = Image.open(file)
    image.thumbnail((1600, 1000))
    target = destination / (file.stem + '.webp')
    image.save(target, 'WEBP', quality=86, method=6)
    print(f'{target}: {target.stat().st_size} bytes')
