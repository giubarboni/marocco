// Parti comuni a tutte le pagine: menu, barra in alto (pagine interne), schede, funzionamento offline.
const PAGES = [['mappa', 'index.html', 'Mappa'], ['voli', 'voli.html', 'Voli'], ['auto', 'auto.html', 'Auto'], ['dormire', 'dormire.html', 'Dormire'], ['valigia', 'valigia.html', 'Valigia']];
const cur = document.body.dataset.page;

const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const load = nome => fetch(`dati/${nome}.json`).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); });

// Menu: un bottone con data-menu, ovunque, lo apre.
const ov = el('div', 'menu-ov'); ov.hidden = true;
ov.innerHTML = `<nav class="menu" aria-label="Pagine">${PAGES.map(([id, href, nome]) => `<a href="${href}"${id === cur ? ' aria-current="page"' : ''}>${nome}</a>`).join('')}</nav>`;
document.body.append(ov);
ov.addEventListener('click', e => { if (e.target === ov) ov.hidden = true; });
document.addEventListener('click', e => { if (e.target.closest('[data-menu]')) ov.hidden = false; });
addEventListener('keydown', e => { if (e.key === 'Escape') ov.hidden = true; });

// Barra in alto sulle pagine interne (la mappa ha il bottone nel suo pannello).
if (cur !== 'mappa') {
  const top = el('header', 'top');
  top.innerHTML = `<a class="back" href="index.html">← Mappa</a><h1>${PAGES.find(p => p[0] === cur)[2]}</h1><button class="menu-btn" type="button" data-menu aria-label="Menu">☰</button>`;
  document.body.prepend(top);
}

// Bottone: se manca il link (documento non ancora caricato) resta disattivato.
const bottone = (label, url) => {
  if (!url) { const b = el('button', 'btn', label); b.type = 'button'; b.disabled = true; b.title = 'Non ancora disponibile'; return b; }
  const a = el('a', 'btn', label); a.href = url; a.target = '_blank'; a.rel = 'noopener'; return a;
};

// Elenco di schede da un file dati: { mock, intro, voci: [{ titolo, sottotitolo, stato, campi: [[nome, valore]], bottoni: [[etichetta, link]] }] }
function schede(root, d) {
  if (d.mock) root.append(el('p', 'mock', 'Dati di esempio: da sostituire con quelli reali.'));
  if (d.intro) root.append(el('p', 'intro', d.intro));
  for (const v of d.voci) {
    const card = el('section', 'card'), head = el('div', 'chead'), t = el('div');
    t.append(el('h2', '', v.titolo)); if (v.sottotitolo) t.append(el('div', 'sub', v.sottotitolo));
    head.append(t);
    if (v.stato) head.append(el('span', /^prenotat/i.test(v.stato) ? 'badge ok' : 'badge', v.stato));
    const dl = el('dl', 'kv');
    for (const [k, val] of v.campi) dl.append(el('dt', '', k), el('dd', '', val));
    const act = el('div', 'actions'); (v.bottoni || []).forEach(([l, u]) => act.append(bottone(l, u)));
    card.append(head, dl, act); root.append(card);
  }
}

// Offline: dopo la prima apertura con rete il sito resta sul telefono (sw.js).
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').then(() => navigator.serviceWorker.ready).then(r => r.active.postMessage('foto')).catch(() => {});
