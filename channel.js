const SUPABASE_URL = 'https://YOUR_SUPABASE_URL.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

async function loadChannel() {
  const id = getQueryParam('id');
  if (!id) {
    alert('לא נמצא מזהה ערוץ');
    return;
  }

  const { data, error } = await supabase
    .from('channel')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    alert('שגיאה בטעינת הערוץ: ' + error.message);
    return;
  }

  document.getElementById('channelName').textContent = data.name;
  const linkEl = document.getElementById('channelLink');
  linkEl.textContent = data.link || '-';
  linkEl.href = data.link || '#';
  document.getElementById('channelCategory').textContent = data.category || '-';
  document.getElementById('channelDescription').textContent = data.description || '-';
}

loadChannel();
