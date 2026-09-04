/* ============================================================
   RENDER: INICIO
   ============================================================ */
function renderInicio(){
  const el = document.getElementById('inicio');
  const prox = proximaJornada();
  const bvn = blancoVsNegroHistorico();
  const stats = jugadoresConPartidos();
  const lider = [...stats].sort((a,b)=>b.ptos-a.ptos)[0];
  const pichichi = [...stats].sort((a,b)=>b.gf-a.gf)[0];
  const bote = totalBote();

  // últimos resultados jugados (máx 2)
  const jugadas = CALENDARIO.filter(c => window.JORNADAS_DB[c.numero] && window.JORNADAS_DB[c.numero].jugado)
    .sort((a,b)=>b.numero-a.numero).slice(0,2)
    .map(c=>{ const jd = window.JORNADAS_DB[c.numero]; const m = calcularMarcador(jd); return {numero:c.numero, m}; });

  let html = '';
  if (prox){
    html += `<div class="card" style="margin-bottom:14px;">
      <p class="muted" style="font-size:12px;margin:0 0 8px;">Próximo partido</p>
      <div style="display:flex;align-items:center;gap:14px;">
        <div class="logo-icon" style="width:40px;height:40px;">📅</div>
        <div>
          <p style="font-weight:500;font-size:16px;">Jornada ${prox.numero} · ${fmtFecha(prox.fecha,true)}</p>
          <p class="secondary" style="font-size:13px;margin:4px 0 0;">📍 Pabellón Cerrillo de Maracena · 20:00</p>
        </div>
      </div>
    </div>`;
  } else {
    html += `<div class="card" style="margin-bottom:14px;"><p class="muted center">Temporada terminada</p></div>`;
  }

  html += `<div class="grid-3" style="margin-bottom:14px;">
    <div class="metric"><div class="v">${lider?lider.nombre:'-'}</div><div class="l">Líder (${lider?lider.ptos:0} pts)</div></div>
    <div class="metric"><div class="v">${pichichi?pichichi.nombre:'-'}</div><div class="l">Pichichi (${pichichi?pichichi.gf:0} G)</div></div>
    <div class="metric" style="background:var(--success-bg);"><div class="v" style="color:var(--success);">${euros(bote)}</div><div class="l" style="color:var(--success);">Bote</div></div>
  </div>`;

  html += `<div class="card" style="margin-bottom:14px;">
    <p class="muted" style="font-size:12px;margin:0 0 10px;text-align:center;">Blanco vs Negro (histórico)</p>
    <div style="display:flex;height:8px;border-radius:4px;overflow:hidden;margin-bottom:10px;">
      <div style="background:#b4b2a9;width:${bvn.total?bvn.b/bvn.total*100:33}%;"></div>
      <div style="background:var(--warning);width:${bvn.total?bvn.e/bvn.total*100:33}%;"></div>
      <div style="background:#2c2c2a;width:${bvn.total?bvn.n/bvn.total*100:33}%;"></div>
    </div>
    <div style="display:flex;justify-content:space-around;">
      <div class="center"><div style="font-size:16px;font-weight:500;">${bvn.b}</div><div class="muted" style="font-size:11px;">Blanco · ${bvn.total?Math.round(bvn.b/bvn.total*100):0}%</div></div>
      <div class="center"><div style="font-size:16px;font-weight:500;">${bvn.e}</div><div class="muted" style="font-size:11px;">Empates · ${bvn.total?Math.round(bvn.e/bvn.total*100):0}%</div></div>
      <div class="center"><div style="font-size:16px;font-weight:500;">${bvn.n}</div><div class="muted" style="font-size:11px;">Negro · ${bvn.total?Math.round(bvn.n/bvn.total*100):0}%</div></div>
    </div>
  </div>`;

  html += `<p class="muted" style="font-size:12px;margin:0 0 8px;">Últimos resultados</p>`;
  if (jugadas.length===0) html += `<p class="muted">Todavía no hay resultados.</p>`;
  jugadas.forEach(j=>{
    html += `<div class="row-between" style="border:1px solid var(--border);border-radius:var(--radius);padding:8px 12px;margin-bottom:6px;">
      <span class="secondary" style="font-size:13px;">Jornada ${j.numero}</span>
      <span style="font-weight:500;">Blanco ${j.m.golesBlanco} – ${j.m.golesNegro} Negro</span>
      <span style="color:var(--success);">✓</span>
    </div>`;
  });
  el.innerHTML = html;
}
window.renderInicio = renderInicio;

/* ============================================================
   RENDER: CALENDARIO
   ============================================================ */
function actualizarCuentaAtras(){
  const box = document.getElementById('cuenta-atras-box');
  if (!box) return;
  const prox = proximaJornada();
  if (!prox){ box.innerHTML = '<p class="muted center">Temporada terminada</p>'; return; }
  const objetivo = new Date(prox.fecha); objetivo.setHours(20,0,0,0);
  const diff = Math.max(0, objetivo - new Date());
  const d = Math.floor(diff/86400000);
  const h = Math.floor((diff%86400000)/3600000);
  const m = Math.floor((diff%3600000)/60000);
  const s = Math.floor((diff%60000)/1000);
  document.getElementById('ca-d').innerText = d;
  document.getElementById('ca-h').innerText = String(h).padStart(2,'0');
  document.getElementById('ca-m').innerText = String(m).padStart(2,'0');
  document.getElementById('ca-s').innerText = String(s).padStart(2,'0');
}
window.actualizarCuentaAtras = actualizarCuentaAtras;

