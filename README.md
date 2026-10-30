# Golden Aura

A mobile-first, in-browser front-camera prototype. It applies a soft golden-light overlay, decorative animated butterflies/sparkles, and never alters eyes, face shape, or facial identity.

## Preview locally

Serve this folder from `localhost` (camera access requires a secure context or localhost), then open it in a modern mobile browser:

```powershell
py -m http.server 8080
```

Visit `http://localhost:8080`, tap **Start camera**, approve permission, and use the shutter to download a composited image. For a phone on the same network, use an HTTPS deployment rather than a raw LAN HTTP address.

Face positioning uses the browser's optional `FaceDetector` API where available; every browser still receives the center-aligned effect fallback. For more consistently tracked ears on every mobile browser, the next production step is bundling a WebAssembly face-landmark model (such as MediaPipe) and hosting its assets with the site.

## Snapchat path

This is a browser camera experience, so it cannot automatically become a Snapchat Lens. To make a separate native Snapchat Lens, recreate the same design in Lens Studio/Easy Lens: use face tracking, place butterflies by the ear landmarks, keep eye/face deformation disabled, test on-device, then submit the Lens for Snapchat review.
