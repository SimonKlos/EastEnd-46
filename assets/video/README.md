# Skyline-Video einlegen

Lege den lizenzierten Clip in diesen Ordner und nenne ihn exakt:

```text
assets/video/skyline.mp4
```

Das Hero bindet ihn automatisch ein:

```html
<video autoplay muted loop playsinline poster="assets/skyline-poster.svg">
  <source src="assets/video/skyline.mp4" type="video/mp4">
</video>
```

Bitte keine großen Binärdateien über ca. 100 MB in GitHub pushen. Für größere Clips sollte das Video über Vercel Blob, Cloudinary oder einen vergleichbaren Asset-Host ausgeliefert werden. Bis der Clip liegt, bleibt `skyline-poster.svg` der Fallback.