function renderJornadaCard(c, prox){
  const jd = window.JORNADAS_DB[c.numero];
  const jugado = jd && jd.jugado;
  const esProximo = prox && prox.numero === c.numero;
  let clase = 'jornada-card', etiqueta = '';
  if (jugado){ clase += ''; etiqueta = `<span class="tag tag-success">JUGADO</span>`; }
  else if (esProximo){ clase += ' proximo'; etiqueta = `<span class="tag tag-warning">PRÓXIMO</span>`; }
  else { clase += ' sinjugar'; etiqueta = `<span class="tag tag-muted">SIN JUGAR</span>`; }

  let cuerpo = `<p class="secondary" style="font-size:12px;margin:8px 0 0;">${fmtFecha(c.fecha,true)}</p>`;
  if (jugado){
    const m = calcularMarcador(jd);
    const cols = (equipo, lista) => lista.map(j=>{
      let tags = '';
      if (+j.goles>0) tags += `<span class="tag tag-success">${j.goles} G</span>`;
      if (+j.autogoles>0) tags += ` <span class="tag tag-danger">${j.autogoles} PP</span>`;
      const supl = esSustituto(j.nombre) ? ` <span class="tag tag-muted" style="font-size:8px;">SUPL</span>` : '';
      return `<div class="player-line"><span>${j.nombre}${supl}</span><span>${tags}</span></div>`;
    }).join('');
    cuerpo = `<p class="secondary" style="font-size:12px;margin:8px 0 0;">${fmtFecha(c.fecha,true)}</p>
      <p style="font-weight:500;text-align:center;margin:8px 0 10px;">BLANCO ${m.golesBlanco} – ${m.golesNegro} NEGRO</p>
      <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:10px;">
        <div class="team-col"><p class="muted center" style="font-size:10px;margin:0 0 4px;">BLANCO</p>${cols('blanco', jd.blanco)}</div>
        <div class="divider-v"></div>
        <div class="team-col"><p class="muted center" style="font-size:10px;margin:0 0 4px;">NEGRO</p>${cols('negro', jd.negro)}</div>
      </div>`;
  }
  return `<div class="${clase}">
    <div class="row-between"><span style="font-weight:500;">Jornada ${c.numero}</span>${etiqueta}</div>
    ${cuerpo}
  </div>`;
}

function renderCalendario(){
  const el = document.getElementById('calendario');
  const prox = proximaJornada();
  let html = `<div class="card" style="text-align:center;margin-bottom:20px;" id="cuenta-atras-box">`;
  if (prox){
    html += `<p class="muted" style="font-size:12px;margin:0 0 4px;">Jornada ${prox.numero} · ${fmtFecha(prox.fecha,true)}</p>
      <div style="display:flex;justify-content:center;gap:14px;margin-top:8px;">
        <div><p style="font-size:22px;font-weight:500;margin:0;" id="ca-d">-</p><p class="muted" style="font-size:10px;margin:0;">días</p></div>
        <div><p style="font-size:22px;font-weight:500;margin:0;" id="ca-h">-</p><p class="muted" style="font-size:10px;margin:0;">horas</p></div>
        <div><p style="font-size:22px;font-weight:500;margin:0;" id="ca-m">-</p><p class="muted" style="font-size:10px;margin:0;">min</p></div>
        <div><p style="font-size:22px;font-weight:500;margin:0;" id="ca-s">-</p><p class="muted" style="font-size:10px;margin:0;">seg</p></div>
      </div>`;
  } else { html += `<p class="muted">Temporada terminada</p>`; }
  html += `</div>`;

  const meses = {};
  CALENDARIO.forEach(c=>{ (meses[c.mes] = meses[c.mes]||[]).push(c); });
  Object.keys(meses).forEach(mes=>{
    html += `<p class="month-header">${mes}</p><div class="grid-2">`;
    meses[mes].forEach(c=>{ html += renderJornadaCard(c, prox); });
    html += `</div>`;
  });

  el.innerHTML = html;
  actualizarCuentaAtras();
}
window.renderCalendario = renderCalendario;

/* ============================================================
   RENDER: CLASIFICACIÓN
   ============================================================ */
window.ordenClasif = {criterio:'ptos', asc:false};
function ordenarLista(lista, criterio, asc){
  const claves = {
    alfabetico:(s)=>s.nombre, ptos:(s)=>s.ptos, gf:(s)=>s.gf, pv:(s)=>s.pv,
    gxp:(s)=>s.gxp, pj:(s)=>s.pj, pg:(s)=>s.pg, pp:(s)=>s.pp, pe:(s)=>s.pe
  };
  const f = claves[criterio] || claves.ptos;
  const copia = [...lista].sort((a,b)=>{
    const va=f(a), vb=f(b);
    if (typeof va === 'string') return asc ? va.localeCompare(vb) : vb.localeCompare(va);
    return asc ? va-vb : vb-va;
  });
  return copia;
}
function medalOrPos(i){
  if (i===0) return '🥇'; if (i===1) return '🥈'; if (i===2) return '🥉';
  return `<span class="muted">${i+1}</span>`;
}
function ultimos5Circulos(hist, tipo){
  const jugados = hist.filter(h=>h.jugado).slice(-5);
  return jugados.map(h=>{
    let bg='var(--success-bg)', color='var(--success)', txt=h.estado;
    if (tipo==='goles'){
      txt = h.goles;
      if (h.goles===0){ bg='var(--danger-bg)'; color='var(--danger)'; }
      else if (h.goles<=2){ bg='var(--warning-bg)'; color='var(--warning)'; }
      else { bg='var(--success-bg)'; color='var(--success)'; }
    } else {
      if (h.estado==='D'){ bg='var(--danger-bg)'; color='var(--danger)'; }
      else if (h.estado==='E'){ bg='var(--warning-bg)'; color='var(--warning)'; }
    }
    return `<span class="circle" style="background:${bg};color:${color};">${txt}</span>`;
  }).join('');
}

