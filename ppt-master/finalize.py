"""Post-process the pptxgenjs output so the master behaves like the source deck in PowerPoint.

- master text styles: Arial, title 24 pt bold left with 26 pt line pitch, body 14 pt with
  Wingdings square bullets (22.5 pt hanging indent) and 18 pt space after
- content-layout body placeholders get those bullets instead of pptxgenjs' buNone
- theme colours = the deck palette, theme fonts = Arial
- writes Arenas_Master.potx next to Arenas_Master.pptx

Usage: python3 finalize.py
"""
import re
import shutil
import zipfile
from pathlib import Path

HERE = Path(__file__).parent
EMU = 12700  # per pt

BULLET_L1 = (
    '<a:lvl1pPr marL="{m}" indent="-{m}"><a:spcAft><a:spcPts val="1800"/></a:spcAft>'
    '<a:buClr><a:srgbClr val="000000"/></a:buClr><a:buFont typeface="Wingdings" pitchFamily="2" charset="2"/>'
    '<a:buChar char="&#167;"/>'.format(m=int(22.5 * EMU))
)
BULLET_L2 = (
    '<a:lvl2pPr marL="{m2}" indent="-{m}"><a:spcAft><a:spcPts val="600"/></a:spcAft>'
    '<a:buClr><a:srgbClr val="000000"/></a:buClr><a:buFont typeface="Arial" pitchFamily="34" charset="0"/>'
    '<a:buChar char="&#8211;"/><a:defRPr sz="1400"/></a:lvl2pPr>'.format(m=int(22.5 * EMU), m2=int(45 * EMU))
)

THEME_COLORS = {
    "dk1": "000000", "lt1": "FFFFFF", "dk2": "156082", "lt2": "F2F2F2",
    "accent1": "0070C0", "accent2": "BFE4FF", "accent3": "7F7F7F",
    "accent4": "D9D9D9", "accent5": "156082", "accent6": "A6A6A6",
    "hlink": "0070C0", "folHlink": "767676",
}


def theme(xml: str) -> str:
    xml = re.sub(r'<a:clrScheme name="[^"]*">', '<a:clrScheme name="Arenas made for Germany">', xml)
    for k, v in THEME_COLORS.items():
        xml = re.sub(rf"<a:{k}>.*?</a:{k}>", f'<a:{k}><a:srgbClr val="{v}"/></a:{k}>', xml, count=1, flags=re.S)
    xml = re.sub(r'(<a:majorFont><a:latin typeface=")[^"]*"', r'\1Arial"', xml)
    xml = re.sub(r'(<a:minorFont><a:latin typeface=")[^"]*"', r'\1Arial"', xml)
    xml = re.sub(r'<a:fontScheme name="[^"]*"', '<a:fontScheme name="Arial"', xml)
    return xml


def master(xml: str) -> str:
    title = (
        '<p:titleStyle><a:lvl1pPr algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">'
        '<a:lnSpc><a:spcPts val="2600"/></a:lnSpc><a:spcBef><a:spcPts val="0"/></a:spcBef><a:buNone/>'
        '<a:defRPr sz="2400" b="1" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill>'
        '<a:latin typeface="+mj-lt"/><a:ea typeface="+mj-ea"/><a:cs typeface="+mj-cs"/></a:defRPr></a:lvl1pPr></p:titleStyle>'
    )
    xml = re.sub(r"<p:titleStyle>.*?</p:titleStyle>", title, xml, flags=re.S)
    body = re.search(r"<p:bodyStyle>.*?</p:bodyStyle>", xml, re.S).group(0)
    rpr = '<a:defRPr sz="1400" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr>'
    new_l1 = BULLET_L1.replace('<a:lvl1pPr ', '<a:lvl1pPr algn="l" ') + rpr + "</a:lvl1pPr>"
    body = re.sub(r"<a:lvl1pPr.*?</a:lvl1pPr>", new_l1, body, flags=re.S)
    body = re.sub(r"<a:lvl2pPr.*?</a:lvl2pPr>", BULLET_L2, body, flags=re.S)
    return xml.replace(re.search(r"<p:bodyStyle>.*?</p:bodyStyle>", xml, re.S).group(0), body)


def sp_blocks(xml):
    return re.finditer(r"<p:sp>.*?</p:sp>", xml, re.S)


