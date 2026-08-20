from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, Color
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image
from io import BytesIO
import textwrap
import json

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUT = PUBLIC / "carta-suecia-club-cafe.pdf"

pdfmetrics.registerFont(TTFont("SueciaSans", "/usr/share/fonts/truetype/croscore/Arimo-Regular.ttf"))
pdfmetrics.registerFont(TTFont("SueciaSansBold", "/usr/share/fonts/truetype/croscore/Arimo-Bold.ttf"))
pdfmetrics.registerFont(TTFont("SueciaSerif", "/usr/share/fonts/truetype/croscore/Tinos-Regular.ttf"))
pdfmetrics.registerFont(TTFont("SueciaSerifItalic", "/usr/share/fonts/truetype/croscore/Tinos-Italic.ttf"))

W,H=A4
INK=HexColor("#17130F")
INK2=HexColor("#241C16")
COFFEE=HexColor("#5A3927")
COFFEE2=HexColor("#7A4B32")
CREAM=HexColor("#F4EDE2")
PAPER=HexColor("#FBF7F1")
LATTE=HexColor("#D9B18D")
LINE=HexColor("#D4C3B3")
WHITE=HexColor("#FFFDF9")

catalog = json.loads((ROOT / "data/catalog.json").read_text(encoding="utf-8"))
products = [(p["name"], p["category"], p["image"].lstrip("/"), p["description"]) for p in catalog["products"]]
order=["Café","Dulces","Salados","Bebidas","Combos"]

def draw_cover(c):
    c.setFillColor(INK); c.rect(0,0,W,H,fill=1,stroke=0)
    # subtle concentric lines
    c.setStrokeColor(Color(0.86,0.70,0.55,alpha=0.23)); c.setLineWidth(0.8)
    for r in [105,145,190]: c.circle(W/2,H*0.58,r,fill=0,stroke=1)
    logo=PUBLIC/"assets/brand/logo.jpg"
    c.drawImage(str(logo),W/2-54,H*0.58-54,108,108,mask='auto')
    c.setFillColor(WHITE); c.setFont("SueciaSansBold",9); c.drawCentredString(W/2,H*0.79,"SUECIA · CLUB CAFÉ")
    c.setFont("SueciaSerif",72); c.drawCentredString(W/2,H*0.34,"Carta")
    c.setFillColor(LATTE); c.setFont("SueciaSerifItalic",22); c.drawCentredString(W/2,H*0.29,"Para elegir sin prisa.")
    c.setStrokeColor(Color(1,1,1,alpha=.16)); c.line(55,72,W-55,72)
    c.setFillColor(Color(1,1,1,alpha=.68)); c.setFont("SueciaSans",8.5)
    c.drawString(55,52,"Jr. Martín Alonso de Meza 135 · Pueblo Libre, Lima")
    c.drawRightString(W-55,52,"Lun a sáb · 4:00 pm — 10:00 pm")
    c.showPage()

def crop_draw(c,path,x,y,w,h):
    p=PUBLIC/path
    try:
        im=Image.open(p)
        iw,ih=im.size
        scale=max(w/iw,h/ih)
        nw,nh=iw*scale,ih*scale
        # use ImageReader and draw larger clipped within path
        c.saveState(); c.rect(x,y,w,h,fill=0,stroke=0); c.clipPath(c.beginPath())
        c.restoreState()
    except Exception:
        pass
    # ReportLab drawImage supports preserveAspectRatio but not crop. draw from PIL cropped temp in memory
    im=Image.open(p).convert("RGB")
    iw,ih=im.size; target=w/h; current=iw/ih
    if current>target:
        neww=int(ih*target); left=(iw-neww)//2; im=im.crop((left,0,left+neww,ih))
    else:
        newh=int(iw/target); top=(ih-newh)//2; im=im.crop((0,top,iw,top+newh))
    # Resize to roughly 2 px per PDF point and JPEG-compress before embedding.
    target_px=(max(1,int(w*2)),max(1,int(h*2)))
    im=im.resize(target_px,Image.Resampling.LANCZOS)
    buf=BytesIO(); im.save(buf,format="JPEG",quality=86,optimize=True,progressive=True); buf.seek(0)
    c.drawImage(ImageReader(buf),x,y,w,h,mask='auto')

def wrap_lines(text, font, size, width):
    words=text.split(); lines=[]; line=""
    for word in words:
        test=(line+" "+word).strip()
        if pdfmetrics.stringWidth(test,font,size)<=width: line=test
        else:
            if line: lines.append(line)
            line=word
    if line: lines.append(line)
    return lines