function renderClasificacion(){
  const el = document.getElementById('clasificacion');
  const stats = ordenarLista(jugadoresConPartidos(), window.ordenClasif.criterio, window.ordenClasif.asc);
  let html = `<div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
    <select onchange="window.ordenClasif.criterio=this.value; renderClasificacion();" style="flex:1;min-width:150px;">
      ${['ptos','alfabetico','gf','pv','gxp','pj','pg','pp','pe'].map(v=>{
        const labels={ptos:'Puntos',alfabetico:'Alfabético',gf:'Goles',pv:'% Victorias',gxp:'Goles por partido',pj:'Partidos jugados',pg:'Victorias',pp:'Derrotas',pe:'Empates'};
        return `<option value="${v}" ${window.ordenClasif.criterio===v?'selected':''}>${labels[v]}</option>`;
      }).join('')}
    </select>
    <button class="btn" onclick="window.ordenClasif.asc=!window.ordenClasif.asc; renderClasificacion();">
      ${window.ordenClasif.asc?'⬆ Menor a mayor':'⬇ Mayor a menor'}
    </button>
  </div>`;

  html += `<div class="scrollx card" style="padding:0;">
    <div style="min-width:780px;">
      <div style="display:flex;align-items:center;gap:14px;padding:8px 12px;border-bottom:1px solid var(--border);">
        <span class="muted" style="width:22px;font-size:11px;">#</span>
        <span class="muted" style="width:110px;font-size:11px;">Jugador</span>
        <span class="muted" style="width:120px;font-size:11px;">Últimos 5</span>
        <span class="muted" style="width:34px;font-size:11px;text-align:center;">PJ</span>
        <span class="muted" style="width:34px;font-size:11px;text-align:center;">PG</span>
        <span class="muted" style="width:34px;font-size:11px;text-align:center;">PE</span>
        <span class="muted" style="width:34px;font-size:11px;text-align:center;">PP</span>
        <span class="muted" style="width:44px;font-size:11px;text-align:center;">%V</span>
        <span class="muted" style="width:34px;font-size:11px;text-align:center;">GF</span>
        <span class="muted" style="width:44px;font-size:11px;text-align:center;">GxP</span>
        <span class="muted" style="width:44px;font-size:11px;text-align:right;">PTOS</span>
      </div>`;
  stats.forEach((s,i)=>{
    const supl = esSustituto(s.nombre) ? ` <span class="tag tag-accent" style="font-size:8px;">SUSTITUTO</span>` : '';
    html += `<div style="display:flex;align-items:center;gap:14px;padding:9px 12px;border-bottom:1px solid var(--border);">
      <span style="width:22px;">${medalOrPos(i)}</span>
      <span style="width:110px;font-weight:500;font-size:13px;">${s.nombre}${supl}</span>
      <div style="width:120px;display:flex;gap:3px;">${ultimos5Circulos(s.hist,'estado')}</div>
      <span class="secondary" style="width:34px;text-align:center;font-size:12px;">${s.pj}</span>
      <span class="secondary" style="width:34px;text-align:center;font-size:12px;">${s.pg}</span>
      <span class="secondary" style="width:34px;text-align:center;font-size:12px;">${s.pe}</span>
      <span class="secondary" style="width:34px;text-align:center;font-size:12px;">${s.pp}</span>
      <span class="secondary" style="width:44px;text-align:center;font-size:12px;">${dec2(s.pv)}%</span>
      <span class="secondary" style="width:34px;text-align:center;font-size:12px;">${s.gf}</span>
      <span class="secondary" style="width:44px;text-align:center;font-size:12px;">${dec2(s.gxp)}</span>
      <span style="width:44px;text-align:right;font-weight:500;font-size:14px;">${s.ptos}</span>
    </div>`;
  });
  html += `</div></div>`;

  html += `<p class="muted" style="font-size:12px;margin:16px 0 8px;">Evolución de puntos</p>
    <div class="card"><canvas id="graf-evolucion" height="180"></canvas></div>`;

  el.innerHTML = html;
  dibujarGraficaEvolucion(stats.slice(0,5));
}
window.renderClasificacion = renderClasificacion;

let chartEvolucionInstancia = null;
function dibujarGraficaEvolucion(top){
  const canvas = document.getElementById('graf-evolucion');
  if (!canvas || typeof Chart === 'undefined') return;
  const colores = ['#2a78d6','#eb6834','#1baf7a','#a855c9','#c73737'];
  const labels = CALENDARIO.map(c=>'J.'+c.numero);
  const datasets = top.map((s,i)=>{
    let acumulado = 0;
    const data = s.hist.map(h=>{
      if (h.jugado){ acumulado += (h.estado==='V'?3:h.estado==='E'?1:0); }
      return h.jugado ? acumulado : null;
    });
    return {label:s.nombre, data, borderColor:colores[i%colores.length], backgroundColor:colores[i%colores.length], borderWidth:2, pointRadius:2, tension:0.25, spanGaps:true};
  });
  if (chartEvolucionInstancia) chartEvolucionInstancia.destroy();
  chartEvolucionInstancia = new Chart(canvas, {
    type:'line', data:{labels, datasets},
    options:{responsive:true, plugins:{legend:{display:true, labels:{boxWidth:10}}}, scales:{y:{beginAtZero:true}}}
  });
}

/* ============================================================
   RENDER: PICHICHI
   ============================================================ */
window.ordenPichichi = {criterio:'gf', asc:false};
function renderPichichi(){
  const el = document.getElementById('pichichi');
  const claves = {gf:(s)=>s.gf, gxp:(s)=>s.gxp};
  const stats = [...jugadoresConPartidos()].sort((a,b)=>{
    const va=claves[window.ordenPichichi.criterio](a), vb=claves[window.ordenPichichi.criterio](b);
    return window.ordenPichichi.asc ? va-vb : vb-va;
  });
  let html = `<div style="display:flex;gap:8px;margin-bottom:12px;">
    <select onchange="window.ordenPichichi.criterio=this.value; renderPichichi();" style="flex:1;">
      <option value="gf" ${window.ordenPichichi.criterio==='gf'?'selected':''}>Goles</option>
      <option value="gxp" ${window.ordenPichichi.criterio==='gxp'?'selected':''}>GxP</option>
    </select>
    <button class="btn" onclick="window.ordenPichichi.asc=!window.ordenPichichi.asc; renderPichichi();">
      ${window.ordenPichichi.asc?'⬆ Menor a mayor':'⬇ Mayor a menor'}
    </button>
  </div>`;
  html += `<div class="row-between" style="padding:8px 12px;border-bottom:1px solid var(--border);">
    <span class="muted" style="width:22px;font-size:11px;">#</span>
    <span class="muted" style="flex:1;font-size:11px;">Jugador</span>
    <span class="muted" style="font-size:11px;">Últimos 5</span>
    <span class="muted" style="width:34px;font-size:11px;text-align:center;">PJ</span>
    <span class="muted" style="width:44px;font-size:11px;text-align:center;">GxP</span>
    <span class="muted" style="width:40px;font-size:11px;text-align:right;">Goles</span>
  </div>`;
  stats.forEach((s,i)=>{
    html += `<div class="card" style="display:flex;align-items:center;gap:14px;margin-top:8px;padding:10px 12px;">
      <span style="width:22px;">${medalOrPos(i)}</span>
      <span style="width:90px;font-weight:500;font-size:13px;">${s.nombre}</span>
      <div style="display:flex;gap:3px;">${ultimos5Circulos(s.hist,'goles')}</div>
      <span class="secondary" style="margin-left:auto;font-size:12px;">${s.pj}</span>
      <span class="secondary" style="width:44px;text-align:center;font-size:12px;">${dec2(s.gxp)}</span>
      <span style="width:40px;text-align:right;font-weight:500;font-size:15px;">${s.gf}</span>
    </div>`;
  });
  el.innerHTML = html;
}
window.renderPichichi = renderPichichi;

/* ============================================================
   RENDER: RACHAS
   ============================================================ */
