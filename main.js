import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 🔁 HIER deine echten Daten eintragen:
const supabaseUrl = 'https://irvuzminjpsbnzruvlhe.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydnV6bWluanBzYm56cnV2bGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTczNzIsImV4cCI6MjA3MTEzMzM3Mn0.ZhCYufwJMSkGlQN1-I65AWrRkbTB7fBoLdIaXrwc_IA'
const supabase = createClient(supabaseUrl, supabaseKey)

const form = document.getElementById('login-form')
const errorEl = document.getElementById('error')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    errorEl.textContent = "Fehler: " + error.message
  } else {
    // Login erfolgreich → Weiterleitung
    window.location.href = "dashboard.html"
  }
})
