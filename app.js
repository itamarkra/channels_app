// החלף את ה-URL וה-API KEY שלך כאן:
const SUPABASE_URL = 'https://okvgyimnvhjjidwlsyyf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rdmd5aW1udmhqamlkd2xzeXlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0Njc0OTIsImV4cCI6MjA2NTA0MzQ5Mn0.9PsxWDIEMB6sQbg7FMApZbOrslkKTytYExPmgBdCDK4';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const channelsContainer = document.getElementById('channelsContainer');
const categorySelect = document.getElementById('categorySelect');
const showAddFormBtn = document.getElementById('showAddFormBtn');
const addChannelFormDiv = document.getElementById('addChannelForm');
const channelForm = document.getElementById('channelForm');

let channels = [];

async function loadChannels() {
  const { data, error } = await supabase
    .from('channel')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    alert('שגיאה בטעינת הערוצים: ' + error.message);
    return;
  }
  channels = data;
  populateCategories();
  renderChannels();
}

function populateCategories() {
  const categories = [...new Set(channels.map(ch => ch.category).filter(c => c))];
  categorySelect.innerHTML = '<option value="">-- בחר קטגוריה --</option>';
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });
}

function renderChannels(filterCategory = '') {
  channelsContainer.innerHTML = '';
  let filtered = channels;
  if (filterCategory) {
    filtered = channels.filter(ch => ch.category === filterCategory);
  }
  if (filtered.length === 0) {
    channelsContainer.innerHTML = '<p>לא נמצאו ערוצים</p>';
    return;
  }
  filtered.forEach(ch => {
    const div = document.createElement('div');
    div.className = 'channel-item';
    div.textContent = ch.name + (ch.category ? ` (${ch.category})` : '');
    div.onclick = () => {
      // מפנה לדף פרטי הערוץ עם ה-ID ב-URL
      window.location.href = `channel.html?id=${ch.id}`;
    };
    channelsContainer.appendChild(div);
  });
}

categorySelect.addEventListener('change', (e) => {
  renderChannels(e.target.value);
});

showAddFormBtn.addEventListener('click', () => {
  if (addChannelFormDiv.style.display === 'none' || addChannelFormDiv.style.display === '') {
    addChannelFormDiv.style.display = 'block';
  } else {
    addChannelFormDiv.style.display = 'none';
  }
});

channelForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const link = document.getElementById('link').value.trim();
  const category = document.getElementById('category').value.trim();
  const description = document.getElementById('description').value.trim();

  if (!name) {
    alert('אנא מלא שם לערוץ');
    return;
  }

  const { data, error } = await supabase
    .from('channel')
    .insert([{ name, link, category, description }]);

  if (error) {
    alert('שגיאה בשמירת הערוץ: ' + error.message);
    return;
  }

  // עדכון המקומי
  channels.unshift(data[0]);
  renderChannels(categorySelect.value);
  addChannelFormDiv.style.display = 'none';
  channelForm.reset();
  alert('ערוץ נוסף בהצלחה!');
});

// טעינת הערוצים בתחילת הטעינה
loadChannels();