function renderRachas(){
  const el = document.getElementById('rachas');
  const r = rachasEquipo();
  const defs = [
    ['ganados','trophy','Partidos ganados seguidos','pos'],
    ['perdidos','danger','Partidos perdidos seguidos','neg'],
    ['sinPerder','trophy','Partidos sin perder seguidos','pos'],
    ['anotando','trophy','Partidos anotando seguidos','pos'],
    ['sinGanar','danger','Partidos sin ganar seguidos','neg'],
    ['sinAnotar','danger','Partidos sin anotar seguidos','neg']
  ];
  let html = `<div class="grid-2">`;
  defs.forEach(([clave,,titulo,tono])=>{
    ['actual','record'].forEach(k=>{
      const d = r[clave][k];
      const esActual = k==='actual';
      const bg = esActual ? (tono==='pos'?'var(--success-bg)':'var(--danger-bg)') : 'var(--surface-alt)';
      const color = esActual ? (tono==='pos'?'var(--success)':'var(--danger)') : 'var(--text)';
      const label = (esActual?'':'Récord ') + titulo;
      const nombres = d.jugadores.length ? d.jugadores.map(n=>`<p style="margin:0;font-size:13px;">${n}</p>`).join('') : '<p class="muted" style="margin:0;font-size:13px;">-</p>';
      html += `<div style="background:${bg};border-radius:12px;padding:0.9rem;">
        <p style="font-size:11px;margin:0 0 10px;color:${esActual?color:'var(--text-muted)'};">${label}</p>
        <div class="row-between"><div>${nombres}</div><p style="font-size:24px;font-weight:500;margin:0;color:${color};">${d.valor}</p></div>
      </div>`;
    });
  });
  html += `</div>`;
  el.innerHTML = html;
}
window.renderRachas = renderRachas;

/* ============================================================
   RENDER: FICHA JUGADOR
   ============================================================ */
window.fichaSeleccionado = null;
function renderFicha(){
  const el = document.getElementById('ficha');
  const stats = jugadoresConPartidos();
  if (!window.fichaSeleccionado && stats[0]) window.fichaSeleccionado = stats[0].nombre;
  const s = stats.find(s=>s.nombre===window.fichaSeleccionado) || stats[0];

  let html = `<select style="width:100%;margin-bottom:14px;" onchange="window.fichaSeleccionado=this.value; renderFicha();">
    ${stats.map(x=>`<option value="${x.nombre}" ${x.nombre===window.fichaSeleccionado?'selected':''}>${x.nombre}</option>`).join('')}
  </select>`;

  if (!s){ el.innerHTML = html + '<p class="muted">Todavía no hay jugadores con partidos jugados.</p>'; return; }

  const cat = esSustituto(s.nombre) ? 'SUSTITUTO' : 'MIEMBRO DE LA PEÑA';
  html += `<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
    <p style="font-size:18px;font-weight:500;margin:0;">${s.nombre}</p>
    <span class="tag tag-accent">${cat}</span>
  </div>`;

  html += `<div class="scrollx" style="margin-bottom:18px;">
    <div class="grid-3" style="min-width:560px;">
      <div class="metric"><div class="v">${s.pj}</div><div class="l">PJ</div></div>
      <div class="metric"><div class="v">${dec2(s.pv)}%</div><div class="l">%V</div></div>
      <div class="metric"><div class="v">${s.pg}/${s.pe}/${s.pp}</div><div class="l">G/E/P</div></div>
      <div class="metric"><div class="v">${s.gf}</div><div class="l">Goles</div></div>
      <div class="metric"><div class="v">${s.autog}</div><div class="l">Autogoles</div></div>
      <div class="metric"><div class="v">${dec2(s.gxp)}</div><div class="l">GxP</div></div>
    </div>
  </div>`;

  html += `<p class="muted" style="font-size:12px;margin:0 0 6px;">Resumen por jornada (34)</p>
    <div class="scrollx card" style="padding:0;"><table class="simple" style="min-width:600px;">
    <tr><th>Jornada</th><th>Jugado</th><th>Equipo</th><th>Resultado</th><th>Estado</th><th>Goles</th><th>A.G.</th></tr>`;
  const capitaliza = (t) => t.charAt(0).toUpperCase() + t.slice(1);
  s.hist.forEach(h=>{
    if (!h.jugado){
      html += `<tr><td>J.${h.numero} (${fmtFecha(h.fecha,true)})</td><td>No</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>`;
    } else {
      const colorEstado = h.estado==='V'?'var(--success)':h.estado==='D'?'var(--danger)':'var(--warning)';
      const bgEstado = h.estado==='V'?'var(--success-bg)':h.estado==='D'?'var(--danger-bg)':'var(--warning-bg)';
      html += `<tr><td>J.${h.numero} (${fmtFecha(h.fecha,true)})</td><td>Sí</td><td>${capitaliza(h.equipo)}</td><td>${h.golesFavor} – ${h.golesContra}</td>
        <td><span class="circle" style="background:${bgEstado};color:${colorEstado};">${h.estado}</span></td><td>${h.goles}</td><td>${h.autogoles}</td></tr>`;
    }
  });
  html += `</table></div>`;

  el.innerHTML = html;
}
window.renderFicha = renderFicha;

/* ============================================================
   RENDER: COMPARAR
   ============================================================ */
