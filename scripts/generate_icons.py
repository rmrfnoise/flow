"""Generate the flow PWA icons with Pillow."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "icons"
OUT.mkdir(parents=True, exist_ok=True)

SIZE = 1024
BG = (5, 8, 6, 255)
GREEN = (124, 255, 155, 255)
GREEN_DIM = (56, 111, 76, 255)
MAGENTA = (255, 79, 216, 255)


def background() -> Image.Image:
    image = Image.new("RGBA", (SIZE, SIZE), BG)
    draw = ImageDraw.Draw(image)

    # Low-contrast terminal grid.
    for position in range(0, SIZE, 64):
        draw.line(
            [(position, 0), (position, SIZE)],
            fill=(94, 180, 132, 11),
            width=1,
        )
        draw.line(
            [(0, position), (SIZE, position)],
            fill=(94, 180, 132, 11),
            width=1,
        )

    # Scanlines.
    for position in range(0, SIZE, 12):
        draw.line(
            [(0, position), (SIZE, position)],
            fill=(255, 255, 255, 7),
            width=1,
        )

    return image


def prompt_points(scale: float):
    origin_x = 512 - 260 * scale
    origin_y = 512 - 205 * scale
    chevron = [
        (origin_x + 10 * scale, origin_y + 20 * scale),
        (origin_x + 170 * scale, origin_y + 205 * scale),
        (origin_x + 10 * scale, origin_y + 390 * scale),
    ]
    underscore = [
        (origin_x + 235 * scale, origin_y + 390 * scale),
        (origin_x + 450 * scale, origin_y + 390 * scale),
    ]
    dot_center = (
        origin_x + 475 * scale,
        origin_y + 5 * scale,
    )
    dot_radius = 25 * scale
    return chevron, underscore, dot_center, dot_radius


def draw_prompt(
    image: Image.Image,
    scale: float,
    fill=GREEN,
    dot_fill=MAGENTA,
):
    draw = ImageDraw.Draw(image)
    chevron, underscore, dot_center, dot_radius = prompt_points(scale)
    stroke = max(3, round(68 * scale))

    draw.line(
        chevron,
        fill=fill,
        width=stroke,
        joint="curve",
    )
    for point in (chevron[0], chevron[-1]):
        radius = stroke / 2
        draw.ellipse(
            (
                point[0] - radius,
                point[1] - radius,
                point[0] + radius,
                point[1] + radius,
            ),
            fill=fill,
        )

    draw.line(
        underscore,
        fill=fill,
        width=max(3, round(56 * scale)),
    )
    for point in (underscore[0], underscore[-1]):
        radius = max(3, round(56 * scale)) / 2
        draw.ellipse(
            (
                point[0] - radius,
                point[1] - radius,
                point[0] + radius,
                point[1] + radius,
            ),
            fill=fill,
        )

    draw.ellipse(
        (
            dot_center[0] - dot_radius,
            dot_center[1] - dot_radius,
            dot_center[0] + dot_radius,
            dot_center[1] + dot_radius,
        ),
        fill=dot_fill,
    )


def with_glow(image: Image.Image, scale: float) -> Image.Image:
    glow = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw_prompt(glow, scale, fill=(124, 255, 155, 105), dot_fill=(255, 79, 216, 120))
    glow = glow.filter(ImageFilter.GaussianBlur(42))
    image = Image.alpha_composite(image, glow)

    tight_glow = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw_prompt(tight_glow, scale, fill=(124, 255, 155, 90), dot_fill=(255, 79, 216, 100))
    tight_glow = tight_glow.filter(ImageFilter.GaussianBlur(12))
    image = Image.alpha_composite(image, tight_glow)
    return image


def regular_icon() -> Image.Image:
    image = background()
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle(
        (82, 82, 942, 942),
        radius=186,
        outline=GREEN_DIM,
        width=5,
    )
    # Corner ticks.
    draw.line([(82, 220), (82, 150), (152, 150)], fill=(124, 255, 155, 90), width=4)
    draw.line(
        [(942, 804), (942, 874), (872, 874)],
        fill=(124, 255, 155, 65),
        width=4,
    )
    image = with_glow(image, 0.9)
    draw_prompt(image, 0.9)
    return image


def maskable_icon() -> Image.Image:
    image = background()
    image = with_glow(image, 0.74)
    draw_prompt(image, 0.74)
    return image


def save_icon(image: Image.Image, size: int, name: str):
    resized = image.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(OUT / name, format="PNG", optimize=True)


regular = regular_icon()
maskable = maskable_icon()

save_icon(regular, 192, "icon-192.png")
save_icon(regular, 512, "icon-512.png")
save_icon(regular, 180, "apple-touch-icon.png")
save_icon(maskable, 192, "icon-maskable-192.png")
save_icon(maskable, 512, "icon-maskable-512.png")

print(f"Generated PWA icons in {OUT}")
