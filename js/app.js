/* ===== AU Studio — app logic ===== */
const STORAGE_KEY = 'au_projects_v1';
const PLATFORMS = [
  { id: 'imessage', name: 'iMessage', icon: '💬' },
  { id: 'instagram', name: 'Instagram Post', icon: '📸' },
  { id: 'instagram_story', name: 'Instagram Story', icon: '📸' },
  { id: 'x', name: 'X (Twitter)', icon: '🐦' },
  { id: 'x_thread', name: 'X Thread', icon: '🧵' },
  { id: 'lock', name: 'Lock Screen', icon: '🔒' },
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  { id: 'discord', name: 'Discord', icon: '🎮' },
  { id: 'facebook', name: 'Facebook', icon: '👍' },
  { id: 'threads', name: 'Threads', icon: '🧵' }
];

let state = { projects: [], currentId: null };
let saveTimer = null;

function $(s, r = document) { return r.querySelector(s); }
function $$(s, r = document) { return Array.from(r.querySelectorAll(s)); }
function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
function initialOf(name) { const n = String(name || '').trim(); return n ? n.charAt(0).toUpperCase() : '?'; }
function fmtShort(n) {
  n = Number(n) || 0;
  return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K' : String(n);
}
function relTime(ts) {
  const d = Date.now() - Number(ts);
  if (d < 60000) return 'just now';
  if (d < 3600000) return Math.floor(d / 60000) + 'm ago';
  if (d < 86400000) return Math.floor(d / 3600000) + 'h ago';
  return Math.floor(d / 86400000) + 'd ago';
}

// ---------- default data per platform ----------
function newData(platform) {
  const base = { name: '', handle: '', time: '2:14 PM', verified: false, avatar: '#007aff' };
  switch (platform) {
    case 'imessage':
      return { ...base, name: 'Mira', handle: '@mira', messages: [
        { id: uid(), sender: 'them', type: 'text', text: 'Did you make it home safe?', time: '9:42 PM' },
        { id: uid(), sender: 'me', type: 'text', text: 'Just got back. Starting the story now ✨', time: '9:45 PM', read: true },
        { id: uid(), sender: 'them', type: 'voice', text: '', time: '9:47 PM', voiceDur: '0:14' }
      ] };
    case 'instagram':
      return { ...base, name: 'Mira', handle: '@mira', imageType: 'emoji', imageVal: '🥛', caption: 'Milk\nDowntown · ♫ Wave to Earth', likes: '1.4K', cUser: 'jules', cText: 'cute 🤍' };
    case 'instagram_story':
      return { ...base, name: 'Mira', handle: '@mira', imageType: 'emoji', imageVal: '☁️', musicTitle: 'Wave to Earth', musicArtist: 'sewave', viewers: '842' };
    case 'x':
      return { ...base, name: 'Mira', handle: '@mira', text: 'Working overtime all day but somehow don’t feel tired at all. There’s always a reason to smile :)', imageType: 'none', imageVal: '', replies: '42', reposts: '124', likes: '3.8K', views: '48.2K' };
    case 'x_thread':
      return { ...base, name: 'Mira', handle: '@mira', posts: [
        { id: uid(), text: 'au au au', time: '2:14 PM', imageType: 'none', imageVal: '' },
        { id: uid(), text: 'thread continues…', time: '2:16 PM', imageType: 'emoji', imageVal: '🧵' }
      ] };
    case 'lock':
      return { ...base, name: 'Lock Screen', handle: '', time: '9:41', date: 'Tue, Oct 24', notifications: [
        { id: uid(), app: 'Instagram', title: 'mira liked your photo', body: 'Mira and 142 others', time: '9:38 PM', color: '#ea2c59' },
        { id: uid(), app: 'Messages', title: 'Mira', body: 'Did you make it home safe?', time: '9:42 PM', color: '#007aff' }
      ] };
    case 'whatsapp':
      return { ...base, name: 'Mira', handle: '@mira', lastSeen: 'Last seen today at 9:41 PM', messages: [
        { id: uid(), sender: 'them', type: 'text', text: 'hey', time: '9:30 PM', read: true },
        { id: uid(), sender: 'me', type: 'text', text: 'hey yourself', time: '9:31 PM', read: true },
        { id: uid(), sender: 'them', type: 'voice', text: '', time: '9:33 PM', voiceDur: '0:08', read: false }
      ] };
    case 'tiktok':
      return { ...base, name: 'mira', handle: '@mira', imageType: 'emoji', imageVal: '🎬', caption: 'au edits ✨', music: 'slow dancing in the dark · joji', likes: '52.4K', comments: '812', bookmarks: '4.1K', shares: '1.2K', cUser: 'jules', cText: 'obsession' };
    case 'discord':
      return { ...base, name: 'AU Server', handle: '#general', messages: [
        { id: uid(), author: 'Mira', role: '@everyone', color: '#99aab5', text: 'did you see the thread?', time: 'Yesterday at 9:41 PM' },
        { id: uid(), author: 'You', role: '@Member', color: '#007aff', text: 'yeah i’m writing it now', time: 'Today at 2:14 PM' }
      ], embed: false, eAuthor: '', eTitle: '', eDesc: '' };
    case 'facebook':
      return { ...base, name: 'Mira', handle: 'Mira Alvarez', imageType: 'emoji', imageVal: '🌸', text: 'feeling soft today', likes: '214', cUser: 'jules', cText: 'beautiful 🤍' };
    case 'threads':
      return { ...base, name: 'Mira', handle: '@mira', text: 'quiet mornings are the best', imageType: 'emoji', imageVal: '☕', likes: '1.2K', replies: '84', reposts: '22', views: '14.5K' };
    default:
      return base;
  }
}

// ---------- preview renderers ----------
function imgHtml(data) {
  if (data.imageType === 'emoji') return `<div class="emoji-mark">${esc(data.imageVal || '📷')}</div>`;
  if (data.imageType === 'color') return `<div style="background:${esc(data.imageVal || '#e5e5ea')}" class="emoji-mark"></div>`;
  if (data.imageType === 'url' && data.imageVal) return `<img src="${esc(data.imageVal)}">`;
  return `<div class="emoji-mark">📷</div>`;
}
function checkMark(v) { return v ? '<div class="x-check">✓</div>' : ''; }
function statusBar(time, extraRight) {
  const right = `<div class="right">5G<div class="bat"></div>${extraRight || ''}</div>`;
  return `<div class="status"><div class="time">${esc(time)}</div>${right}</div>`;
}
function bubbleHtml(m, meColor) {
  const isMe = m.sender === 'me';
  const bg = isMe ? '007aff' : (meColor || 'e5e5ea');
  const color = isMe ? '#fff' : '#000';
  const r = isMe ? '20px 20px 5px 20px' : '20px 20px 20px 5px';
  if (m.type === 'voice') {
    return `<div class="voice" style="background:#${bg};color:${color};border-radius:${r}"><div class="wave"></div><span style="font-weight:600">${esc(m.voiceDur || '0:00')}</span></div>`;
  }
  return `<div class="bubble" style="background:#${bg};color:${color};border-radius:${r}">${esc(m.text)}</div>`;
}