window.comparaA = null; window.comparaB = null;
function renderComparar(){
  const el = document.getElementById('comparar');
  const stats = jugadoresConPartidos();
  if (!window.comparaA && stats[0]) window.comparaA = stats[0].nombre;
  if (!window.comparaB && stats[1]) window.comparaB = stats[1].nombre;

  let html = `<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
    <select style="flex:1;" onchange="window.comparaA=this.value; renderComparar();">
      ${stats.map(x=>`<option value="${x.nombre}" ${x.nombre===window.comparaA?'selected':''}>${x.nombre}</option>`).join('')}
    </select>
    <span class="muted" style="font-size:12px;">vs</span>
    <select style="flex:1;" onchange="window.comparaB=this.value; renderComparar();">
      ${stats.map(x=>`<option value="${x.nombre}" ${x.nombre===window.comparaB?'selected':''}>${x.nombre}</option>`).join('')}
    </select>
  </div>`;

  const a = stats.find(s=>s.nombre===window.comparaA), b = stats.find(s=>s.nombre===window.comparaB);
  if (!a || !b || a.nombre===b.nombre){ el.innerHTML = html + '<p class="muted">Elige dos jugadores distintos.</p>'; return; }

  const filas = [
    ['PJ', a.pj, b.pj], ['PTOS', a.ptos, b.ptos], ['%V', dec2(a.pv)+'%', dec2(b.pv)+'%'],
    ['Goles', a.gf, b.gf], ['Autogoles', a.autog, b.autog], ['GxP', dec2(a.gxp), dec2(b.gxp)]
  ];
  html += `<div style="margin-bottom:20px;">`;
  filas.forEach(([label, va, vb])=>{
    const na = parseFloat(va), nb = parseFloat(vb);
    const colorA = na>nb ? 'color:var(--success);font-weight:500;' : '';
    const colorB = nb>na ? 'color:var(--success);font-weight:500;' : '';
    html += `<div class="row-between" style="padding:7px 4px;border-bottom:1px solid var(--border);">
      <span style="width:70px;${colorA}">${va}</span>
      <span class="muted" style="flex:1;text-align:center;font-size:11px;">${label}</span>
      <span style="width:70px;text-align:right;${colorB}">${vb}</span>
    </div>`;
  });
  html += `</div>`;

  // Partidos juntos
  const juntos = [];
  CALENDARIO.forEach(c=>{
    const jd = window.JORNADAS_DB[c.numero]; if (!jd || !jd.jugado) return;
    const enBlancoA = jd.blanco.some(j=>j.nombre===a.nombre), enNegroA = jd.negro.some(j=>j.nombre===a.nombre);
    const enBlancoB = jd.blanco.some(j=>j.nombre===b.nombre), enNegroB = jd.negro.some(j=>j.nombre===b.nombre);
    const equipoA = enBlancoA?'blanco':enNegroA?'negro':null, equipoB = enBlancoB?'blanco':enNegroB?'negro':null;
    if (equipoA && equipoB && equipoA===equipoB){
      const m = calcularMarcador(jd);
      const golesFavor = equipoA==='blanco'?m.golesBlanco:m.golesNegro, golesContra = equipoA==='blanco'?m.golesNegro:m.golesBlanco;
      juntos.push({numero:c.numero, fecha:c.fecha, m, estado: estadoDe(golesFavor,golesContra)});
    }
  });
  const jV = juntos.filter(j=>j.estado==='V').length, jE = juntos.filter(j=>j.estado==='E').length, jD = juntos.filter(j=>j.estado==='D').length;
  html += `<div class="card" style="margin-bottom:14px;">
    <p style="font-weight:500;font-size:13px;margin:0 0 10px;">🤝 Partidos jugados juntos</p>
    <div style="display:flex;gap:14px;flex-wrap:wrap;font-size:12px;margin-bottom:10px;">
      <span>Juntos: <b>${juntos.length}</b></span>
      <span style="color:var(--success);">Victorias: ${jV}</span>
      <span style="color:var(--warning);background:var(--warning-bg);padding:2px 6px;border-radius:4px;">Empates: ${jE}</span>
      <span style="color:var(--danger);">Derrotas: ${jD}</span>
    </div>
    ${juntos.map(j=>`<div class="row-between" style="font-size:12px;"><span class="secondary">J.${j.numero} · ${fmtFecha(j.fecha,true)}</span><span>${j.m.golesBlanco} – ${j.m.golesNegro}</span></div>`).join('') || '<p class="muted" style="font-size:12px;">Todavía no han jugado juntos.</p>'}
  </div>`;

  // Enfrentamientos
  const enfrent = [];
  CALENDARIO.forEach(c=>{
    const jd = window.JORNADAS_DB[c.numero]; if (!jd || !jd.jugado) return;
    const enBlancoA = jd.blanco.some(j=>j.nombre===a.nombre), enNegroA = jd.negro.some(j=>j.nombre===a.nombre);
    const enBlancoB = jd.blanco.some(j=>j.nombre===b.nombre), enNegroB = jd.negro.some(j=>j.nombre===b.nombre);
    const equipoA = enBlancoA?'blanco':enNegroA?'negro':null, equipoB = enBlancoB?'blanco':enNegroB?'negro':null;
    if (equipoA && equipoB && equipoA!==equipoB){
      const m = calcularMarcador(jd);
      const golesA = equipoA==='blanco'?m.golesBlanco:m.golesNegro, golesB = equipoA==='blanco'?m.golesNegro:m.golesBlanco;
      let ganador = golesA>golesB ? a.nombre : golesB>golesA ? b.nombre : null;
      enfrent.push({numero:c.numero, fecha:c.fecha, m, ganador});
    }
  });
  const eA = enfrent.filter(e=>e.ganador===a.nombre).length, eB = enfrent.filter(e=>e.ganador===b.nombre).length, eE = enfrent.filter(e=>!e.ganador).length;
  html += `<div class="card">
    <p style="font-weight:500;font-size:13px;margin:0 0 10px;">⚔️ Enfrentamientos</p>
    <div style="display:flex;gap:14px;flex-wrap:wrap;font-size:12px;margin-bottom:10px;">
      <span>Total: <b>${enfrent.length}</b></span>
      <span>Victorias ${a.nombre}: <b>${eA}</b></span>
      <span>Empates: ${eE}</span>
      <span>Victorias ${b.nombre}: <b>${eB}</b></span>
    </div>
    ${enfrent.map(e=>{
      const color = e.ganador===a.nombre ? 'var(--success)' : e.ganador===b.nombre ? 'var(--danger)' : 'var(--text-muted)';
      const texto = e.ganador ? 'Gana '+e.ganador : 'Empate';
      return `<div class="row-between" style="font-size:12px;"><span class="secondary">J.${e.numero} · ${fmtFecha(e.fecha,true)}</span><span>${e.m.golesBlanco} – ${e.m.golesNegro}</span><span style="color:${color};font-size:11px;">${texto}</span></div>`;
    }).join('') || '<p class="muted" style="font-size:12px;">Todavía no se han enfrentado.</p>'}
  </div>`;

  el.innerHTML = html;
}
window.renderComparar = renderComparar;
function estadoDe(f,c){ if(f>c) return 'V'; if(f<c) return 'D'; return 'E'; }

/* ============================================================
   RENDER: CONTABILIDAD (pública, solo lectura)
   ============================================================ */
function totalBote(){
  return (window.CONTABILIDAD||[]).reduce((s,m)=>s + (m.tipo==='gasto' ? -Math.abs(m.cantidad) : Math.abs(m.cantidad)), 0);
}
window.totalBote = totalBote;

