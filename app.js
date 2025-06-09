import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://YOUR_SUPABASE_URL.supabase.co'
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const channelsContainer = document.getElementById('channelsContainer')
const channelInfo = document.getElementById('channelInfo')
const channelDetails = document.getElementById('channelDetails')
const categorySelect = document.getElementById('categorySelect')
const addChannelForm = document.getElementById('addChannelForm')
const channelForm = document.getElementById('channelForm')

let channels = []

// טען את כל הערוצים מהדאטהבייס
async function loadChannels() {
  const { data, error } = await supabase
    .from('channel')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error loading channels:', error)
    return
  }

  channels = data
  renderChannels(channels)
  populateCategories(channels)
}

// הצג את רשימת הערוצים, לפי קבוצה (קטגוריה)
function renderChannels(channelsToRender) {
  channelsContainer.innerHTML = ''
  if (channelsToRender.length === 0) {
    channelsContainer.innerHTML = '<p>לא נמצאו ערוצים</p>'
    return
  }

  // קיבוץ לפי קטגוריה
  const grouped = channelsToRender.reduce((acc, channel) => {
    const cat = channel.category || 'אחר'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(channel)
    return acc
  }, {})

  for (const category in grouped) {
    const catDiv = document.createElement('div')
    catDiv.innerHTML = `<h3>${category}</h3>`
    grouped[category].forEach(ch => {
      const chDiv = document.createElement('div')
      chDiv.classList.add('channel-item')
      chDiv.textContent = ch.name
      chDiv.onclick = () => showChannelDetails(ch)
      catDiv.appendChild(chDiv)
    })
    channelsContainer.appendChild(catDiv)
  }
}

// הצג פרטי ערוץ בלחיצה
function showChannelDetails(channel) {
  channelDetails.style.display = 'block'
  channelInfo.innerHTML = `
    <p><strong>שם:</strong> ${channel.name}</p>
    <p><strong>קישור:</strong> <a href="${channel.link}" target="_blank">${channel.link}</a></p>
    <p><strong>קטגוריה:</strong> ${channel.category || '-'}</p>
    <p><strong>תיאור:</strong> ${channel.description || '-'}</p>
  `
}

function closeDetails() {
  channelDetails.style.display = 'none'
}

// טען את הקטגוריות ל-dropdown בחיפוש
function populateCategories(channels) {
  const categories = [...new Set(channels.map(ch => ch.category).filter(Boolean))]
  categorySelect.innerHTML = '<option value="">-- בחר קטגוריה --</option>'
  categories.forEach(cat => {
    const opt = document.createElement('option')
    opt.value = cat
    opt.textContent = cat
    categorySelect.appendChild(opt)
  })
}

// סינון לפי קטגוריה
categorySelect.addEventListener('change', () => {
  const selected = categorySelect.value
  if (!selected) {
    renderChannels(channels)
  } else {
    renderChannels(channels.filter(ch => ch.category === selected))
  }
})

// הצג/הסתר טופס הוספת ערוץ
function toggleAddChannelForm() {
  addChannelForm.style.display = addChannelForm.style.display === 'none' ? 'block' : 'none'
}

// טיפול בשליחת טופס הוספת ערוץ
channelForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const newChannel = {
    name: document.getElementById('name').value.trim(),
    link: document.getElementById('link').value.trim() || null,
    category: document.getElementById('category').value.trim() || null,
    description: document.getElementById('description').value.trim() || null,
    created_at: new Date().toISOString()
  }

  // הוספת הערוץ לסופרבייס
  const { data, error } = await supabase
    .from('channel')
    .insert([newChannel])

  if (error) {
    alert('שגיאה בהוספת הערוץ: ' + error.message)
    return
  }

  // רענון הרשימה
  await loadChannels()
  toggleAddChannelForm()
  channelForm.reset()
})

window.onload = () => {
  loadChannels()
}
