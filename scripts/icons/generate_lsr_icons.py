"""Generate out all icons we need!"""

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from pyiem.util import get_dbconn

FONT = ImageFont.truetype('/mesonet/data/gis/static/fonts/Vera.ttf', 14)


def do_icon(srcfn, magnitude):
    """Make this icon, please"""
    img = Image.open("%s.png" % (srcfn, ))
    draw = ImageDraw.Draw(img)
    (width, _height) = FONT.getsize(magnitude)
    # 40 pixel wide, we want to center it
    x0 = int(20 - (width / 2.))
    draw.text((x0, 8), magnitude, font=FONT, fill=(0, 0, 0, 255))
    img.save(("../../htdocs/icons/lsr/%s/%s.png"
              ) % (srcfn, magnitude))
    del img
    del draw


def main():
    """Go Main Go"""
    pgconn = get_dbconn('postgis', user='nobody')
    cursor = pgconn.cursor()

    # ------------------- SNOW -------------------
    cursor.execute("""
        SELECT distinct magnitude from lsrs
        WHERE typetext = 'SNOW' and magnitude < 10 ORDER by magnitude ASC
    """)
    for row in cursor:
        do_icon('snow', str(row[0]))
    for magnitude in np.arange(10, 60.1, 0.1):
        do_icon('snow', str(magnitude))
    do_icon('snow', str('60+'))

    # ------------------- RAIN -------------------
    for magnitude in np.arange(0, 6.01, 0.01):
        do_icon('rain', str(magnitude))
    do_icon('rain', str('6.00+'))


if __name__ == '__main__':
    main()