function renderContabilidad(){
  const el = document.getElementById('contabilidad');
  const bote = totalBote();
  const movs = [...(window.CONTABILIDAD||[])].sort((a,b)=>(b.timestamp||0)-(a.timestamp||0));
  let html = `<div class="card" style="background:var(--success-bg);text-align:center;margin-bottom:20px;">
    <p style="font-size:12px;color:var(--success);margin:0 0 6px;">Bote actual</p>
    <p style="font-size:30px;font-weight:500;color:var(--success);margin:0;">${euros(bote)}</p>
  </div>`;
  html += `<p class="muted" style="font-size:12px;margin:0 0 8px;">Movimientos</p>`;
  if (movs.length===0) html += `<p class="muted">Todavía no hay movimientos.</p>`;
  movs.forEach(m=>{
    const esGasto = m.tipo==='gasto';
    html += `<div class="row-between card" style="margin-bottom:6px;padding:10px 12px;">
      <div><p style="margin:0;font-size:13px;">${m.concepto}</p><p class="muted" style="margin:2px 0 0;font-size:11px;">${m.jornadaLabel||''}</p></div>
      <span style="font-weight:500;color:${esGasto?'var(--danger)':'var(--success)'};">${esGasto?'−':'+'}${Math.abs(m.cantidad)} €</span>
    </div>`;
  });
  el.innerHTML = html;
}
window.renderContabilidad = renderContabilidad;

/* ============================================================
   RENDER: PRIVADO
   ============================================================ */
window.privadoSub = 'anadir';
function renderPrivado(){
  const el = document.getElementById('privado');
  if (!window.adminAutenticado){ el.innerHTML = '<p class="muted">Inicia sesión para acceder.</p>'; return; }
  const subs = [
    ['anadir','Añadir resultado'], ['modificar','Modificar resultado'], ['contab','Contabilidad'],
    ['addjug','Añadir jugadores'], ['modjug','Modificar jugadores'], ['sorteo','Sortear'], ['exportar','Exportar']
  ];
  let html = `<div class="sub-nav">${subs.map(([id,label])=>
    `<button class="sub-nav-btn ${window.privadoSub===id?'active':''}" onclick="window.privadoSub='${id}'; renderPrivado();">${label}</button>`
  ).join('')}
  <button class="sub-nav-btn" style="color:var(--danger);" onclick="cerrarSesionAdmin()">🚪 Cerrar sesión</button></div>
  <div id="priv-content"></div>`;
  el.innerHTML = html;
  const map = {anadir:privadoAnadirResultado, modificar:privadoModificarResultado, contab:privadoContabilidad,
    addjug:privadoAddJugador, modjug:privadoModJugador, sorteo:privadoSorteo, exportar:privadoExportar};
  document.getElementById('priv-content').innerHTML = map[window.privadoSub]();
  if (window.privadoSub==='modificar') cargarSelectorJornadaModificar();
}
window.renderPrivado = renderPrivado;

function selectJugador(idPrefix, equipo, idx, seleccion){
  const usados = new Set();
  ['blanco','negro'].forEach(eq=>{ for(let i=0;i<5;i++){ if(eq===equipo && i===idx) return; const v = document.getElementById(`${idPrefix}-${eq}-${i}-sel`); if(v && v.value) usados.add(v.value); } });
  const opciones = window.JUGADORES.map(j=>j.nombre).filter(n=> n===seleccion || !usados.has(n));
  return `<select id="${idPrefix}-${equipo}-${idx}-sel" style="flex:2;">
    <option value="">Selecciona...</option>
    ${opciones.map(n=>`<option value="${n}" ${n===seleccion?'selected':''}>${n}${esSustituto(n)?' (Supl.)':''}</option>`).join('')}
  </select>`;
}

function formularioEquipo(idPrefix, equipo, titulo, datosPrevios){
  let filas = '';
  for (let i=0;i<5;i++){
    const prev = (datosPrevios && datosPrevios[i]) || {};
    filas += `<div class="result-row" style="margin-bottom:8px;">
      ${selectJugador(idPrefix, equipo, i, prev.nombre)}
      <input type="number" class="g" id="${idPrefix}-${equipo}-${i}-g" placeholder="0" value="${prev.goles||''}">
      <input type="number" class="pp" id="${idPrefix}-${equipo}-${i}-pp" placeholder="0" value="${prev.autogoles||''}">
      <input type="number" class="euro" id="${idPrefix}-${equipo}-${i}-euro" placeholder="0" value="${prev.bote||''}">
    </div>`;
  }
  return `<div class="card">
    <p class="muted center" style="font-size:12px;margin:0 0 8px;">${titulo}</p>
    <div class="result-col-headers"><span style="flex:2;"></span><span>G</span><span>PP</span><span class="euro">€</span></div>
    ${filas}
  </div>`;
}

function leerFormularioEquipo(idPrefix, equipo){
  const arr = [];
  for (let i=0;i<5;i++){
    const nombre = document.getElementById(`${idPrefix}-${equipo}-${i}-sel`).value;
    if (!nombre) continue;
    arr.push({
      nombre,
      goles: +document.getElementById(`${idPrefix}-${equipo}-${i}-g`).value || 0,
      autogoles: +document.getElementById(`${idPrefix}-${equipo}-${i}-pp`).value || 0,
      bote: +document.getElementById(`${idPrefix}-${equipo}-${i}-euro`).value || 0
    });
  }
  return arr;
}

function privadoAnadirResultado(){
  const prox = proximaJornada();
  const jornadasDisponibles = CALENDARIO.filter(c => !(window.JORNADAS_DB[c.numero] && window.JORNADAS_DB[c.numero].jugado));
  const sel = window.jornadaAnadirSel || (prox ? prox.numero : (jornadasDisponibles[0]||{}).numero);
  window.jornadaAnadirSel = sel;
  return `
    <div class="formfield" style="max-width:320px;">
      <label>Jornada</label>
      <select onchange="window.jornadaAnadirSel=+this.value; renderPrivado();">
        ${jornadasDisponibles.map(c=>`<option value="${c.numero}" ${c.numero===sel?'selected':''}>Jornada ${c.numero} · ${fmtFecha(c.fecha)}</option>`).join('')}
      </select>
    </div>
    <div class="result-form-grid">
      ${formularioEquipo('add','blanco','EQUIPO BLANCO')}
      ${formularioEquipo('add','negro','EQUIPO NEGRO')}
    </div>
    <button class="btn btn-primary" style="width:100%;margin-top:14px;" onclick="guardarResultado('add', ${sel})">Guardar resultado</button>
    <p id="add-resultado-msg" class="muted" style="font-size:12px;margin-top:8px;"></p>
  `;
}

