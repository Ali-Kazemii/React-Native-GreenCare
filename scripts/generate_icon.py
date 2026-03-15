from PIL import Image, ImageDraw
import math
import os

BASE = "C:/Users/kaz/GreenCare/android/app/src/main/res"

SIZES = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

FG_SIZES = {
    "mipmap-mdpi": 108,
    "mipmap-hdpi": 162,
    "mipmap-xhdpi": 216,
    "mipmap-xxhdpi": 324,
    "mipmap-xxxhdpi": 432,
}

GREEN_DARK = (27, 94, 60)
GREEN_MID = (45, 140, 90)
GREEN_LIGHT = (120, 200, 150)
WHITE = (255, 255, 255)


def draw_flower_icon(draw, cx, cy, size):
    """Draw a stylized flower with petals and a shopping bag hint"""
    s = size * 0.28

    # Draw 5 petals in a circle
    petal_colors = [
        (255, 255, 255, 220),
        (230, 255, 240, 220),
        (255, 255, 255, 220),
        (230, 255, 240, 220),
        (255, 255, 255, 220),
    ]
    for i in range(5):
        angle = (i / 5) * 2 * math.pi - math.pi / 2
        px = cx + s * 0.45 * math.cos(angle)
        py = cy + s * 0.45 * math.sin(angle) - s * 0.1

        petal_r = s * 0.38
        draw.ellipse(
            [px - petal_r, py - petal_r, px + petal_r, py + petal_r],
            fill=petal_colors[i],
        )

    # Center of flower
    center_r = s * 0.22
    draw.ellipse(
        [cx - center_r, cy - center_r - s * 0.1, cx + center_r, cy + center_r - s * 0.1],
        fill=(255, 210, 70),
    )

    # Stem
    stem_width = max(2, int(s * 0.08))
    draw.line(
        [(cx, cy + s * 0.3), (cx, cy + s * 0.9)],
        fill=GREEN_LIGHT,
        width=stem_width,
    )

    # Two small leaves on stem
    leaf_s = s * 0.18
    # Left leaf
    leaf_pts = []
    for j in range(30):
        a = (j / 30) * 2 * math.pi
        lx = leaf_s * 0.7 * math.cos(a)
        ly = leaf_s * math.sin(a)
        rot = math.pi / 4
        rx = lx * math.cos(rot) - ly * math.sin(rot)
        ry = lx * math.sin(rot) + ly * math.cos(rot)
        leaf_pts.append((cx - s * 0.12 + rx, cy + s * 0.55 + ry))
    draw.polygon(leaf_pts, fill=GREEN_LIGHT)

    # Right leaf
    leaf_pts = []
    for j in range(30):
        a = (j / 30) * 2 * math.pi
        lx = leaf_s * 0.7 * math.cos(a)
        ly = leaf_s * math.sin(a)
        rot = -math.pi / 4
        rx = lx * math.cos(rot) - ly * math.sin(rot)
        ry = lx * math.sin(rot) + ly * math.cos(rot)
        leaf_pts.append((cx + s * 0.12 + rx, cy + s * 0.7 + ry))
    draw.polygon(leaf_pts, fill=GREEN_LIGHT)


def create_background(size):
    img = Image.new("RGB", (size, size), GREEN_DARK)
    draw = ImageDraw.Draw(img)
    # Radial gradient effect
    max_r = size // 2
    for r in range(max_r, 0, -1):
        t = 1 - (r / max_r)
        color = (
            int(GREEN_DARK[0] + (GREEN_MID[0] - GREEN_DARK[0]) * t * 0.6),
            int(GREEN_DARK[1] + (GREEN_MID[1] - GREEN_DARK[1]) * t * 0.6),
            int(GREEN_DARK[2] + (GREEN_MID[2] - GREEN_DARK[2]) * t * 0.6),
        )
        draw.ellipse(
            [size // 2 - r, size // 2 - r, size // 2 + r, size // 2 + r],
            fill=color,
        )
    return img


def create_foreground(size):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw_flower_icon(draw, size // 2, size // 2, size)
    return img


def create_launcher(size):
    bg = create_background(size)
    fg = create_foreground(size)
    bg.paste(fg, (0, 0), fg)
    return bg


for folder, size in SIZES.items():
    path = os.path.join(BASE, folder)
    icon = create_launcher(size)
    icon.save(os.path.join(path, "ic_launcher.png"))
    icon.save(os.path.join(path, "ic_launcher_round.png"))
    print(f"Created {folder}/ic_launcher.png ({size}x{size})")

for folder, size in FG_SIZES.items():
    path = os.path.join(BASE, folder)
    bg = create_background(size)
    bg.save(os.path.join(path, "ic_launcher_background.png"))
    fg = create_foreground(size)
    fg.save(os.path.join(path, "ic_launcher_foreground.png"))
    mono = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(mono)
    draw_flower_icon(draw, size // 2, size // 2, size)
    mono.save(os.path.join(path, "ic_launcher_monochrome.png"))
    print(f"Created {folder} adaptive icon layers ({size}x{size})")

print("Done!")
