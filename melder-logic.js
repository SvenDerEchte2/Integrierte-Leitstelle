import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://irvuzminjpsbnzruvlhe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydnV6bWluanBzYm56cnV2bGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTczNzIsImV4cCI6MjA3MTEzMzM3Mn0.ZhCYufwJMSkGlQN1-I65AWrRkbTB7fBoLdIaXrwc_IA';
const supabase = createClient(supabaseUrl, supabaseKey);

const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const btn3 = document.getElementById('btn3');

const stichwortText = document.createElement('p');
stichwortText.style.color = 'white';
stichwortText.style.position = 'absolute';
stichwortText.style.top = '5%';
stichwortText.style.left = '50%';
stichwortText.style.transform = 'translateX(-50%)';
stichwortText.style.fontSize = '18px';
document.querySelector('.container').appendChild(stichwortText);

let lastId = 0;
const melderStart = new Date(); // Zeitpunkt, wann Melder geöffnet wird

const sound = new Audio('meldeton.wav');

async function checkNewEinsaetze() {
  const { data, error } = await supabase
    .from('einsaetze')
    .select('*')
    .order('id', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Fehler beim Abrufen:', error);
    return;
  }

  if (data && data.length > 0) {
    const einsatz = data[0];

    // Einsatzzeit prüfen
const einsatzZeit = new Date(`${einsatz.datum}T${einsatz.uhrzeit}`);
    if (einsatz.id !== lastId && einsatzZeit > melderStart) {
      lastId = einsatz.id;

      stichwortText.textContent = `Neuer Einsatz: ${einsatz.stichwort}`;

      sound.currentTime = 0;
      sound.play().catch(err => console.error('Fehler beim Abspielen:', err));

      console.log('Neuer Einsatz:', einsatz);
    }
  }
}

setInterval(checkNewEinsaetze, 5000);