def bulletize_layout(xml: str) -> str:
    out = xml
    for m in sp_blocks(xml):
        sp = m.group(0)
        if 'type="body"' in sp:
            new = re.sub(r'<a:lvl1pPr indent="0" marL="0"><a:buNone/>', BULLET_L1, sp)
            new = new.replace("</a:lvl1pPr></a:lstStyle>", "</a:lvl1pPr>" + BULLET_L2 + "</a:lstStyle>")
            new = new.replace('<a:pPr indent="0" marL="0"><a:buNone/></a:pPr>', "<a:pPr/>")
            out = out.replace(sp, new)
        elif 'type="title"' in sp:
            out = out.replace(sp, sp.replace('<a:lvl1pPr', '<a:lvl1pPr', 1).replace(
                '<a:lstStyle><a:lvl1pPr', '<a:lstStyle><a:lvl1pPr', 1))
    return out


def bulletize_slide(xml: str) -> str:
    out = xml
    for m in sp_blocks(xml):
        sp = m.group(0)
        if 'type="body"' in sp:
            out = out.replace(sp, sp.replace('<a:pPr indent="0" marL="0"><a:buNone/></a:pPr>', "<a:pPr/>"))
        elif 'type="title"' in sp:
            out = out.replace(sp, sp.replace('<a:pPr indent="0" marL="0"><a:buNone/></a:pPr>', '<a:pPr><a:lnSpc><a:spcPts val="2600"/></a:lnSpc></a:pPr>'))
    return out


def process(pptx: Path):
    src = zipfile.ZipFile(pptx)
    files = {n: src.read(n) for n in src.namelist()}
    src.close()
    names = {}
    for n in files:
        if n.startswith("ppt/slideLayouts/slideLayout") and n.endswith(".xml"):
            names[n] = re.search(r'<p:cSld name="([^"]*)"', files[n].decode()).group(1)
    bullet_layouts = {n for n, v in names.items() if v.startswith(("Inhalt", "Zwei"))}
    # which slides use a bullet layout
    bullet_slides = set()
    for n in files:
        if re.match(r"ppt/slides/_rels/slide\d+\.xml\.rels$", n):
            rel = files[n].decode()
            lay = re.search(r'Target="\.\./slideLayouts/(slideLayout\d+\.xml)"', rel)
            if lay and "ppt/slideLayouts/" + lay.group(1) in bullet_layouts:
                bullet_slides.add(n.replace("_rels/", "").replace(".rels", ""))
    for n in list(files):
        if not n.endswith(".xml"):
            continue
        x = files[n].decode("utf-8")
        if n.startswith("ppt/theme/"):
            x = theme(x)
        elif n.startswith("ppt/slideMasters/slideMaster"):
            x = master(x)
        elif n in bullet_layouts:
            x = bulletize_layout(x)
        elif n.startswith("ppt/slideLayouts/") and names.get(n) == "DEFAULT":
            x = x.replace('<p:cSld name="DEFAULT"', '<p:cSld name="Standard"')
        elif re.match(r"ppt/slides/slide\d+\.xml$", n):
            if n in bullet_slides:
                x = bulletize_slide(x)
            else:  # title line pitch on every slide
                for m in sp_blocks(x):
                    sp = m.group(0)
                    if 'type="title"' in sp:
                        x = x.replace(sp, sp.replace('<a:pPr indent="0" marL="0"><a:buNone/></a:pPr>', '<a:pPr><a:lnSpc><a:spcPts val="2600"/></a:lnSpc></a:pPr>'))
        # title line pitch inside layouts' title lstStyle
        if n.startswith("ppt/slideLayouts/"):
            for m in sp_blocks(x):
                sp = m.group(0)
                if 'type="title"' in sp and 'sz="2400"' in sp and "<a:lnSpc>" not in sp:
                    x = x.replace(sp, sp.replace('<a:lstStyle><a:lvl1pPr indent="0" marL="0">', '<a:lstStyle><a:lvl1pPr indent="0" marL="0"><a:lnSpc><a:spcPts val="2600"/></a:lnSpc>', 1))
        files[n] = x.encode("utf-8")
    tmp = pptx.with_suffix(".tmp")
    with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as z:
        for n, b in files.items():
            z.writestr(n, b)
    shutil.move(tmp, pptx)


def to_potx(pptx: Path, potx: Path):
    src = zipfile.ZipFile(pptx)
    with zipfile.ZipFile(potx, "w", zipfile.ZIP_DEFLATED) as z:
        for n in src.namelist():
            b = src.read(n)
            if n == "[Content_Types].xml":
                b = b.replace(b"presentationml.presentation.main+xml", b"presentationml.template.main+xml")
            z.writestr(n, b)


if __name__ == "__main__":
    for f in ("Arenas_Master.pptx", "Arenas_Beispiele.pptx"):
        process(HERE / f)
    to_potx(HERE / "Arenas_Master.pptx", HERE / "Arenas_Master.potx")
    print("ok")