function renderScreen(platform, data) {
  const v = data.verified ? checkMark(true) : '';
  const init = initialOf(data.name);
  switch (platform) {
    case 'imessage': {
      const msgs = (data.messages || []).map(m => {
        const isMe = m.sender === 'me';
        return `<div class="msg ${isMe ? 'me' : 'them'}">
          ${bubbleHtml(m)}
          <div class="msg-time">${esc(m.time)}</div>
          ${isMe ? `<div class="checks">${m.read ? '✓✓' : '✓'}</div>` : ''}
        </div>`;
      }).join('');
      return `${statusBar(data.time)}
      <div class="imessages">
        <div class="im-head"><div class="im-back">‹</div><div class="im-title">${esc(data.name)}${v}</div><div class="im-time">${esc(data.time)}</div></div>
        <div class="msg-list">${msgs}</div>
      </div>
      <div class="im-footer"><div class="im-input"><input placeholder="iMessage"><span style="font-size:17px">↑</span></div></div>`;
    }
    case 'instagram':
      return `${statusBar(data.time)}
      <div class="ig-head"><div class="avatar" style="background:${data.avatar}">${init}</div>
        <div style="flex:1"><div style="display:flex;align-items:center;gap:6px"><div style="font-weight:800;font-size:15px">${esc(data.name)}</div>${v}</div><div style="font-size:12px;color:var(--text-secondary);margin-top:2px">@${esc(data.handle)} · ${esc(data.time)}</div></div>
        <div class="ig-more">•</div></div>
      <div class="ig-media">${imgHtml(data)}</div>
      <div class="ig-actions"><span style="font-size:20px">💬</span><span style="font-size:20px">🔁</span><span style="font-size:20px">❤️</span><span class="save">🔖</span></div>
      <div class="ig-likes"><span style="font-weight:400;font-size:14px">Liked by <b>queenie</b>, <b>cas</b> and <b>${esc(fmtShort(data.likes))}</b> others</span></div>
      <div class="ig-caption"><b style="font-size:15px">${esc(data.name)}</b> <span style="font-size:15px">${esc(data.caption)}</span></div>
      <div class="ig-comment"><b>${esc(data.cUser || 'jules')}</b> ${esc(data.cText || 'cute 🤍')}</div>
      <div class="ig-time">${esc(data.time)}</div>`;
    case 'instagram_story':
      return `${statusBar(data.time)}
      <div class="story-screen">
        <div class="story-bar">
          <div class="story-left"><div class="story-ring"><div class="inner" style="background:${data.avatar}">${init}</div></div>
            <div class="story-user">${esc(data.name)}${v}</div></div>
          <div class="story-right">${esc(data.time)} · ${esc(data.viewers || '0')} viewers</div>
        </div>
        <div class="story-media">${imgHtml(data)}</div>
        <div class="story-overlay">
          <div class="story-live"><div class="dot-live"></div>LIVE</div>
          <div class="story-music">🎵 ${esc(data.musicTitle || 'Wave to Earth')} · ${esc(data.musicArtist || 'sewave')}</div>
          <div class="swipe-up">swipe up ↑</div>
          <div class="story-viewed">${esc(data.viewers || '0')} viewers</div>
        </div>
      </div>`;
    case 'x': {
      const likesNum = fmtShort(data.likes);
      return `${statusBar(data.time)}
      <div class="x-head"><div class="avatar" style="background:${data.avatar}">${init}</div>
        <div style="flex:1"><div style="display:flex;align-items:center;gap:6px"><div class="x-name">${esc(data.name)}</div>${v}</div><div class="x-meta">@${esc(data.handle)} · ${esc(data.time)}</div></div></div>
      <div class="x-text">${esc(data.text)}</div>
      ${data.imageType !== 'none' ? `<div class="x-media">${imgHtml(data)}</div>` : ''}
      <div class="x-stats"><span>${esc(data.replies)}</span><span>${esc(data.reposts)}</span><span>${likesNum}</span><span>${esc(data.views)}M views</span></div>
      <div class="x-icons"><span style="font-size:20px">💬</span><span style="font-size:20px">🔁</span><span style="font-size:20px;color:#ff2d55">❤️</span><span style="font-size:20px">📤</span></div>`;
    }
    case 'x_thread': {
      const posts = (data.posts || []).map(p => `
        <div style="display:flex;gap:10px;padding:10px 12px;border-bottom:1px solid #f2f2f7">
          <div class="avatar" style="background:${data.avatar}">${init}</div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:6px"><div class="x-name" style="font-size:14px">${esc(data.name)}</div>${v}</div>
            <div class="x-meta" style="font-size:12px">@${esc(data.handle)} · ${esc(p.time)}</div>
            <div class="x-text" style="font-size:15px">${esc(p.text)}</div>
            ${p.imageType !== 'none' ? `<div class="x-media" style="height:160px">${imgHtml(p)}</div>` : ''}
          </div>
        </div>`).join('');
      return `${statusBar(data.time)}<div class="thread-line"></div>${posts}<div class="x-stats" style="padding-top:8px"><span>${esc(data.replies)}</span><span>${esc(data.reposts)}</span><span>${fmtShort(data.likes)}</span><span>${esc(data.views)}M views</span></div>`;
    }
    case 'lock': {
      const notis = (data.notifications || []).map(n => `
        <div class="lock-item">
          <div class="avatar" style="width:28px;height:28px;font-size:11px;background:${n.color || data.avatar}">${initialOf(n.app)}</div>
          <div style="flex:1;min-width:0"><div class="lock-app" style="display:flex;align-items:center;gap:6px">${esc(n.app)}</div><div class="lock-title">${esc(n.title)}</div><div class="lock-body">${esc(n.body)}</div></div>
          <div class="lock-time-small">${esc(n.time)}</div>
        </div>`).join('');
      return `<div class="lock-screen">
        <div class="status" style="top:28px">${statusBar(data.time).replace(/<div class="right">.*<\/div>/, '<div class="right">5G<div class="bat"></div></div>')}</div>
        <div class="lock-time">${esc(data.time)}</div>
        <div class="lock-date">${esc(data.date)}</div>
        <div class="lock-widgets"><div class="lock-widget">📶 5G</div><div class="lock-widget">🔋 100%</div><div class="lock-widget">🎧 AirPods</div></div>
        <div class="lock-notify">${notis}</div>
      </div>`;
    }
    case 'whatsapp': {
      const msgs = (data.messages || []).map(m => {
        const isMe = m.sender === 'me';
        const cls = isMe ? 'me' : 'them';
        const r = isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px';
        const content = m.type === 'voice' ? `<div class="voice" style="background:${isMe?'#dcf8c6':'#fff'};color:#000;border-radius:${r}"><div class="wave"></div><span style="font-weight:800">${esc(m.voiceDur||'0:00')}</span></div>` : `<div class="wa-bubble" style="border-radius:${r}">${esc(m.text)}</div>`;
        return `<div class="wa-msg ${cls}">${content}<div class="wa-time">${esc(m.time)}</div>${isMe ? `<div class="wa-ck">${m.read ? '✓✓' : '✓'}</div>` : ''}</div>`;
      }).join('');
      return `<div class="screen dark" style="">
        <div class="status" style="top:0;background:transparent;box-shadow:none;font-size:12px"><div class="time">9:41</div><div class="right">5G<div class="bat"></div></div></div>
        <div class="wa-head"><div class="back">‹</div><div class="wa-title">${esc(data.name)}</div><div style="font-size:22px">📞</div></div>
        <div class="wa-list">${msgs}</div>
        <div class="wa-footer"><div class="wa-input"><input placeholder="Message"><span style="font-size:18px">📎</span><span style="font-size:18px">📞</span></div></div>
        <div class="last-seen">${esc(data.lastSeen || 'Last seen today at 9:41 PM')}</div>
      </div>`;
    }
    case 'tiktok': {
      return `<div class="status">${statusBar(data.time).replace(/<div class="right">.*<\/div>/, '')}</div>
      <div class="tik-head"><div class="avatar" style="background:${data.avatar}">${init}</div><div class="tik-user">${esc(data.name)}${v}</div><div style="font-size:16px">✨</div></div>
      <div class="tik-video">${imgHtml(data)}<div class="play">▶</div></div><div class="tik-progress"><div class="fill"></div></div>
      <div class="tik-side"><div class="tik-icon">❤️</div><div class="tik-icon">💬</div><div class="tik-icon">🔖</div><div class="tik-icon">📤</div></div>
      <div class="tik-caption"><b style="font-size:15px">@${esc(data.handle)}</b> <span style="font-size:15px">${esc(data.caption)}</span> <span class="tags">#au #edit</span></div>
      <div class="tik-music"><div class="tik-disc">♪</div>${esc(data.music || 'original sound - user')}</div>
      <div class="tik-stats"><span>${fmtShort(data.likes)}</span><span>${esc(data.comments)} comments</span><span>${fmtShort(data.bookmarks)}</span><span>${fmtShort(data.shares)}</span></div>
      <div class="tik-comment"><b>${esc(data.cUser || 'jules')}</b> ${esc(data.cText || 'obsession')}</div>`;
    }
    case 'discord': {
      const msgs = (data.messages || []).map(m => {
        const emb = data.embed ? `<div class="dc-embed"><div class="e-author">${esc(data.eAuthor || 'AU Bot')}</div><div class="e-title">${esc(data.eTitle || 'New AU update')}</div><div class="e-desc">${esc(data.eDesc || 'Check out the latest chapter.')}</div></div>` : '';
        return `<div class="dc-msg"><div class="dc-av" style="background:${m.color || data.avatar}">${initialOf(m.author)}</div>
          <div class="dc-wrap"><div class="dc-header"><div class="dc-author">${esc(m.author)}</div><div class="dc-role">${esc(m.role || '@everyone')}</div><div class="dc-time">${esc(m.time)}</div></div><div class="dc-text">${esc(m.text)}</div>${emb}</div></div>`;
      }).join('');
      return `<div class="screen dark">
        <div class="status" style="top:0;background:#2f3136;box-shadow:none;font-size:12px"><div class="time">9:41</div><div class="right">🔇</div></div>
        <div class="dc-head"><span style="font-size:18px;margin-right:8px">🎮</span>${esc(data.name)}</div>
        <div class="dc-list">${msgs}</div>
        <div class="dc-footer"><div class="dc-input"><input placeholder="Type a message…"><span style="font-size:18px">📎</span><span style="font-size:18px">🎧</span><span style="font-size:18px">😀</span></div></div>
      </div>`;
    }
    case 'facebook':
      return `${statusBar(data.time)}
      <div class="fb-head"><div class="avatar" style="background:${data.avatar}">${init}</div>
        <div style="flex:1"><div style="display:flex;align-items:center;gap:4px"><div style="font-weight:800;font-size:14px">${esc(data.name)}</div><div class="fb-globe"></div></div><div style="font-size:12px;color:var(--text-secondary);margin-top:2px">${esc(data.handle)} · ${esc(data.time)}</div></div></div>
      <div class="fb-media">${imgHtml(data)}</div>
      <div class="fb-text">${esc(data.text)}</div>
      <div class="fb-bar"><span class="act">👍 ${esc(fmtShort(data.likes))}</span><span>💬 ${esc(data.comments || '5')}</span><span>🤍</span><span>📤</span></div>
      <div class="ig-comment" style="font-size:14px"><b>${esc(data.cUser || 'jules')}</b> ${esc(data.cText || 'beautiful 🤍')}</div>`;
    case 'threads': {
      return `${statusBar(data.time)}
      <div class="x-head"><div class="avatar" style="background:${data.avatar}">${init}</div>
        <div style="flex:1"><div style="display:flex;align-items:center;gap:6px"><div class="x-name">${esc(data.name)}</div>${v}</div><div class="x-meta">@${esc(data.handle)} · ${esc(data.time)}</div></div></div>
      <div class="x-text">${esc(data.text)}</div>
      ${data.imageType !== 'none' ? `<div class="x-media" style="height:240px;border-radius:16px">${imgHtml(data)}</div>` : ''}
      <div class="x-stats"><span>${esc(data.replies)}</span><span>${esc(data.reposts)}</span><span>${fmtShort(data.likes)}</span><span>${esc(data.views)}M views</span></div>
      <div class="x-icons" style="color:#000"><span style="font-size:20px">❤️</span><span style="font-size:20px">💬</span><span style="font-size:20px">📤</span></div>`;
    }
    default:
      return `<div class="status">${esc(data.time)}</div><div style="padding:40px;text-align:center;color:var(--text-secondary)">Preview not available</div>`;
  }
}

