// Parti comuni a tutte le pagine: menu, barra in alto (pagine interne), schede, funzionamento offline.
const PAGES = [['mappa', 'index.html', 'Mappa'], ['voli', 'voli.html', 'Voli'], ['auto', 'auto.html', 'Auto'], ['dormire', 'dormire.html', 'Dormire'], ['valigia', 'valigia.html', 'Valigia']];
const cur = document.body.dataset.page;

const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const load = nome => fetch(`dati/${nome}.json`).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); });

// Icone Material Symbols: vuote per le sezioni, piene per quella attuale. Salvate qui per funzionare anche offline.
const ICONE = {
  mappa: ['m612-120-263-93-179 71q-17 9-33.5-1T120-173v-558q0-13 7.5-23t19.5-15l202-71 263 92 178-71q17-8 33.5 1.5T840-788v565q0 11-7.5 19T814-192l-202 72Zm-34-75v-505l-196-66v505l196 66Zm60 0 142-47v-512l-142 54v505Zm-458-12 142-54v-505l-142 47v512Zm458-493v505-505Zm-316-66v505-505Z', 'm612-120-263-93-179 71q-17 9-33.5-1T120-173v-558q0-13 7.5-23t19.5-15l202-71 263 92 178-71q17-8 33.5 1.5T840-788v565q0 11-7.5 19T814-192l-202 72Zm-34-75v-505l-196-66v505l196 66Z'],
  voli: ['m348-325 368-101q17-5 25-16t3-28q-5-17-18-23.5t-28.8-2.37L594-469 428-631l-52 12 103 181-111 31-52-43-29 10 61 115Zm472 165H140q-24.75 0-42.37-17.63Q80-195.25 80-220v-153q37-8 61.5-37.5T166-480q0-40-24.5-70T80-587v-153q0-24.75 17.63-42.38Q115.25-800 140-800h680q24.75 0 42.38 17.62Q880-764.75 880-740v520q0 24.75-17.62 42.37Q844.75-160 820-160Zm0-60v-520H140v109q39 26 62.5 65t23.5 86q0 47-23.5 86T140-329v109h680ZM480-480Z', 'm348-325 368-101q17-5 25-16t3-28q-5-17-18-23.5t-29-2.5l-103 27-166-162-52 12 103 181-111 31-52-43-29 10 61 115Zm472 165H140q-25 0-42.5-17.5T80-220v-153q37-8 61.5-37.5T166-480q0-40-24.5-70T80-587v-153q0-25 17.5-42.5T140-800h680q25 0 42.5 17.5T880-740v520q0 25-17.5 42.5T820-160Z'],
  auto: ['M200-204v54q0 12.75-8.62 21.37Q182.75-120 170-120h-20q-12.75 0-21.37-8.63Q120-137.25 120-150v-324l85-256q5-14 16.5-22t26.5-8h464q15 0 26.5 8t16.5 22l85 256v324q0 12.75-8.62 21.37Q822.75-120 810-120h-21q-13 0-21-8.63-8-8.62-8-21.37v-54H200Zm3-330h554l-55-166H258l-55 166Zm-23 60v210-210Zm105.76 160q23.24 0 38.74-15.75Q340-345.5 340-368q0-23.33-15.75-39.67Q308.5-424 286-424q-23.33 0-39.67 16.26Q230-391.47 230-368.24q0 23.24 16.26 38.74 16.27 15.5 39.5 15.5ZM675-314q23.33 0 39.67-15.75Q731-345.5 731-368q0-23.33-16.26-39.67Q698.47-424 675.24-424q-23.24 0-38.74 16.26-15.5 16.27-15.5 39.5 0 23.24 15.75 38.74Q652.5-314 675-314Zm-495 50h600v-210H180v210Z', 'M200-204v54q0 12.75-8.62 21.37Q182.75-120 170-120h-20q-12.75 0-21.37-8.63Q120-137.25 120-150v-324l85-256q5-14 16.5-22t26.5-8h464q15 0 26.5 8t16.5 22l85 256v324q0 12.75-8.62 21.37Q822.75-120 810-120h-21q-12.75 0-21.37-8.63Q759-137.25 759-150v-54H200Zm3-330h554l-55-166H258l-55 166Zm82.76 220q23.24 0 38.74-15.75Q340-345.5 340-368q0-23.33-15.75-39.67Q308.5-424 286-424q-23.33 0-39.67 16.26Q230-391.47 230-368.24q0 23.24 16.26 38.74 16.27 15.5 39.5 15.5ZM675-314q23.33 0 39.67-15.75Q731-345.5 731-368q0-23.33-16.26-39.67Q698.47-424 675.24-424q-23.24 0-38.74 16.26-15.5 16.27-15.5 39.5 0 23.24 15.75 38.74Q652.5-314 675-314Z'],
  dormire: ['M80-200v-255q0-25 10-47t30-36v-116q0-45 30.5-75.5T226-760h180q22 0 41 10t33 27q14-17 32.5-27t40.5-10h180q45 0 76 30.5t31 75.5v116q20 14 30 36t10 47v255h-60v-80H140v80H80Zm430-355h270v-99q0-20-13.5-33T733-700H550q-17 0-28.5 14T510-654v99Zm-330 0h270v-99q0-18-11.5-32T410-700H226q-19 0-32.5 13.5T180-654v99Zm-40 215h680v-115q0-17-11.5-28.5T780-495H180q-17 0-28.5 11.5T140-455v115Zm680 0H140h680Z', 'M80-200v-255q0-25 10-47t30-36v-116q0-45 30.5-75.5T226-760h180q22 0 41 10t33 27q14-17 32.5-27t40.5-10h180q45 0 76 30.5t31 75.5v116q20 14 30 36t10 47v255h-60v-80H140v80H80Zm430-355h270v-99q0-20-13.5-33T733-700H550q-17 0-28.5 14T510-654v99Zm-330 0h270v-99q0-18-11.5-32T410-700H226q-19 0-32.5 13.5T180-654v99Z'],
  valigia: ['M260-120q-24.75 0-42.37-17.63Q200-155.25 200-180v-480q0-24.75 17.63-42.38Q235.25-720 260-720h105v-100q0-24.75 17.63-42.38Q400.25-880 425-880h110q24.75 0 42.38 17.62Q595-844.75 595-820v100h105q24.75 0 42.38 17.62Q760-684.75 760-660v480q0 24.75-17.62 42.37Q724.75-120 700-120q0 17-11.5 28.5T660-80q-17 0-28.5-11.5T620-120H340q0 17-11.5 28.5T300-80q-17 0-28.5-11.5T260-120Zm0-60h440v-480H260v480Zm105-60h60v-360h-60v360Zm170 0h60v-360h-60v360ZM425-720h110v-100H425v100Zm55 300Z', 'M260-120q-24.75 0-42.37-17.63Q200-155.25 200-180v-480q0-24.75 17.63-42.38Q235.25-720 260-720h105v-100q0-24.75 17.63-42.38Q400.25-880 425-880h110q24.75 0 42.38 17.62Q595-844.75 595-820v100h105q24.75 0 42.38 17.62Q760-684.75 760-660v480q0 24.75-17.62 42.37Q724.75-120 700-120q0 17-11.5 28.5T660-80q-17 0-28.5-11.5T620-120H340q0 17-11.5 28.5T300-80q-17 0-28.5-11.5T260-120Zm105-120h60v-360h-60v360Zm170 0h60v-360h-60v360ZM425-720h110v-100H425v100Z']
};
// Barra in alto con una icona per sezione, uguale su tutte le pagine.
const navbar = el('nav', 'navbar'); navbar.setAttribute('aria-label', 'Sezioni');
navbar.innerHTML = PAGES.map(([id, href, nome]) => `<a href="${href}" title="${nome}" aria-label="${nome}"${id === cur ? ' aria-current="page"' : ''}><svg viewBox="0 -960 960 960" width="24" height="24" fill="currentColor"><path d="${ICONE[id][id === cur ? 1 : 0]}"/></svg></a>`).join('');
document.body.prepend(navbar);
// Titolo della pagina (la mappa ha quello del pannello).
if (cur !== 'mappa') document.querySelector('.page').prepend(el('h1', 'ptitle', PAGES.find(p => p[0] === cur)[2]));

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
    const act = el('div', 'actions');
    for (const [l, u] of v.bottoni || []) { // senza link (documento non ancora caricato) il bottone resta disattivato
      const b = u ? el('a', 'btn', l) : el('button', 'btn', l);
      if (u) { b.href = u; b.target = '_blank'; b.rel = 'noopener'; } else { b.type = 'button'; b.disabled = true; b.title = 'Non ancora disponibile'; }
      act.append(b);
    }
    card.append(head, dl, act); root.append(card);
  }
}

// Pagine con elenco di schede: il nome del file dati sta in data-dati.
const root = document.getElementById('root');
if (root?.dataset.dati) load(root.dataset.dati).then(d => schede(root, d)).catch(() => root.append(el('p', 'intro', 'Dati non disponibili.')));

// Offline: dopo la prima apertura con rete il sito resta sul telefono (sw.js).
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').then(() => navigator.serviceWorker.ready).then(r => r.active.postMessage('foto')).catch(() => {});