async function guardarResultado(idPrefix, numero){
  const blanco = leerFormularioEquipo(idPrefix,'blanco');
  const negro = leerFormularioEquipo(idPrefix,'negro');
  if (blanco.length!==5 || negro.length!==5){ alert('Selecciona 5 jugadores en cada equipo.'); return; }
  await window.dbGuardarJornada(numero, {jugado:true, blanco, negro});
  // Movimientos de bote por suplentes
  const fecha = (CALENDARIO.find(c=>c.numero===numero)||{}).fecha;
  for (const eq of [['blanco',blanco],['negro',negro]]){
    for (const j of eq[1]){
      if (j.bote > 0){
        await window.dbGuardarMovimientoContabilidad(`supl_j${numero}_${j.nombre}`, {
          tipo:'ingreso', cantidad:j.bote, concepto:`Suplente ${j.nombre}`,
          jornadaLabel:`J.${numero} · ${fecha?fmtFecha(fecha):''}`, timestamp: numero
        });
      }
    }
  }
  const msg = document.getElementById(idPrefix+'-resultado-msg');
  if (msg) msg.innerText = '✅ Resultado guardado.';
}
window.guardarResultado = guardarResultado;

function cargarSelectorJornadaModificar(){
  renderModificarFormulario();
}
function privadoModificarResultado(){
  const jugadas = CALENDARIO.filter(c=>window.JORNADAS_DB[c.numero] && window.JORNADAS_DB[c.numero].jugado);
  if (!window.jornadaModSel && jugadas[0]) window.jornadaModSel = jugadas[0].numero;
  return `
    <div class="formfield" style="max-width:320px;">
      <label>Jornada a modificar</label>
      <select onchange="window.jornadaModSel=+this.value; renderPrivado();">
        ${jugadas.map(c=>{
          const m = calcularMarcador(window.JORNADAS_DB[c.numero]);
          return `<option value="${c.numero}" ${c.numero===window.jornadaModSel?'selected':''}>Jornada ${c.numero} · ${fmtFecha(c.fecha)} (Blanco ${m.golesBlanco} - ${m.golesNegro} Negro)</option>`;
        }).join('')}
      </select>
    </div>
    <div id="mod-form-area"></div>
  `;
}
function renderModificarFormulario(){
  const area = document.getElementById('mod-form-area');
  if (!area || !window.jornadaModSel) return;
  const jd = window.JORNADAS_DB[window.jornadaModSel];
  area.innerHTML = `
    <div class="result-form-grid">
      ${formularioEquipo('mod','blanco','EQUIPO BLANCO', jd.blanco)}
      ${formularioEquipo('mod','negro','EQUIPO NEGRO', jd.negro)}
    </div>
    <button class="btn btn-primary" style="width:100%;margin-top:14px;" onclick="guardarResultado('mod', ${window.jornadaModSel})">Guardar cambios</button>
    <p id="mod-resultado-msg" class="muted" style="font-size:12px;margin-top:8px;"></p>
  `;
}

function privadoContabilidad(){
  return `
    <div class="formfield"><label>Jornada</label>
      <select id="cnt-jornada">
        <option value="">Sin asociar a jornada</option>
        ${CALENDARIO.map(c=>`<option value="${c.numero}">Jornada ${c.numero} · ${fmtFecha(c.fecha)}</option>`).join('')}
      </select>
    </div>
    <div class="formfield"><label>Tipo</label>
      <select id="cnt-tipo"><option value="ingreso">Ingreso</option><option value="gasto">Gasto</option></select>
    </div>
    <div class="formfield"><label>Cantidad (€)</label><input type="number" id="cnt-cantidad"></div>
    <div class="formfield"><label>Concepto</label><input type="text" id="cnt-concepto"></div>
    <button class="btn btn-primary" onclick="guardarMovimiento()">Guardar movimiento</button>
    <p id="cnt-msg" class="muted" style="font-size:12px;margin-top:8px;"></p>
    <hr style="border-color:var(--border);margin:20px 0;">
    <p class="muted" style="font-size:12px;margin:0 0 8px;">Movimientos existentes</p>
    ${(window.CONTABILIDAD||[]).map(m=>`
      <div class="row-between" style="padding:8px 4px;border-bottom:1px solid var(--border);font-size:12.5px;">
        <span>${m.concepto} <span class="muted">(${m.jornadaLabel||'sin jornada'})</span></span>
        <span style="display:flex;align-items:center;gap:8px;">
          <span style="color:${m.tipo==='gasto'?'var(--danger)':'var(--success)'};">${m.tipo==='gasto'?'-':'+'}${m.cantidad}€</span>
          <button class="btn" style="padding:2px 8px;" onclick="borrarMovimiento('${m.id}')">✕</button>
        </span>
      </div>`).join('') || '<p class="muted">Sin movimientos.</p>'}
  `;
}
async function guardarMovimiento(){
  const jn = document.getElementById('cnt-jornada').value;
  const tipo = document.getElementById('cnt-tipo').value;
  const cantidad = +document.getElementById('cnt-cantidad').value;
  const concepto = document.getElementById('cnt-concepto').value.trim();
  if (!cantidad || !concepto){ alert('Rellena cantidad y concepto.'); return; }
  const c = jn ? CALENDARIO.find(c=>c.numero===+jn) : null;
  await window.dbGuardarMovimientoContabilidad(null, {
    tipo, cantidad, concepto, jornadaLabel: c ? `J.${c.numero} · ${fmtFecha(c.fecha)}` : '', timestamp: Date.now()
  });
  document.getElementById('cnt-msg').innerText = '✅ Movimiento guardado.';
  document.getElementById('cnt-cantidad').value=''; document.getElementById('cnt-concepto').value='';
}
window.guardarMovimiento = guardarMovimiento;
async function borrarMovimiento(id){ if(confirm('¿Borrar este movimiento?')) await window.dbBorrarMovimientoContabilidad(id); }
window.borrarMovimiento = borrarMovimiento;

function privadoAddJugador(){
  return `
    <div class="formfield"><label>Nombre del jugador</label><input type="text" id="nj-nombre"></div>
    <div class="formfield"><label>Categoría</label>
      <select id="nj-categoria"><option value="miembro">Miembro de la peña</option><option value="sustituto">Sustituto</option></select>
    </div>
    <button class="btn btn-primary" onclick="anadirJugador()">Añadir</button>
    <p id="nj-msg" class="muted" style="font-size:12px;margin-top:8px;"></p>
  `;
}
async function anadirJugador(){
  const nombre = document.getElementById('nj-nombre').value.trim().toUpperCase();
  const categoria = document.getElementById('nj-categoria').value;
  if (!nombre){ alert('Escribe un nombre.'); return; }
  if (window.JUGADORES.some(j=>j.nombre===nombre)){ alert('Ya existe un jugador con ese nombre.'); return; }
  await window.dbAgregarJugador(nombre, categoria);
  document.getElementById('nj-msg').innerText = '✅ Jugador añadido.';
  document.getElementById('nj-nombre').value='';
}
window.anadirJugador = anadirJugador;