def draw_category_page(c,cat,items,page_idx,total_pages,cat_idx):
    c.setFillColor(CREAM); c.rect(0,0,W,H,fill=1,stroke=0)
    c.setFillColor(LATTE); c.setFont("SueciaSerifItalic",27); c.drawString(48,H-78,f"{cat_idx:02d}")
    c.setFillColor(COFFEE2); c.setFont("SueciaSansBold",7); c.drawString(92,H-58,"SUECIA CLUB CAFÉ")
    c.setFillColor(INK); c.setFont("SueciaSansBold",30); c.drawString(92,H-84,cat + (" · cont." if page_idx>0 else ""))
    c.setFillColor(COFFEE); c.setFont("SueciaSerifItalic",10); c.drawRightString(W-48,H-80,"Para compartir la tarde." if page_idx==0 else "Seguimos eligiendo.")
    c.setStrokeColor(LINE); c.line(48,H-98,W-48,H-98)

    margin=48; gap=18; card_w=(W-2*margin-gap)/2; card_h=278; top=H-122
    for i,(name,category,img,desc) in enumerate(items):
        col=i%2; row=i//2; x=margin+col*(card_w+gap); y=top-(row+1)*card_h-row*gap
        c.setFillColor(PAPER); c.roundRect(x,y,card_w,card_h,13,fill=1,stroke=0)
        c.setStrokeColor(HexColor('#D8C9BA')); c.roundRect(x,y,card_w,card_h,13,fill=0,stroke=1)
        img_h=154
        c.saveState()
        # clip rounded approximation with normal rect to keep robust
        c.rect(x,y+card_h-img_h,card_w,img_h,fill=0,stroke=0)
        c.restoreState()
        crop_draw(c,img,x,y+card_h-img_h,card_w,img_h)
        c.setFillColor(COFFEE2); c.setFont("SueciaSansBold",6.6); c.drawString(x+14,y+103,category.upper())
        c.setFillColor(INK); c.setFont("SueciaSerif",18)
        title_lines=wrap_lines(name,"SueciaSerif",18,card_w-28)
        ty=y+82
        for line in title_lines[:2]: c.drawString(x+14,ty,line); ty-=19
        c.setFillColor(HexColor('#6E6156')); c.setFont("SueciaSans",7.5)
        dlines=wrap_lines(desc,"SueciaSans",7.5,card_w-28)
        dy=y+40
        for line in dlines[:3]: c.drawString(x+14,dy,line); dy-=10
        c.setFillColor(INK); c.setFont("SueciaSansBold",7); c.drawRightString(x+card_w-14,y+14,"CONSULTAR")
    c.setFillColor(HexColor('#7A685A')); c.setFont("SueciaSans",6.6)
    c.drawString(48,24,"SUECIA CLUB CAFÉ · MARTÍN ALONSO DE MEZA 135 · PUEBLO LIBRE")
    c.drawRightString(W-48,24,f"{cat.upper()} · {page_idx+1:02d}/{total_pages:02d}")
    c.showPage()

def draw_footer(c):
    c.setFillColor(COFFEE); c.rect(0,0,W,H,fill=1,stroke=0)
    c.setFillColor(Color(1,.86,.72,alpha=.13))
    c.circle(W/2,H*0.58,170,fill=1,stroke=0)
    logo=PUBLIC/"assets/brand/logo.jpg"
    c.drawImage(str(logo),W/2-58,H*0.60-58,116,116,mask='auto')
    c.setFillColor(LATTE); c.setFont("SueciaSansBold",8); c.drawCentredString(W/2,H*0.39,"¿QUÉ SE TE ANTOJA HOY?")
    c.setFillColor(WHITE); c.setFont("SueciaSerif",34); c.drawCentredString(W/2,H*0.33,"Nos vemos esta tarde.")
    c.setFillColor(Color(1,1,1,alpha=.75)); c.setFont("SueciaSans",9)
    c.drawCentredString(W/2,H*0.26,"Jr. Martín Alonso de Meza 135 · Pueblo Libre, Lima")
    c.drawCentredString(W/2,H*0.23,"Lunes a sábado · 4:00 pm — 10:00 pm")
    c.drawCentredString(W/2,H*0.20,"@sueciaclubcafe")
    c.showPage()

c=canvas.Canvas(str(OUT),pagesize=A4,pageCompression=1)
c.setTitle("Carta - Suecia Club Café")
c.setAuthor("Suecia Club Café")
draw_cover(c)
for cat_idx,cat in enumerate(order,1):
    items=[p for p in products if p[1]==cat]
    if not items: continue
    pages=[items[i:i+4] for i in range(0,len(items),4)]
    for page_idx,chunk in enumerate(pages): draw_category_page(c,cat,chunk,page_idx,len(pages),cat_idx)
draw_footer(c)
c.save()
print(OUT)
