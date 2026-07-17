/* ================= catálogo de revistas prototipadas ================= */
const MAGS=[
  {id:'n2',file:'Revista EDEM N2.html',print:'Revista EDEM N2.html',nr:'Nº 2 · 2026',title:'Tracción',chip:'Nº 2 · Tracción',badge:'Última edición',badgeBg:'var(--coral)',desc:'Crónica del Hackathon, entrevista cruzada alumno × CEO, radar Lanzadera, métricas de Angels y pasatiempos.',meta:'24 páginas · Bodoni Black · 2026'},
  {id:'n1v2',file:'Revista EDEM N1 v2.html',print:'Revista EDEM N1 v2-print.html',nr:'Nº 1 · v2',title:'Bienvenidos a EDEM',chip:'Nº 1 · v2',badge:'Contracorriente',badgeBg:'var(--teal)',desc:'La dirección de arte definitiva del Nº 1: tipografía brutal, sellos, radar Lanzadera y duotonos.',meta:'10 páginas · dirección de arte v2'},
  {id:'n1',file:'Revista EDEM N1.html',print:'Revista EDEM N1-print.html',nr:'Nº 1',title:'Bienvenidos a EDEM',chip:'Nº 1 · maqueta',badge:'Primera maqueta',badgeBg:'var(--indigo)',desc:'La primera maqueta del piloto: el manual de supervivencia en la Marina, de portada a contraportada.',meta:'10 páginas · maqueta inicial'}
];
const ART=[
  {bg:'var(--teal)',cat:'Pasillo EDEM',title:'El Hackathon desde dentro: 48 horas a toda máquina',ex:'Crónica en primera persona del fin de semana en el que 120 alumnos convirtieron café y post-its en cinco empresas reales.',pg:4,img:'https://edem.eu/wp-content/uploads/2026/04/EDEM_Home_Perfil_EE.jpg'},
  {bg:'var(--coral)',cat:'Radar Lanzadera',title:'3 startups de Lanzadera rompiendo moldes',ex:'Del muelle al mercado global: las apuestas del último cohorte que ya mueven el Mediterráneo.',pg:12,img:'https://edem.eu/wp-content/uploads/2026/04/EDEM_Home_intro_grados.jpg'},
  {bg:'var(--indigo)',cat:'Angels',title:'Los secretos de Angels para medir el éxito',ex:'Las métricas que un inversor mira antes que cualquier promesa — y las que ignora por completo.',pg:14,img:'https://edem.eu/wp-content/uploads/2026/04/EDEM_Home_talento.jpg'}
];

