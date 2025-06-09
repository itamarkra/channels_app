const SUPABASE_URL = 'https://okvgyimnvhjjidwlsyyf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rdmd5aW1udmhqamlkd2xzeXlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0Njc0OTIsImV4cCI6MjA2NTA0MzQ5Mn0.9PsxWDIEMB6sQbg7FMApZbOrslkKTytYExPmgBdCDK4';

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