// ---------- extra controls per platform ----------
function fieldHtml(id, label, type, value, placeholder, extra) {
  const t = esc(type === 'textarea' ? value : (value || ''));
  const ph = placeholder ? ` placeholder="${esc(placeholder)}"` : '';
  if (type === 'textarea') return `<div class="field"><label>${esc(label)}</label><div class="input-wrap"><textarea id="${id}" ${extra || ''}>${t}</textarea></div></div>`;
  return `<div class="field"><label>${esc(label)}</label><div class="input-wrap"><input id="${id}" type="${type}" value="${t}"${ph} ${extra || ''}></div></div>`;
}
function imageControls(prefix, data) {
  const sel = (v) => `<select id="${prefix}-imgtype" style="padding:6px 8px;border:1px solid #d1d1d6;border-radius:8px;background:#fff;font-size:14px">
    <option value="none"${data.imageType === 'none' ? ' selected' : ''}>No image</option>
    <option value="emoji"${data.imageType === 'emoji' ? ' selected' : ''}>Emoji</option>
    <option value="color"${data.imageType === 'color' ? ' selected' : ''}>Color block</option>
    <option value="url"${data.imageType === 'url' ? ' selected' : ''}>Image URL</option>
  </select>`;
  const showEmoji = data.imageType === 'emoji' || data.imageType === 'none';
  const showColor = data.imageType === 'color';
  const showUrl = data.imageType === 'url';
  return `<div class="field"><label>Media</label><div class="field-row">
    <div class="field" style="flex:1">${sel()}</div>
    <div class="field emoji-opt" style="flex:1;display:${showEmoji ? 'block' : 'none'}"><input id="${prefix}-imgval" type="text" value="${esc(data.imageVal || (data.imageType === 'none' ? '' : '📷'))}" placeholder="e.g. 🥛 ☁️ ☕"></div>
    <div class="field color-opt" style="flex:1;display:${showColor ? 'block' : 'none'}"><input id="${prefix}-imgval" type="color" value="${esc(data.imageVal || '#e5e5ea')}" style="width:40px;height:40px;padding:0;border:none"></div>
    <div class="field url-opt" style="flex:1;display:${showUrl ? 'block' : 'none'}"><input id="${prefix}-imgval" type="text" value="${esc(data.imageVal || '')}" placeholder="https://…"></div>
  </div></div>`;
}
function messagesEditorHtml(prefix, data, kind) {
  const list = (data[kind] || []).map(m => `
    <div class="msg-editor-row">
      <select class="f-sender">${m.sender === 'me' ? '<option value="me" selected>Me</option><option value="them">Them</option>' : '<option value="me">Me</option><option value="them" selected>Them</option>'}</select>
      <select class="f-type">${m.type === 'voice' ? '<option value="text">Text</option><option value="voice" selected>Voice note</option>' : '<option value="text" selected>Text</option><option value="voice">Voice note</option>'}</select>
      <input class="f-text" type="text" value="${esc(m.text)}" placeholder="Message text">
      <input class="f-time" type="text" value="${esc(m.time)}" placeholder="Time">
      ${kind === 'messages' && m.sender === 'me' ? `<select class="f-read"><option value="true"${m.read ? ' selected' : ''}>Read</option><option value="false"${!m.read ? ' selected' : ''}>Unread</option></select>` : ''}
      <input class="f-dur" type="text" value="${esc(m.voiceDur || '0:14')}" placeholder="0:14" style="display:${m.type === 'voice' ? 'block' : 'none'}">
      <button class="f-del" style="color:var(--red)">✕</button>
    </div>`).join('');
  return `<div id="${prefix}-list">${list}</div>
  <div class="row" style="margin-top:6px"><button id="${prefix}-add" style="padding:6px 12px;border:1px dashed var(--blue);color:var(--blue);border-radius:8px;font-weight:600">+ Add message</button></div>`;
}
function notifsEditorHtml(data) {
  const list = (data.notifications || []).map(n => `
    <div class="msg-editor-row">
      <input class="f-app" type="text" value="${esc(n.app)}" placeholder="App">
      <input class="f-title" type="text" value="${esc(n.title)}" placeholder="Title">
      <input class="f-body" type="text" value="${esc(n.body)}" placeholder="Body">
      <input class="f-time" type="text" value="${esc(n.time)}" placeholder="Time">
      <input class="f-color" type="color" value="${esc(n.color || '#ea2c59')}" style="width:32px;height:32px;padding:0;border:none">
      <button class="f-del" style="color:var(--red)">✕</button>
    </div>`).join('');
  return `<div id="ed-notifs-list">${list}</div>
  <div class="row" style="margin-top:6px"><button id="ed-notifs-add" style="padding:6px 12px;border:1px dashed var(--blue);color:var(--blue);border-radius:8px;font-weight:600">+ Add notification</button></div>`;
}

