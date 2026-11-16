"""Re-crops headshots so every face sits in the same spot on the Brothers and Executive Board cards.

Optional helper for whoever maintains the site. New headshots work without it (the site then
crops them from the top), but running it keeps the cards consistent.

    pip install "opencv-python-headless<5" pillow
    python3 scripts/center-headshots.py src/assets/images/brothers/new-person.jpg

With no file names it processes every headshot. Each file is overwritten with a 4:5 crop
where the face is centered left to right and sits a little above the middle.
Files where no face is found, and files that are already 4:5, are left alone.
"""
import glob
import sys

import cv2
import numpy as np
from PIL import Image, ImageOps

FACE_SHARE = 0.30  # face height as a share of the crop height
FACE_Y = 0.40      # where the center of the face sits, from the top of the crop
RATIO = 0.8        # 4:5, the card shape
MIN_WIDTH = 320    # never crop narrower than this, so cards stay sharp

cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')


def find_face(gray: Image.Image):
    """Returns the most confident face (x, y, size) in the upper part of the photo, or None."""
    w, h = gray.size
    scale = 800 / max(w, h)
    small = np.array(gray.resize((int(w * scale), int(h * scale))))
    for step, neighbors in ((1.05, 5), (1.1, 6)):
        boxes, _, weights = cascade.detectMultiScale3(
            small, step, neighbors, minSize=(30, 30), outputRejectLevels=True
        )
        candidates = [
            (float(wt), [int(v / scale) for v in box])
            for box, wt in zip(boxes, np.array(weights).ravel())
            if (box[1] + box[3] / 2) / scale < 0.55 * h  # faces sit in the top half of a headshot
        ]
        if candidates:
            return max(candidates)[1]
    return None


def crop_box(face, w, h):
    x, y, fw, fh = face
    crop_h = fh / FACE_SHARE
    crop_h = max(crop_h, min(w, MIN_WIDTH) / RATIO)
    crop_h = min(crop_h, h, w / RATIO)
    crop_w = crop_h * RATIO
    left = min(max(x + fw / 2 - crop_w / 2, 0), w - crop_w)
    top = min(max(y + fh / 2 - crop_h * FACE_Y, 0), h - crop_h)
    return round(left), round(top), round(left + crop_w), round(top + crop_h)


def main(paths):
    if not paths:
        paths = sorted(glob.glob('src/assets/images/brothers/*.jpg') + glob.glob('src/assets/images/executive-board/*.jpg'))
    for path in paths:
        image = ImageOps.exif_transpose(Image.open(path)).convert('RGB')
        if abs(image.width / image.height - RATIO) < 0.01:
            print(f'skipped (already a 4:5 crop): {path}')
            continue
        face = find_face(image.convert('L'))
        if face is None:
            print(f'skipped (no face found): {path}')
            continue
        image.crop(crop_box(face, *image.size)).save(path, quality=92, optimize=True, progressive=True)
        print(f'centered: {path}')


if __name__ == '__main__':
    main(sys.argv[1:])
