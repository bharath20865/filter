const video = document.querySelector('#camera');
const effects = document.querySelector('#faceEffects');
const startButton = document.querySelector('#startButton');
const stopButton = document.querySelector('#stopButton');
const captureButton = document.querySelector('#captureButton');
const status = document.querySelector('#status');
const glow = document.querySelector('#glow');
const glowValue = document.querySelector('#glowValue');
const canvas = document.querySelector('#captureCanvas');
const downloadLink = document.querySelector('#downloadLink');
let stream; let tracker; let tracking = false;

function setStatus(text) { status.textContent = text; }
function setGlow(value) { document.documentElement.style.setProperty('--glow', value / 100); glowValue.value = `${value}%`; }
glow.addEventListener('input', () => setGlow(glow.value));

async function trackFace() {
  if (!tracking || !window.FaceDetector) return;
  try {
    const faces = await tracker.detect(video);
    if (faces[0]) {
      const { x, y, width, height } = faces[0].boundingBox;
      const xPercent = (x + width / 2) / video.videoWidth * 100;
      const yPercent = (y + height / 2) / video.videoHeight * 100;
      const scale = Math.max(.8, Math.min(1.45, width / video.videoWidth / .42));
      effects.style.transform = `translate(${(xPercent - 50) * -1}%, ${yPercent - 48}%) scale(${scale})`;
    }
  } catch (_) { /* Detection is an optional enhancement. */ }
  requestAnimationFrame(trackFace);
}

async function startCamera() {
  if (!navigator.mediaDevices?.getUserMedia) { setStatus('Camera unsupported'); return; }
  try {
    setStatus('Requesting camera…');
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'user' }, width: { ideal: 1080 }, height: { ideal: 1440 } }, audio: false });
    video.srcObject = stream;
    await video.play();
    document.querySelector('#emptyState').hidden = true;
    startButton.disabled = true; stopButton.disabled = false; captureButton.disabled = false;
    setStatus('Live');
    if ('FaceDetector' in window) { tracker = new FaceDetector({ fastMode: true, maxDetectedFaces: 1 }); tracking = true; trackFace(); }
  } catch (error) {
    setStatus(error.name === 'NotAllowedError' ? 'Camera permission needed' : 'Camera unavailable');
  }
}
function stopCamera() {
  tracking = false; stream?.getTracks().forEach(track => track.stop()); stream = undefined; video.srcObject = null;
  document.querySelector('#emptyState').hidden = false;
  startButton.disabled = false; stopButton.disabled = true; captureButton.disabled = true; setStatus('Stopped');
}
function capturePhoto() {
  if (!video.videoWidth) return;
  const { videoWidth: w, videoHeight: h } = video; canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.translate(w, 0); ctx.scale(-1, 1); ctx.drawImage(video, 0, 0, w, h); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const strength = Number(glow.value) / 100;
  const gradient = ctx.createRadialGradient(w / 2, h / 2, w * .08, w / 2, h / 2, w * .57);
  gradient.addColorStop(0, `rgba(255, 209, 105, ${strength * .22})`); gradient.addColorStop(1, 'rgba(255, 188, 60, 0)'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, w, h);
  downloadLink.href = canvas.toDataURL('image/jpeg', .94); downloadLink.click(); setStatus('Photo saved');
}
startButton.addEventListener('click', startCamera); stopButton.addEventListener('click', stopCamera); captureButton.addEventListener('click', capturePhoto);
window.addEventListener('pagehide', stopCamera);