function buildControls(platform, data) {
  const extra = document.createElement('div');
  const common = `
    ${fieldHtml('f-name', 'Name', 'text', data.name, 'e.g. Mira')}
    ${fieldHtml('f-handle', 'Handle', 'text', data.handle, 'handle')}
    ${fieldHtml('f-time', 'Time', 'text', data.time, '2:14 PM')}
    <div class="field"><label>Verified</label><div class="row"><label class="toggle"><input id="f-verified" type="checkbox"${data.verified ? ' checked' : ''}><span class="slider"></span></label><span style="font-size:14px;color:var(--text-secondary)">verified badge</span></div></div>
    <div class="field"><label>Avatar color</label><div class="input-wrap" style="display:inline-block;padding:4px;border:none;background:transparent"><input id="f-avatar" type="color" value="${esc(data.avatar)}" style="width:40px;height:40px;padding:0;border:none"></div></div>
  `;
  extra.innerHTML = common;
  const more = document.createElement('div');
  switch (platform) {
    case 'imessage':
    case 'whatsapp':
      more.innerHTML = `<div class="field"><label>Last seen / status</label><div class="input-wrap"><input id="f-lastseen" type="text" value="${esc(data.lastSeen || 'Last seen today at 9:41 PM')}" placeholder="Last seen today at 9:41 PM"></div></div>
        ${messagesEditorHtml('ed', data, 'messages')}`;
      break;
    case 'instagram':
      more.innerHTML = imageControls('ed', data) +
        `${fieldHtml('f-caption', 'Caption', 'textarea', data.caption, 'Write a caption…')}
         ${fieldHtml('f-likes', 'Likes', 'text', data.likes, '1.4K')}
         ${fieldHtml('f-cuser', 'Comment — user', 'text', data.cUser || 'jules', 'user')}
         ${fieldHtml('f-ctext', 'Comment — text', 'text', data.cText || 'cute 🤍', 'comment')}`;
      break;
    case 'instagram_story':
      more.innerHTML = imageControls('ed', data) +
        `${fieldHtml('f-musictitle', 'Music title', 'text', data.musicTitle || 'Wave to Earth', 'song title')}
         ${fieldHtml('f-musicartist', 'Music artist', 'text', data.musicArtist || 'sewave', 'artist')}
         ${fieldHtml('f-viewers', 'Viewers', 'text', data.viewers || '842', '842')}`;
      break;
    case 'x':
    case 'threads':
      more.innerHTML = imageControls('ed', data) +
        `${fieldHtml('f-text', 'Post text', 'textarea', data.text, 'What’s happening?')}
         <div class="field-row">
           ${fieldHtml('f-replies', 'Replies', 'text', data.replies || '0', '0')}
           ${fieldHtml('f-reposts', 'Reposts', 'text', data.reposts || '0', '0')}
         </div>
         <div class="field-row">
           ${fieldHtml('f-likes', 'Likes', 'text', data.likes || '0', '3.8K')}
           ${fieldHtml('f-views', 'Views (M)', 'text', data.views || '0', '48.2K')}
         </div>`;
      break;
    case 'x_thread':
      more.innerHTML = `${fieldHtml('f-text', 'Thread text (applies to posts)', 'textarea', data.posts?.[0]?.text || '', 'first post…')}
        ${messagesEditorHtml('ed-thread', data, 'posts')}`;
      break;
    case 'lock':
      more.innerHTML = `${fieldHtml('f-date', 'Date', 'text', data.date || 'Tue, Oct 24', 'Tue, Oct 24')}
        ${notifsEditorHtml(data)}`;
      break;
    case 'tiktok':
      more.innerHTML = imageControls('ed', data) +
        `${fieldHtml('f-caption', 'Caption', 'textarea', data.caption, 'au edits ✨')}
         ${fieldHtml('f-music', 'Music / sound', 'text', data.music || 'slow dancing in the dark · joji', 'sound')}
         <div class="field-row">
           ${fieldHtml('f-likes', 'Likes', 'text', data.likes || '0', '52.4K')}
           ${fieldHtml('f-comments', 'Comments', 'text', data.comments || '0', '812')}
         </div>
         <div class="field-row">
           ${fieldHtml('f-bookmarks', 'Bookmarks', 'text', data.bookmarks || '0', '4.1K')}
           ${fieldHtml('f-shares', 'Shares', 'text', data.shares || '0', '1.2K')}
         </div>
         ${fieldHtml('f-cuser', 'Comment — user', 'text', data.cUser || 'jules', 'user')}
         ${fieldHtml('f-ctext', 'Comment — text', 'text', data.cText || 'obsession', 'comment')}`;
      break;
    case 'discord':
      more.innerHTML = `${fieldHtml('f-server', 'Server', 'text', data.server || 'AU Server', 'server')}
         ${fieldHtml('f-channel', 'Channel', 'text', data.handle || '#general', '#general')}
         ${messagesEditorHtml('ed-discord', data, 'messages')}
         <div class="field row"><label style="margin:0;font-size:14px">Embed</label><label class="toggle" style="margin-left:8px"><input id="f-embed" type="checkbox"${data.embed ? ' checked' : ''}><span class="slider"></span></label></div>
         ${fieldHtml('f-eauthor', 'Embed author', 'text', data.eAuthor || 'AU Bot', 'bot')}
         ${fieldHtml('f-etitle', 'Embed title', 'text', data.eTitle || 'New AU update', 'title')}
         ${fieldHtml('f-edesc', 'Embed description', 'textarea', data.eDesc || 'Check out the latest chapter.', 'description')}`;
      break;
    case 'facebook':
      more.innerHTML = imageControls('ed', data) +
        `${fieldHtml('f-text', 'Post text', 'textarea', data.text, "What's on your mind?")}
         <div class="field-row">
           ${fieldHtml('f-likes', 'Reactions', 'text', data.likes || '0', '214')}
           ${fieldHtml('f-comments', 'Comments', 'text', data.comments || '0', '5')}
         </div>
         ${fieldHtml('f-cuser', 'Comment — user', 'text', data.cUser || 'jules', 'user')}
         ${fieldHtml('f-ctext', 'Comment — text', 'text', data.cText || 'beautiful 🤍', 'comment')}`;
      break;
  }
  extra.appendChild(more);
  return extra;
}

