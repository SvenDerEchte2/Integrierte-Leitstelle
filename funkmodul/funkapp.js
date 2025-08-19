// --- WebSocket-Verbindung zum Server ---
const socket = new WebSocket('ws://localhost:5500');

// --- AudioContext einmalig erstellen ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// --- Mikrofonaufnahme ---
let localStream = null;
let mediaRecorder = null;

// --- Taste 1 ---
const btn1 = document.getElementById('btn1');

// WebSocket offen
socket.addEventListener('open', () => {
    console.log("WebSocket verbunden");
});

// Audio empfangen und abspielen
socket.addEventListener('message', async (event) => {
    const arrayBuffer = await event.data.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start();
});

// Push-to-Talk starten beim Drücken der Taste
btn1.addEventListener('mousedown', async () => {
    if (!localStream) {
        try {
            localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (err) {
            console.error("Mikrofon nicht verfügbar:", err);
            return;
        }
    }

    mediaRecorder = new MediaRecorder(localStream);
    mediaRecorder.ondataavailable = e => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(e.data);
        } else {
            console.warn("WebSocket nicht offen");
        }
    };
    mediaRecorder.start(250); // alle 250ms ein Chunk senden
});

// Push-to-Talk stoppen beim Loslassen der Taste
const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
    }
};

btn1.addEventListener('mouseup', stopRecording);
btn1.addEventListener('mouseleave', stopRecording);

// Optional: Touch-Support für mobile Geräte
btn1.addEventListener('touchstart', (e) => { e.preventDefault(); btn1.dispatchEvent(new Event('mousedown')); });
btn1.addEventListener('touchend', (e) => { e.preventDefault(); btn1.dispatchEvent(new Event('mouseup')); });
