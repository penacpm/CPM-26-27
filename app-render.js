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
    .sort((a,b)=>b.numero-a.numero).slice(0,5)
    .map(c=>{ const jd = window.JORNADAS_DB[c.numero]; const m = calcularMarcador(jd); return {numero:c.numero, m}; });

  let html = '';
  if (prox){
    html += `<div class="card" style="margin-bottom:14px;">
      <p class="muted" style="font-size:12px;margin:0 0 8px;">Próximo partido</p>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;">
        <div style="display:flex;align-items:center;gap:14px;">
          <div class="logo-icon" style="width:40px;height:40px;">📅</div>
          <div>
            <p style="font-weight:500;font-size:16px;margin:0;">Jornada ${prox.numero} · ${fmtFecha(prox.fecha,true)}</p>
            <p class="secondary" style="font-size:13px;margin:4px 0 0;">📍 Pabellón Cerrillo de Maracena · 20:00</p>
          </div>
        </div>
        <div style="display:flex;gap:10px;">
          <div class="center"><p style="font-size:18px;font-weight:500;margin:0;" id="ic-d">-</p><p class="muted" style="font-size:9px;margin:0;">días</p></div>
          <div class="center"><p style="font-size:18px;font-weight:500;margin:0;" id="ic-h">-</p><p class="muted" style="font-size:9px;margin:0;">horas</p></div>
          <div class="center"><p style="font-size:18px;font-weight:500;margin:0;" id="ic-m">-</p><p class="muted" style="font-size:9px;margin:0;">min</p></div>
          <div class="center"><p style="font-size:18px;font-weight:500;margin:0;" id="ic-s">-</p><p class="muted" style="font-size:9px;margin:0;">seg</p></div>
        </div>
      </div>
    </div>`;
  } else {
    html += `<div class="card" style="margin-bottom:14px;"><p class="muted center">Temporada terminada</p></div>`;
  }

  html += `<div class="grid-3" style="margin-bottom:14px;">
    <div class="metric" style="background:var(--warning-bg);">
      <div class="l" style="color:var(--warning);">Líder</div>
      <div class="v" style="color:var(--warning);margin-top:4px;">${lider?lider.nombre:'-'}</div>
      <div class="l" style="color:var(--warning);margin-top:2px;">${lider?lider.ptos:0} pts</div>
    </div>
    <div class="metric" style="background:var(--danger-bg);">
      <div class="l" style="color:var(--danger);">Pichichi</div>
      <div class="v" style="color:var(--danger);margin-top:4px;">${pichichi?pichichi.nombre:'-'}</div>
      <div class="l" style="color:var(--danger);margin-top:2px;">${pichichi?pichichi.gf:0} goles</div>
    </div>
    <div class="metric" style="background:var(--success-bg);">
      <div class="l" style="color:var(--success);">Bote</div>
      <div class="v" style="color:var(--success);margin-top:4px;">${euros(bote)}</div>
    </div>
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
    html += `<div style="border:1px solid var(--border);border-radius:var(--radius);padding:8px 12px;margin-bottom:6px;text-align:center;">
      <span class="secondary" style="font-size:12px;">Jornada ${j.numero}</span><br>
      <span style="font-weight:500;">Blanco ${j.m.golesBlanco} – ${j.m.golesNegro} Negro</span>
    </div>`;
  });
  el.innerHTML = html;
  actualizarCuentaAtras('ic');
}
window.renderInicio = renderInicio;

/* ============================================================
   RENDER: CALENDARIO
   ============================================================ */
function calcularCuentaAtras(){
  const prox = proximaJornada();
  if (!prox) return null;
  const objetivo = new Date(prox.fecha); objetivo.setHours(20,0,0,0);
  const diff = Math.max(0, objetivo - new Date());
  return {
    d: Math.floor(diff/86400000),
    h: Math.floor((diff%86400000)/3600000),
    m: Math.floor((diff%3600000)/60000),
    s: Math.floor((diff%60000)/1000)
  };
}
function actualizarCuentaAtras(prefix){
  prefix = prefix || 'ca';
  const elD = document.getElementById(prefix+'-d');
  if (!elD) return;
  const c = calcularCuentaAtras();
  if (!c) return;
  document.getElementById(prefix+'-d').innerText = c.d;
  document.getElementById(prefix+'-h').innerText = String(c.h).padStart(2,'0');
  document.getElementById(prefix+'-m').innerText = String(c.m).padStart(2,'0');
  document.getElementById(prefix+'-s').innerText = String(c.s).padStart(2,'0');
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
      return `<div class="player-line"><span class="pname">${j.nombre}${supl}</span><span>${tags}</span></div>`;
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
  actualizarCuentaAtras('ca');
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
  const cascada = [(x)=>x.ptos, (x)=>x.gf, (x)=>x.pv, (x)=>x.gxp];
  function desempate(a,b){
    for (const g of cascada){
      const diff = (g(b)||0) - (g(a)||0);
      if (diff !== 0) return diff;
    }
    return (a.nombre||'').localeCompare(b.nombre||'');
  }
  const copia = [...lista].sort((a,b)=>{
    const va=f(a), vb=f(b);
    let cmp = (typeof va === 'string') ? va.localeCompare(vb) : va-vb;
    if (!asc) cmp = -cmp;
    return cmp !== 0 ? cmp : desempate(a,b);
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

function destacar(col, criterio){
  return col===criterio ? 'font-weight:700;color:var(--accent);' : '';
}

function renderClasificacion(){
  const el = document.getElementById('clasificacion');
  const crit = window.ordenClasif.criterio;
  const stats = ordenarLista(jugadoresConPartidos(), crit, window.ordenClasif.asc);
  let html = `<div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
    <select onchange="window.ordenClasif.criterio=this.value; renderClasificacion();" style="flex:1;min-width:150px;">
      ${['ptos','alfabetico','gf','pv','gxp','pj','pg','pp','pe'].map(v=>{
        const labels={ptos:'Puntos',alfabetico:'Alfabético',gf:'Goles',pv:'% Victorias',gxp:'Goles por partido',pj:'Partidos jugados',pg:'Victorias',pp:'Derrotas',pe:'Empates'};
        return `<option value="${v}" ${crit===v?'selected':''}>${labels[v]}</option>`;
      }).join('')}
    </select>
    <button class="btn" onclick="window.ordenClasif.asc=!window.ordenClasif.asc; renderClasificacion();">
      ${window.ordenClasif.asc?'⬆ Menor a mayor':'⬇ Mayor a menor'}
    </button>
  </div>`;

  html += `<div class="scrollx card" style="padding:0;">
    <div style="min-width:840px;">
      <div style="display:flex;align-items:center;gap:20px;padding:10px 16px;border-bottom:1px solid var(--border);">
        <span class="muted" style="width:22px;font-size:11px;">#</span>
        <span class="muted" style="width:110px;font-size:11px;${destacar('alfabetico',crit)}">Jugador</span>
        <span class="muted" style="width:120px;font-size:11px;">Últimos 5</span>
        <span class="muted" style="width:34px;font-size:11px;text-align:center;${destacar('pj',crit)}">PJ</span>
        <span class="muted" style="width:34px;font-size:11px;text-align:center;${destacar('pg',crit)}">PG</span>
        <span class="muted" style="width:34px;font-size:11px;text-align:center;${destacar('pe',crit)}">PE</span>
        <span class="muted" style="width:34px;font-size:11px;text-align:center;${destacar('pp',crit)}">PP</span>
        <span class="muted" style="width:44px;font-size:11px;text-align:center;${destacar('pv',crit)}">%V</span>
        <span class="muted" style="width:34px;font-size:11px;text-align:center;${destacar('gf',crit)}">GF</span>
        <span class="muted" style="width:44px;font-size:11px;text-align:center;${destacar('gxp',crit)}">GxP</span>
        <span class="muted" style="width:44px;font-size:11px;text-align:right;${destacar('ptos',crit)}">PTOS</span>
      </div>`;
  stats.forEach((s,i)=>{
    const supl = esSustituto(s.nombre) ? ` <span class="tag tag-accent" style="font-size:8px;">SUSTITUTO</span>` : '';
    html += `<div style="display:flex;align-items:center;gap:20px;padding:10px 16px;border-bottom:1px solid var(--border);">
      <span style="width:22px;">${medalOrPos(i)}</span>
      <span style="width:110px;font-weight:500;font-size:13px;${destacar('alfabetico',crit)}">${s.nombre}${supl}</span>
      <div style="width:120px;display:flex;gap:3px;">${ultimos5Circulos(s.hist,'estado')}</div>
      <span class="secondary" style="width:34px;text-align:center;font-size:12px;${destacar('pj',crit)}">${s.pj}</span>
      <span class="secondary" style="width:34px;text-align:center;font-size:12px;${destacar('pg',crit)}">${s.pg}</span>
      <span class="secondary" style="width:34px;text-align:center;font-size:12px;${destacar('pe',crit)}">${s.pe}</span>
      <span class="secondary" style="width:34px;text-align:center;font-size:12px;${destacar('pp',crit)}">${s.pp}</span>
      <span class="secondary" style="width:44px;text-align:center;font-size:12px;${destacar('pv',crit)}">${dec2(s.pv)}%</span>
      <span class="secondary" style="width:34px;text-align:center;font-size:12px;${destacar('gf',crit)}">${s.gf}</span>
      <span class="secondary" style="width:44px;text-align:center;font-size:12px;${destacar('gxp',crit)}">${dec2(s.gxp)}</span>
      <span style="width:44px;text-align:right;font-weight:500;font-size:14px;${destacar('ptos',crit)}">${s.ptos}</span>
    </div>`;
  });
  html += `</div></div>`;
  html += `<p class="muted" style="font-size:11px;margin:8px 0 0;">Criterios de desempate: Puntos → Goles → %V → GxP → Alfabético</p>`;

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
  const crit = window.ordenPichichi.criterio;
  const claves = {gf:(s)=>s.gf, gxp:(s)=>s.gxp};
  const stats = [...jugadoresConPartidos()].sort((a,b)=>{
    const va=claves[crit](a), vb=claves[crit](b);
    let cmp = window.ordenPichichi.asc ? va-vb : vb-va;
    if (cmp !== 0) return cmp;
    if (b.gxp !== a.gxp) return b.gxp - a.gxp; // desempate 1: mejor GxP
    return a.nombre.localeCompare(b.nombre); // desempate 2: alfabético
  });
  let html = `<div style="display:flex;gap:8px;margin-bottom:12px;">
    <select onchange="window.ordenPichichi.criterio=this.value; renderPichichi();" style="flex:1;">
      <option value="gf" ${crit==='gf'?'selected':''}>Goles</option>
      <option value="gxp" ${crit==='gxp'?'selected':''}>GxP</option>
    </select>
    <button class="btn" onclick="window.ordenPichichi.asc=!window.ordenPichichi.asc; renderPichichi();">
      ${window.ordenPichichi.asc?'⬆ Menor a mayor':'⬇ Mayor a menor'}
    </button>
  </div>`;
  html += `<div style="display:flex;align-items:center;gap:14px;padding:8px 12px;border-bottom:1px solid var(--border);">
    <span class="muted" style="width:22px;font-size:11px;">#</span>
    <span class="muted" style="width:90px;font-size:11px;">Jugador</span>
    <span class="muted" style="font-size:11px;">Últimos 5</span>
    <span class="muted" style="margin-left:auto;font-size:11px;">PJ</span>
    <span class="muted" style="width:44px;font-size:11px;text-align:center;${destacar('gxp',crit)}">GxP</span>
    <span class="muted" style="width:40px;font-size:11px;text-align:right;${destacar('gf',crit)}">Goles</span>
  </div>`;
  stats.forEach((s,i)=>{
    html += `<div class="card" style="display:flex;align-items:center;gap:14px;margin-top:8px;padding:10px 12px;">
      <span style="width:22px;">${medalOrPos(i)}</span>
      <span style="width:90px;font-weight:500;font-size:13px;">${s.nombre}</span>
      <div style="display:flex;gap:3px;">${ultimos5Circulos(s.hist,'goles')}</div>
      <span class="secondary" style="margin-left:auto;font-size:12px;">${s.pj}</span>
      <span class="secondary" style="width:44px;text-align:center;font-size:12px;${destacar('gxp',crit)}">${dec2(s.gxp)}</span>
      <span style="width:40px;text-align:right;font-weight:500;font-size:15px;${destacar('gf',crit)}">${s.gf}</span>
    </div>`;
  });
  html += `<p class="muted" style="font-size:11px;margin:8px 0 0;">Criterios de desempate: Goles → GxP → Alfabético</p>`;
  el.innerHTML = html;
}
window.renderPichichi = renderPichichi;

/* ============================================================
   RENDER: RACHAS
   ============================================================ */
f