// ---------- storage ----------
function loadProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state.projects = JSON.parse(raw);
  } catch (e) { console.error(e); }
  if (!state.projects.length) {
    state.projects = [
      { id: uid(), name: 'Example · iMessage', platform: 'imessage', updatedAt: Date.now(), data: newData('imessage') },
      { id: uid(), name: 'Example · Instagram', platform: 'instagram', updatedAt: Date.now(), data: newData('instagram') }
    ];
    saveProjects();
  }
}
function saveProjects() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.projects));
}
function getProject(id) { return state.projects.find(p => p.id === id); }
function newProject(platform, name) {
  const p = { id: uid(), name: name || `${PLATFORMS.find(x => x.id === platform)?.name || 'Project'} · ${initialOf('AU')}`, platform, updatedAt: Date.now(), data: newData(platform) };
  state.projects.unshift(p);
  state.currentId = p.id;
  saveProjects();
  return p;
}
function deleteProject(id) {
  state.projects = state.projects.filter(p => p.id !== id);
  if (state.currentId === id) state.currentId = state.projects[0]?.id || null;
  saveProjects();
}
function duplicateProject(id) {
  const p = getProject(id);
  if (!p) return;
  const copy = JSON.parse(JSON.stringify(p));
  copy.id = uid(); copy.name = (p.name || 'Copy') + ' copy'; copy.updatedAt = Date.now();
  state.projects.unshift(copy);
  saveProjects();
  return copy;
}