function privadoModJugador(){
  if (!window.modJugSel && window.JUGADORES[0]) window.modJugSel = window.JUGADORES[0].nombre;
  const actual = window.JUGADORES.find(j=>j.nombre===window.modJugSel);
  return `
    <div class="formfield"><label>Jugador</label>
      <select onchange="window.modJugSel=this.value; renderPrivado();">
        ${window.JUGADORES.map(j=>`<option value="${j.nombre}" ${j.nombre===window.modJugSel?'selected':''}>${j.nombre}</option>`).join('')}
      </select>
    </div>
    <div class="formfield"><label>Nuevo nombre</label><input type="text" id="mj-nombre" value="${actual?actual.nombre:''}"></div>
    <div class="formfield"><label>Categoría</label>
      <select id="mj-categoria">
        <option value="miembro" ${actual&&actual.categoria==='miembro'?'selected':''}>Miembro de la peña</option>
        <option value="sustituto" ${actual&&actual.categoria==='sustituto'?'selected':''}>Sustituto</option>
      </select>
    </div>
    <button class="btn btn-primary" onclick="guardarModJugador()">Guardar cambios</button>
    <p id="mj-msg" class="muted" style="font-size:12px;margin-top:8px;"></p>
  `;
}
async function guardarModJugador(){
  const nuevo = document.getElementById('mj-nombre').value.trim().toUpperCase();
  const categoria = document.getElementById('mj-categoria').value;
  if (!nuevo){ alert('Escribe un nombre.'); return; }
  await window.dbRenombrarJugador(window.modJugSel, nuevo, categoria);
  window.modJugSel = nuevo;
  document.getElementById('mj-msg').innerText = '✅ Jugador actualizado.';
}
window.guardarModJugador = guardarModJugador;

function privadoSorteo(){
  window.sorteoCriterio = window.sorteoCriterio || 'pv';
  let selects = '';
  for (let i=0;i<10;i++){
    const usados = new Set();
    for (let k=0;k<10;k++){ if(k===i) continue; const v = document.getElementById(`sorteo-${k}`); if (v && v.value) usados.add(v.value); }
    const opciones = window.JUGADORES.map(j=>j.nombre).filter(n=>!usados.has(n) || n===(window.sorteoSel&&window.sorteoSel[i]));
    selects += `<select id="sorteo-${i}"><option value="">Selecciona...</option>${opciones.map(n=>`<option value="${n}" ${window.sorteoSel&&window.sorteoSel[i]===n?'selected':''}>${n}${esSustituto(n)?' (Supl.)':''}</option>`).join('')}</select>`;
  }
  return `
    <div class="formfield" style="max-width:320px;"><label>Criterio de equilibrado</label>
      <select id="sorteo-criterio">
        <option value="pv" ${window.sorteoCriterio==='pv'?'selected':''}>% de victorias</option>
        <option value="ptos" ${window.sorteoCriterio==='ptos'?'selected':''}>Puntos de clasificación</option>
        <option value="gxp" ${window.sorteoCriterio==='gxp'?'selected':''}>Goles por partido (GxP)</option>
        <option value="random" ${window.sorteoCriterio==='random'?'selected':''}>Aleatorio</option>
      </select>
    </div>
    <p class="muted" style="font-size:12px;margin:12px 0 8px;">Elige los 10 jugadores convocados</p>
    <div class="grid-2">${selects}</div>
    <button class="btn btn-primary" style="width:100%;margin-top:14px;" onclick="generarSorteo()">🎲 Generar equipos</button>
    <div id="sorteo-resultado" style="margin-top:16px;"></div>
  `;
}
function generarSorteo(){
  const nombres = [];
  for (let i=0;i<10;i++){ const v = document.getElementById(`sorteo-${i}`).value; if (v) nombres.push(v); }
  if (nombres.length !== 10){ alert('Elige 10 jugadores distintos.'); return; }
  const criterio = document.getElementById('sorteo-criterio').value;
  window.sorteoCriterio = criterio;

  const valor = (n)=>{
    const s = statsJugador(n);
    if (criterio==='pv') return s.pj?s.pv:50;
    if (criterio==='ptos') return s.ptos;
    if (criterio==='gxp') return s.gxp;
    return Math.random();
  };
  const suplentes = nombres.filter(n=>esSustituto(n));
  const originales = nombres.filter(n=>!esSustituto(n));
  let ordenados = [...originales].sort((a,b)=>valor(b)-valor(a));

  const blanco=[], negro=[];
  let sumaBlanco=0, sumaNegro=0;
  ordenados.forEach(n=>{
    const v = valor(n);
    if (sumaBlanco<=sumaNegro){ blanco.push(n); sumaBlanco+=v; } else { negro.push(n); sumaNegro+=v; }
  });
  // repartir suplentes: al menos 1 en cada equipo si hay más de uno
  suplentes.forEach((n,i)=>{
    if (suplentes.length>1){ (i%2===0?blanco:negro).push(n); }
    else { (blanco.length<=negro.length?blanco:negro).push(n); }
  });

  document.getElementById('sorteo-resultado').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:10px;">
      <div class="team-col"><p class="muted center" style="font-size:11px;">BLANCO</p>
        ${blanco.map(n=>`<p style="margin:2px 0;">${n}${esSustituto(n)?' <span class="tag tag-muted">SUPL</span>':''}</p>`).join('')}
      </div>
      <div class="divider-v"></div>
      <div class="team-col"><p class="muted center" style="font-size:11px;">NEGRO</p>
        ${negro.map(n=>`<p style="margin:2px 0;">${n}${esSustituto(n)?' <span class="tag tag-muted">SUPL</span>':''}</p>`).join('')}
      </div>
    </div>`;
}
window.generarSorteo = generarSorteo;

function privadoExportar(){
  return `
    <p class="muted" style="font-size:12px;margin:0 0 14px;">Descarga una copia de seguridad legible de toda la temporada.</p>
    <div style="display:flex;flex-direction:column;gap:8px;max-width:320px;">
      <button class="btn" onclick="exportarExcel()">📊 Exportar temporada a Excel (CSV)</button>
      <button class="btn" onclick="window.print()">📄 Exportar temporada a PDF</button>
    </div>
  `;
}
function exportarExcel(){
  let csv = 'Jugador;PJ;PG;PE;PP;GF;Autogoles;%V;GxP;PTOS\n';
  jugadoresConPartidos().forEach(s=>{
    csv += `${s.nombre};${s.pj};${s.pg};${s.pe};${s.pp};${s.gf};${s.autog};${dec2(s.pv)};${dec2(s.gxp)};${s.ptos}\n`;
  });
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'pena_cpm_temporada.csv';
  link.click();
}
window.exportarExcel = exportarExcel;