const RES=window.__resources||{};
const SWAPS={'../../assets/edem-logo-white.png':'logoW','../../assets/edem-logo.png':'logoD'};
function sw(x){for(const u in SWAPS){if(RES[SWAPS[u]])x=x.split(u).join(RES[SWAPS[u]]);}return x;}
/* ================= carga y troceado de cada revista real ================= */
async function loadIssue(m){
  if(m.data)return m.data;
  if(m.loading)return m.loading;
  m.loading=(async()=>{
    const txt=await(await fetch(RES['mag_'+m.id]||encodeURI(m.file))).text();
    const doc=new DOMParser().parseFromString(txt,'text/html');
    const links=[...document.head.querySelectorAll('style,link[rel="stylesheet"]')].map(n=>n.outerHTML).join('');
    const styles=[...doc.querySelectorAll('head style')].map(s=>s.outerHTML).join('');
    const secs=[...doc.querySelectorAll('section.page')];
    const pages=secs.map(s=>sw(s.outerHTML));
    const labels=secs.map((s,i)=>(s.dataset.screenLabel||('Página '+(i+1))).replace(/^\d+\s*/,''));
    const head=links+styles+'<style>html,body{margin:0!important;padding:0!important;background:#fff!important;overflow:hidden!important}section.page{box-shadow:none!important}</style>';
    m.data={pages,labels,head,n:pages.length};
    const imgs=[...new Set((pages.join('').match(/src="([^"]+)"/g)||[]).map(x=>x.slice(5,-1)))];
    imgs.forEach(u=>{const im=new Image();im.src=u;});
    return m.data;
  })();
  return m.loading;
}
function pageDoc(m,i){return '<!DOCTYPE html><html><head>'+m.data.head+'</head><body>'+m.data.pages[i]+'</body></html>';}
function mkPage(m,i){
  const w=document.createElement('div');w.className='pg';
  if(i==null){w.classList.add('void');return{el:w,ready:Promise.resolve()};}
  const f=document.createElement('iframe');f.setAttribute('tabindex','-1');f.setAttribute('aria-hidden','true');f.setAttribute('scrolling','no');f.title='Página '+(i+1);
  const ready=new Promise(res=>{
    let done=false;const ok=()=>{if(!done){done=true;res();}};
    f.addEventListener('load',()=>{try{f.contentDocument.fonts.ready.then(ok);}catch(e){ok();}setTimeout(ok,380);});
    setTimeout(ok,1600);
  });
  f.srcdoc=pageDoc(m,i);
  w.appendChild(f);return{el:w,ready};
}

/* ================= portadas vivas en home y kiosko ================= */
const slotRO=new ResizeObserver(es=>es.forEach(e=>fitSlot(e.target)));
function fitSlot(sl){const pg=sl.querySelector('.pg');if(pg)pg.style.transform='scale('+(sl.clientWidth/794)+')';}
async function mountCovers(){
  for(const m of MAGS){
    try{
      await loadIssue(m);
      document.querySelectorAll('.coverslot[data-mag="'+m.id+'"]').forEach(sl=>{
        sl.replaceChildren(mkPage(m,0).el);fitSlot(sl);slotRO.observe(sl);
      });
    }catch(e){console.warn('No se pudo cargar',m.file,e);}
  }
}

/* ================= home: kiosko + artículos ================= */
document.getElementById('kgrid').innerHTML=MAGS.map(m=>
  '<article class="kcard">'+
  '<div class="kcv"><span class="kbadge" style="background:'+m.badgeBg+'">'+m.badge+'</span>'+
  '<div class="coverslot" data-mag="'+m.id+'" onclick="openVisor(\''+m.id+'\')" title="Leer en el visor"><span class="cslabel">portada '+m.nr+'</span></div></div>'+
  '<div class="kbody"><span class="nr">'+m.nr+'</span><h3 class="disp">'+m.title+'</h3><p>'+m.desc+'</p><span class="kmeta">'+m.meta+'</span>'+
  '<div class="kacts"><button class="btn pri" onclick="openVisor(\''+m.id+'\')"><i data-lucide="book-open" class="lu"></i> Leer</button></div></div></article>').join('');
document.getElementById('agrid').innerHTML=sw(ART.map(a=>
  '<article class="acard" onclick="openVisor(\'n2\','+(a.pg-1)+')">'+
  '<div class="im"><img src="'+a.img+'" onerror="this.style.opacity=0" alt=""></div>'+
  '<div class="abody"><span class="abadge" style="background:'+a.bg+'">'+a.cat+'</span>'+
  '<h3 class="disp">'+a.title+'</h3><p>'+a.ex+'</p>'+
  '<div class="afoot"><span class="go">Leer en el visor <i data-lucide="arrow-right" class="lu" style="width:15px;height:15px"></i></span><span class="pnum">pág. '+String(a.pg).padStart(2,'0')+'</span></div></div></article>').join(''));
function subscribe(e){e.preventDefault();document.getElementById('sub-msg').textContent='¡Bienvenido a bordo! Revisa tu correo ⚓';e.target.reset();return false;}

/* ================= visor flipbook ================= */
const visor=document.getElementById('visor'),stage=document.getElementById('v-stage'),bookouter=document.getElementById('bookouter'),book=document.getElementById('book');
const halfL=document.getElementById('half-l'),halfR=document.getElementById('half-r'),host=document.getElementById('host'),spine=document.getElementById('spine');
let M=null,SP=[],cur=0,animating=false,scale=1;
function spreadsOf(n){const a=[[null,0]];for(let p=1;p<n;p+=2)a.push([p,p+1<n?p+1:null]);return a;}
function spreadOf(i){return i<=0?0:Math.floor((i+1)/2);}
function setHalf(half,item){half.replaceChildren(item.el);half.classList.toggle('void',item.el.classList.contains('void'));}
function curOffset(){if(!SP.length)return 0;const[l,r]=SP[cur];return l==null?-397:(r==null?397:0);}
function fitBook(){
  const r=stage.getBoundingClientRect();
  scale=Math.min((r.width-150)/1588,(r.height-40)/1123,1);
  bookouter.style.width=1588*scale+'px';bookouter.style.height=1123*scale+'px';
  book.style.transform='scale('+scale+') translateX('+curOffset()+'px)';
}
function updateChrome(){
  const n=M.data.n,[l,r]=SP[cur];
  document.getElementById('v-ind').textContent=cur===0?'Portada · '+n+' págs':(r==null?'Contraportada':'Págs. '+(l+1)+'–'+(r+1)+' de '+n);
  document.getElementById('v-prev').disabled=cur===0||animating;
  document.getElementById('v-next').disabled=cur===SP.length-1||animating;
  document.getElementById('v-dots').innerHTML=SP.map((_,i)=>'<button class="vdot'+(i===cur?' on':'')+'" aria-label="Ir al pliego '+(i+1)+'" onclick="jump('+i+')"></button>').join('');
  const sel=document.getElementById('v-goto');sel.value=String(l==null?r:l);
  fitBook();
}
function render(){
  const[l,r]=SP[cur];
  setHalf(halfL,mkPage(M,l));setHalf(halfR,mkPage(M,r));
  spine.classList.toggle('off',l==null||r==null);
  host.replaceChildren();updateChrome();
}
function jump(s){if(animating||s===cur||!M)return;cur=s;render();}
async function turn(dir){
  if(animating||!M)return;
  const t=cur+dir;if(t<0||t>=SP.length)return;
  animating=true;updateChrome();
  const fw=dir>0,[cl,cr]=SP[cur],[tl,tr]=SP[t];
  const under=mkPage(M,fw?tr:tl);
  setHalf(fw?halfR:halfL,under);
  const front=mkPage(M,fw?cr:cl),back=mkPage(M,fw?tl:tr);
  const leaf=document.createElement('div');leaf.className='leaf';
  leaf.style.cssText=(fw?'right:0;':'left:0;')+'transform-origin:'+(fw?'left':'right')+' center;transform:rotateY(0deg);';
  const f1=document.createElement('div');f1.className='face';f1.appendChild(front.el);f1.insertAdjacentHTML('beforeend','<div class="shade"></div>');
  const f2=document.createElement('div');f2.className='face back';f2.appendChild(back.el);f2.insertAdjacentHTML('beforeend','<div class="shade"></div>');
  leaf.append(f1,f2);host.appendChild(leaf);
  spine.classList.toggle('off',tl==null||tr==null);
  await Promise.all([under.ready,front.ready,back.ready]);
  cur=t;fitBook();
  requestAnimationFrame(()=>requestAnimationFrame(()=>{leaf.style.transform='rotateY('+(fw?-180:180)+'deg)';}));
  await new Promise(res=>setTimeout(res,850));
  const land=mkPage(M,fw?tl:tr);
  setHalf(fw?halfL:halfR,land);
  await land.ready;
  host.replaceChildren();animating=false;updateChrome();
}
async function setIssue(id,pageIdx){
  const m=MAGS.find(x=>x.id===id);if(!m)return;
  document.querySelectorAll('.vchip').forEach(c=>c.classList.toggle('on',c.dataset.id===id));
  const load=document.getElementById('v-load');
  if(!m.data){load.hidden=false;}
  try{await loadIssue(m);}catch(e){load.hidden=true;document.getElementById('v-ind').textContent='No se pudo cargar la edición';return;}
  load.hidden=true;
  M=m;SP=spreadsOf(m.data.n);cur=spreadOf(Math.min(pageIdx,m.data.n-1));
  const sel=document.getElementById('v-goto');
  sel.innerHTML=m.data.labels.map((lb,i)=>'<option value="'+i+'">'+String(i+1).padStart(2,'0')+' · '+lb+'</option>').join('');
  render();
}
function openVisor(id,pageIdx=0){
  visor.hidden=false;document.body.classList.add('lock');
  setIssue(id,pageIdx);
  lucide.createIcons();
  requestAnimationFrame(fitBook);
}
function closeVisor(){visor.hidden=true;document.body.classList.remove('lock');}
document.getElementById('v-issues').innerHTML=MAGS.map(m=>'<button class="vchip" data-id="'+m.id+'" onclick="setIssue(\''+m.id+'\',0)">'+m.chip+'</button>').join('');
document.getElementById('v-next').addEventListener('click',()=>turn(1));
document.getElementById('v-prev').addEventListener('click',()=>turn(-1));
document.getElementById('v-goto').addEventListener('change',e=>jump(spreadOf(+e.target.value)));
halfR.addEventListener('click',()=>turn(1));
halfL.addEventListener('click',()=>turn(-1));
document.addEventListener('keydown',e=>{
  if(visor.hidden)return;
  if(e.key==='ArrowRight')turn(1);else if(e.key==='ArrowLeft')turn(-1);else if(e.key==='Escape')closeVisor();
});
new ResizeObserver(fitBook).observe(stage);
window.addEventListener('resize',fitBook);
lucide.createIcons();
mountCovers();