// ---------- UI ----------
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}
function setSaving(saving) {
  const dot = $('#ed-dot'), txt = $('#ed-save');
  if (!dot) return;
  dot.className = 'dot' + (saving ? ' saving' : '');
  txt.textContent = saving ? 'Saving…' : 'Saved to device';
}
function autosave() {
  if (saveTimer) clearTimeout(saveTimer);
  setSaving(true);
  saveTimer = setTimeout(() => {
    if (state.currentId) {
      const p = getProject(state.currentId);
      if (p) { p.name = $('#ed-name').value || p.name; p.updatedAt = Date.now(); saveProjects(); }
    }
    setSaving(false);
  }, 700);
}

// bind generic controls (common fields)
function bindCommon(platform, data) {
  const on = () => { readControlsInto(platform, data); updatePreview(); autosave(); };
  $$('#f-name,#f-handle,#f-time,#f-lastseen,#f-caption,#f-text,#f-date,#f-server,#f-channel,#f-eauthor,#f-etitle,#f-edesc,#f-musictitle,#f-musicartist,#f-viewers,#f-music,#f-cuser,#f-ctext,#f-likes,#f-replies,#f-reposts,#f-views,#f-comments,#f-bookmarks,#f-shares,#f-avatar').forEach(el => {
    el.removeEventListener('input', on);
    el.addEventListener('input', on);
  });
  const el = $('#f-verified');
  if (el) { el.removeEventListener('change', on); el.addEventListener('change', on); }
  const embed = $('#f-embed');
  if (embed) { embed.removeEventListener('change', on); embed.addEventListener('change', on); }
  const it = $('#ed-imgtype');
  if (it) { it.removeEventListener('change', on); it.addEventListener('change', () => { readControlsInto(platform, data); toggleImageOpts(); updatePreview(); autosave(); }); }
  const iv = $('#ed-imgval');
  if (iv) { iv.removeEventListener('input', on); iv.addEventListener('input', on); }
}
function toggleImageOpts() {
  const t = $('#ed-imgtype')?.value;
  $$('.emoji-opt,.color-opt,.url-opt').forEach(x => x.style.display = 'none');
  const sel = { emoji: '.emoji-opt', color: '.color-opt', url: '.url-opt' }[t];
  if (sel) $$(sel).forEach(x => x.style.display = 'block');
}
function readControlsInto(platform, data) {
  data.name = $('#ed-name')?.value || data.name;
  const g = id => { const e = $(id); return e ? e.value : ''; };
  data.handle = g('#f-handle'); data.time = g('#f-time'); data.avatar = g('#f-avatar');
  data.verified = !!$('#f-verified')?.checked;
  const platformData = data;
  platformData.likes = g('#f-likes'); platformData.comments = g('#f-comments');
  platformData.cUser = g('#f-cuser'); platformData.cText = g('#f-ctext');
  platformData.text = g('#f-text'); platformData.caption = g('#f-caption');
  platformData.music = g('#f-music'); platformData.server = g('#f-server');
  platformData.channel = g('#f-channel'); platformData.date = g('#f-date');
  platformData.lastSeen = g('#f-lastseen'); platformData.musicTitle = g('#f-musictitle');
  platformData.musicArtist = g('#f-musicartist'); platformData.viewers = g('#f-viewers');
  platformData.embed = !!$('#f-embed')?.checked;
  platformData.eAuthor = g('#f-eauthor'); platformData.eTitle = g('#f-etitle'); platformData.eDesc = g('#f-edesc');
  platformData.replies = g('#f-replies'); platformData.reposts = g('#f-reposts'); platformData.views = g('#f-views');
  platformData.bookmarks = g('#f-bookmarks'); platformData.shares = g('#f-shares');
  // image controls
  const it = $('#ed-imgtype'), iv = $('#ed-imgval');
  if (it) { platformData.imageType = it.value; platformData.imageVal = iv ? iv.value : ''; }
  // chat / notification lists
  readList('ed', data, 'messages');
  readList('ed-thread', data, 'posts');
  readNotifs(data);
}
function readList(prefix, data, key) {
  const container = $(`#${prefix}-list`);
  if (!container) return;
  const arr = [];
  $$(`#${prefix}-list .msg-editor-row`).forEach(row => {
    const f = sel => row.querySelector(sel)?.value || '';
    const item = { id: uid(), sender: f('.f-sender') || 'them', type: f('.f-type') || 'text', text: f('.f-text'), time: f('.f-time') };
    if (row.querySelector('.f-read')) item.read = row.querySelector('.f-read').value === 'true';
    if (row.querySelector('.f-dur')) item.voiceDur = row.querySelector('.f-dur').value || '0:14';
    if (key === 'posts') { item.imageType = 'none'; item.imageVal = ''; }
    arr.push(item);
  });
  data[key] = arr;
}
function readNotifs(data) {
  const arr = [];
  $$('#ed-notifs-list .msg-editor-row').forEach(row => {
    arr.push({ id: uid(), app: row.querySelector('.f-app')?.value || '', title: row.querySelector('.f-title')?.value || '', body: row.querySelector('.f-body')?.value || '', time: row.querySelector('.f-time')?.value || '', color: row.querySelector('.f-color')?.value || '#ea2c59' });
  });
  data.notifications = arr;
}

function writeControls(platform, data) {
  const set = (id, val) => { const e = $(id); if (e) e.value = val != null ? val : ''; };
  set('#f-name', data.name); set('#f-handle', data.handle); set('#f-time', data.time); set('#f-avatar', data.avatar);
  $('#f-verified').checked = !!data.verified;
  set('#f-lastseen', data.lastSeen); set('#f-caption', data.caption); set('#f-text', data.text);
  set('#f-date', data.date); set('#f-server', data.server); set('#f-channel', data.channel);
  set('#f-eauthor', data.eAuthor); set('#f-etitle', data.eTitle); set('#f-edesc', data.eDesc);
  set('#f-musictitle', data.musicTitle); set('#f-musicartist', data.musicArtist); set('#f-viewers', data.viewers);
  set('#f-music', data.music); set('#f-cuser', data.cUser); set('#f-ctext', data.cText);
  set('#f-likes', data.likes); set('#f-replies', data.replies); set('#f-reposts', data.reposts);
  set('#f-views', data.views); set('#f-comments', data.comments); set('#f-bookmarks', data.bookmarks); set('#f-shares', data.shares);
  $('#f-embed').checked = !!data.embed;
  const it = $('#ed-imgtype');
  if (it) { it.value = data.imageType || 'none'; toggleImageOpts(); }
  const iv = $('#ed-imgval');
  if (iv) {
    iv.removeEventListener('input', () => {});
    if (data.imageType === 'color') iv.value = data.imageVal || '#e5e5ea';
    else iv.value = data.imageVal || '';
  }
  renderList('ed', data, 'messages');
  renderList('ed-thread', data, 'posts');
  renderNotifsUI(data);
}
function renderList(prefix, data, key) {
  const container = $(`#${prefix}-list`);
  if (!container) return;
  const kind = key === 'messages' ? 'messages' : 'posts';
  container.innerHTML = messagesEditorHtml(prefix, data, kind).replace(/id="ed-list"/, 'id="ed-list"').replace(/id="ed-thread-add"/, 'id="ed-thread-add"').replace(/id="ed-add"/, 'id="ed-add"').slice(0);
  // simpler: rebuild fully below
  container.innerHTML = (data[key] || []).map(m => `
    <div class="msg-editor-row">
      <select class="f-sender">${kind === 'messages' ? (m.sender === 'me' ? '<option value="me" selected>Me</option><option value="them">Them</option>' : '<option value="me">Me</option><option value="them" selected>Them</option>') : '<option value="them">Post</option>'}</select>
      ${kind === 'messages' ? `<select class="f-type">${m.type === 'voice' ? '<option value="text">Text</option><option value="voice" selected>Voice note</option>' : '<option value="text" selected>Text</option><option value="voice">Voice note</option>'}</select>` : ''}
      <input class="f-text" type="text" value="${esc(m.text)}" placeholder="${kind === 'messages' ? 'Message text' : 'Post text'}">
      <input class="f-time" type="text" value="${esc(m.time)}" placeholder="Time">
      ${kind === 'messages' && m.sender === 'me' ? `<select class="f-read"><option value="true"${m.read ? ' selected' : ''}>Read</option><option value="false"${!m.read ? ' selected' : ''}>Unread</option></select>` : ''}
      ${kind === 'messages' ? `<input class="f-dur" type="text" value="${esc(m.voiceDur || '0:14')}" placeholder="0:14" style="display:${m.type === 'voice' ? 'block' : 'none'}">` : ''}
      <button class="f-del" style="color:var(--red)">✕</button>
    </div>`).join('')
    + `<div class="row" style="margin-top:6px"><button id="${prefix}-add" style="padding:6px 12px;border:1px dashed var(--blue);color:var(--blue);border-radius:8px;font-weight:600">+ Add ${kind === 'messages' ? 'message' : 'post'}</button></div>`;
  bindListEvents(prefix, data, key);
}
function bindListEvents(prefix, data, key) {
  const onChange = () => { readList(prefix, data, key); updatePreview(); autosave(); };
  $$(`#${prefix}-list .f-sender,#${prefix}-list .f-type,#${prefix}-list .f-text,#${prefix}-list .f-time,#${prefix}-list .f-read,#${prefix}-list .f-dur`).forEach(el => {
    el.removeEventListener('input', onChange); el.addEventListener('input', onChange);
    el.removeEventListener('change', onChange); el.addEventListener('change', onChange);
  });
  $$(`#${prefix}-list .f-del`).forEach((el, i) => {
    el.onclick = () => { data[key].splice(i, 1); onChange(); };
  });
  const btn = $(`#${prefix}-add`);
  if (btn) { btn.onclick = () => { data[key].push({ id: uid(), sender: 'them', type: 'text', text: '', time: '2:14 PM', read: false, voiceDur: '0:14' }); onChange(); }; }
}
function renderNotifsUI(data) {
  renderList('ed', data, 'notifications');
  // rebind with notif fields
  const onChange = () => { readNotifs(data); updatePreview(); autosave(); };
  $$('#ed-notifs-list .f-app,#ed-notifs-list .f-title,#ed-notifs-list .f-body,#ed-notifs-list .f-time,#ed-notifs-list .f-color').forEach(el => {
    el.removeEventListener('input', onChange); el.addEventListener('input', onChange);
    el.removeEventListener('change', onChange); el.addEventListener('change', onChange);
  });
  $$('#ed-notifs-list .f-del').forEach((el, i) => { el.onclick = () => { data.notifications.splice(i, 1); onChange(); }; });
  const btn = $('#ed-notifs-add');
  if (btn) btn.onclick = () => { data.notifications.push({ id: uid(), app: 'Instagram', title: 'New notification', body: 'Tap to view', time: '9:41 PM', color: '#ea2c59' }); onChange(); };
}

function updatePreview() {
  if (!state.currentId) return;
  const p = getProject(state.currentId);
  if (!p) return;
  $('#ed-screen').innerHTML = renderScreen(p.platform, p.data);
}
function renderPlatformSelect(selectedId) {
  const sel = $('#ed-platform');
  sel.innerHTML = PLATFORMS.map(x => `<option value="${x.id}"${x.id === selectedId ? ' selected' : ''}>${x.icon} ${x.name}</option>`).join('');
}

function renderProjects() {
  const list = $('#proj-list');
  if (!state.projects.length) {
    list.innerHTML = `<div class="empty"><div class="eicon">📭</div><p>No projects yet. Tap “+ New project” to start.</p></div>`;
    return;
  }
  list.innerHTML = state.projects.map(p => {
    const plat = PLATFORMS.find(x => x.id === p.platform);
    return `<div class="proj-card">
      <div class="proj-thumb">${plat ? plat.icon : '📱'}</div>
      <div class="proj-info">
        <div class="proj-name">${esc(p.name)}</div>
        <div class="proj-meta"><span class="badge">${esc((plat ? plat.name : p.platform))}</span><span>${relTime(p.updatedAt)}</span></div>
      </div>
      <div class="proj-actions">
        <button class="btn-sm" onclick="app.openProject('${p.id}')">Open</button>
        <button class="btn-sm" onclick="app.dupProject('${p.id}')" style="color:var(--blue)">Duplicate</button>
        <button class="btn-sm" onclick="app.delProject('${p.id}')" style="color:var(--red)">Delete</button>
      </div>
    </div>`;
  }).join('');
}

// ---------- export / import ----------
async function exportImage() {
  if (!state.currentId) return;
  const screen = $('#ed-screen');
  try {
    const canvas = await window.html2canvas(screen, { scale: 2, useCORS: true, logging: false, ignoreElements: (el) => el.classList.contains('export-hide') });
    const link = document.createElement('a');
    const p = getProject(state.currentId);
    const safe = (p?.name || 'au').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    link.download = `au-${p.platform}-${safe}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast('Image exported to your photos');
  } catch (e) {
    console.error(e);
    toast('Export failed');
  }
}
function exportJSON() {
  if (!state.currentId) return;
  const p = getProject(state.currentId);
  const blob = new Blob([JSON.stringify({ version: 1, exportedAt: Date.now(), project: p }, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.download = `au-project-${p.id}.json`;
  link.href = URL.createObjectURL(blob);
  link.click();
  toast('Project backup exported');
}
function importJSON(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      const p = parsed.project || parsed;
      if (!p.platform || !p.data) throw new Error('not a project file');
      const np = { id: uid(), name: (p.name || 'Imported project') + ' (imported)', platform: p.platform, updatedAt: Date.now(), data: p.data };
      state.projects.unshift(np);
      saveProjects();
      renderProjects();
      toast('Project imported');
    } catch (err) {
      console.error(err);
      toast('Invalid backup file');
    }
  };
  reader.readAsText(file);
}

// ---------- router & init ----------
const app = {
  openProject(id) { state.currentId = id; location.hash = 'editor'; },
  dupProject(id) { const c = duplicateProject(id); if (c) { state.currentId = c.id; location.hash = 'editor'; } },
  delProject(id) { deleteProject(id); renderProjects(); if (!state.currentId) location.hash = 'home'; }
};

function showSection(id) {
  $$('.page').forEach(p => p.classList.toggle('active', p.id === 'route-' + id));
  $$('.tab-item').forEach(t => t.classList.toggle('active', t.dataset.tab === id));
}
function route() {
  const hash = location.hash.replace(/^#/, '') || 'home';
  const id = hash.replace(/\?.*$/, '');
  if (!['home', 'editor', 'projects', 'help'].includes(id)) location.hash = 'home';
  showSection(id);
  window.scrollTo(0, 0);
  if (id === 'editor') {
    if (!state.currentId) {
      const p = state.projects[0];
      if (p) state.currentId = p.id;
      else { newProject('instagram', 'New project'); }
    }
    const p = getProject(state.currentId);
    $('#ed-name').value = p.name;
    renderPlatformSelect(p.platform);
    buildControlsUI(p.platform, p.data);
    writeControls(p.platform, p.data);
    updatePreview();
  }
  if (id === 'projects') renderProjects();
}
function buildControlsUI(platform, data) {
  const container = $('#ed-platform-fields');
  container.innerHTML = '';
  container.appendChild(buildControls(platform, data));
  bindCommon(platform, data);
  toggleImageOpts();
  // re-bind add buttons after build
  setTimeout(() => {
    ['ed', 'ed-thread'].forEach(prefix => {
      const btn = $(`#${prefix}-add`);
      if (btn) { btn.onclick = null; const d = data; const key = prefix === 'ed' ? 'messages' : 'posts'; btn.onclick = () => { d[key].push({ id: uid(), sender: 'them', type: 'text', text: '', time: '2:14 PM', read: false, voiceDur: '0:14' }); readControlsInto(platform, d); writeControls(platform, d); updatePreview(); autosave(); }; }
    });
    const b = $('#ed-notifs-add');
    if (b) { b.onclick = null; b.onclick = () => { data.notifications.push({ id: uid(), app: 'Instagram', title: 'New notification', body: 'Tap to view', time: '9:41 PM', color: '#ea2c59' }); readControlsInto(platform, data); writeControls(platform, data); updatePreview(); autosave(); }; }
  }, 0);
}

// extra styles for editor rows
(function injectStyles() {
  const css = `
  .msg-editor-row{ display:flex; gap:6px; align-items:center; padding:8px; background:#f2f2f7; border-radius:12px; margin-bottom:8px; }
  .msg-editor-row select, .msg-editor-row input[type="text"], .msg-editor-row input[type="color"]{ padding:6px 8px; font-size:13px; border:1px solid #d1d1d6; border-radius:8px; background:#fff; }
  .msg-editor-row .f-del{ padding:0 6px; font-size:16px; line-height:1; }
  .emoji-opt input, .url-opt input{ padding:8px 10px; font-size:14px; border:1px solid #d1d1d6; border-radius:8px; background:#fff; width:100% }
  `;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
})();

function init() {
  loadProjects();
  // platform chips on home
  $$('.platform[data-platform]').forEach(el => {
    el.onclick = () => { newProject(el.dataset.platform, PLATFORMS.find(x => x.id === el.dataset.platform).name); location.hash = 'editor'; };
  });
  // nav
  $('#nav-help').onclick = () => location.hash = 'help';
  $('#ed-back').onclick = () => location.hash = 'projects';
  $('#proj-new').onclick = () => { newProject('instagram', 'New project'); location.hash = 'editor'; };
  $('#ed-platform').onchange = (e) => {
    if (!state.currentId) return;
    const p = getProject(state.currentId);
    p.platform = e.target.value;
    p.data = newData(e.target.value);
    p.updatedAt = Date.now();
    saveProjects();
    $('#ed-name').value = p.name;
    buildControlsUI(p.platform, p.data);
    writeControls(p.platform, p.data);
    updatePreview();
    autosave();
  };
  $('#ed-name').oninput = autosave;
  $('#ed-export-img').onclick = exportImage;
  $('#ed-export-json').onclick = exportJSON;
  $('#ed-import-json').onclick = () => $('#import-file').click();
  if (!$('#import-file')) {
    const fi = document.createElement('input'); fi.id = 'import-file'; fi.type = 'file'; fi.accept = '.json'; fi.style.display = 'none';
    fi.onchange = (e) => { if (e.target.files[0]) importJSON(e.target.files[0]); e.target.value = ''; };
    document.body.appendChild(fi);
  }
  $('#ed-delete').onclick = () => {
    if (!state.currentId) return;
    if (!confirm('Delete this project?')) return;
    const id = state.currentId;
    deleteProject(id);
    renderProjects();
    location.hash = 'projects';
    toast('Project deleted');
  };
  window.addEventListener('hashchange', route);
  window.addEventListener('load', route);
  route();
  // make app global for inline onclicks
  window.app = app;
}

init();
