function hexToRgb(hex) {
  hex = hex.replace(/^#/,'');
  if (hex.length===3) hex = hex.split('').map(c=>c+c).join('');
  if (hex.length!==6) return null;
  const n = parseInt(hex,16);
  if (isNaN(n)) return null;
  return {r:(n>>16)&255, g:(n>>8)&255, b:n&255};
}
function rgbToHex(r,g,b) { return [r,g,b].map(v=>Math.round(v).toString(16).padStart(2,'0')).join(''); }
function rgbToHsl(r,g,b) {
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b);
  let h,s,l=(max+min)/2;
  if (max===min) { h=s=0; } else {
    const d=max-min;
    s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max) {
      case r: h=((g-b)/d+(g<b?6:0))/6; break;
      case g: h=((b-r)/d+2)/6; break;
      case b: h=((r-g)/d+4)/6; break;
    }
  }
  return {h:Math.round(h*360), s:Math.round(s*100), l:Math.round(l*100)};
}
function hslToRgb(h,s,l) {
  h/=360; s/=100; l/=100;
  let r,g,b;
  if (s===0) { r=g=b=l; } else {
    const hue2rgb=(p,q,t)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};
    const q=l<0.5?l*(1+s):l+s-l*s, p=2*l-q;
    r=hue2rgb(p,q,h+1/3); g=hue2rgb(p,q,h); b=hue2rgb(p,q,h-1/3);
  }
  return {r:Math.round(r*255), g:Math.round(g*255), b:Math.round(b*255)};
}
function luminance(r,g,b) {
  return [r,g,b].reduce((acc,v,i)=>{v/=255;v=v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);return acc+v*[0.2126,0.7152,0.0722][i];},0);
}
function contrastRatio(c1,c2) {
  const l1=luminance(c1.r,c1.g,c1.b), l2=luminance(c2.r,c2.g,c2.b);
  return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05);
}
 
const state = { bg:{h:240,s:36,l:14}, fg:{h:253,s:100,l:93} };
 
const CVD_TYPES = [
  { id:'protanopia',    name:'Protanopia',    sub:'sin rojo · ~1% ♂',    m:[[0.56667,0.43333,0],[0.55833,0.44167,0],[0,0.24167,0.75833]] },
  { id:'deuteranopia',  name:'Deuteranopia',  sub:'sin verde · ~1% ♂',   m:[[0.625,0.375,0],[0.7,0.3,0],[0,0.3,0.7]] },
  { id:'tritanopia',    name:'Tritanopia',    sub:'sin azul · ~0.01%',   m:[[0.95,0.05,0],[0,0.43333,0.56667],[0,0.475,0.525]] },
  { id:'protanomaly',   name:'Protanomalía',  sub:'rojo débil · ~1% ♂',  m:[[0.81667,0.18333,0],[0.33333,0.66667,0],[0,0.125,0.875]] },
  { id:'deuteranomaly', name:'Deuteranomalía',sub:'verde débil · ~5% ♂', m:[[0.8,0.2,0],[0.25833,0.74167,0],[0,0.14167,0.85833]] },
  { id:'achromatopsia', name:'Acromatopsia',  sub:'sin color · muy raro', m:[[0.299,0.587,0.114],[0.299,0.587,0.114],[0.299,0.587,0.114]] }
];
 
let activeCvd = null;
 
function applyMatrix(rgb, m) {
  const r=rgb.r/255, g=rgb.g/255, b=rgb.b/255;
  const cl=v=>Math.round(Math.min(255,Math.max(0,v*255)));
  return {r:cl(m[0][0]*r+m[0][1]*g+m[0][2]*b), g:cl(m[1][0]*r+m[1][1]*g+m[1][2]*b), b:cl(m[2][0]*r+m[2][1]*g+m[2][2]*b)};
}
function getSimColors() {
  const bg=hslToRgb(state.bg.h,state.bg.s,state.bg.l);
  const fg=hslToRgb(state.fg.h,state.fg.s,state.fg.l);
  if (!activeCvd) return {bg,fg};
  const cvd=CVD_TYPES.find(c=>c.id===activeCvd);
  return {bg:applyMatrix(bg,cvd.m), fg:applyMatrix(fg,cvd.m)};
}
function renderSwatchPairs() {
  const bg=hslToRgb(state.bg.h,state.bg.s,state.bg.l);
  const fg=hslToRgb(state.fg.h,state.fg.s,state.fg.l);
  CVD_TYPES.forEach(cvd=>{
    const sb=applyMatrix(bg,cvd.m), sf=applyMatrix(fg,cvd.m);
    const pair=document.querySelector('#cvdbtn-'+cvd.id+' .cvd-swatch-pair');
    if (pair) {
      pair.children[0].style.background='#'+rgbToHex(sb.r,sb.g,sb.b);
      pair.children[1].style.background='#'+rgbToHex(sf.r,sf.g,sf.b);
    }
  });
}
function setbadge(id,pass,cls) {
  document.getElementById(id).className='badge '+(pass?cls:'fail');
}
function updatePreview() {
  const {bg,fg}=getSimColors();
  const bgHex='#'+rgbToHex(bg.r,bg.g,bg.b);
  const fgHex='#'+rgbToHex(fg.r,fg.g,fg.b);
  const ratio=contrastRatio(bg,fg);
  const ratioEl=document.getElementById('ratio-num');
  ratioEl.textContent=ratio.toFixed(2)+':1';
  const pA=ratio>=3, pAA=ratio>=4.5, pAAA=ratio>=7;
  ratioEl.style.color=pAAA?'#3b9fd4':pAA?'#4caf82':pA?'#f0a500':'#ff6a6a';
  setbadge('badge-a',pA,'pass-a');
  setbadge('badge-aa',pAA,'pass-aa');
  setbadge('badge-aaa',pAAA,'pass-aaa');
  document.getElementById('preview-stage').style.background=bgHex;
  ['prev-large','prev-normal','prev-small'].forEach(id=>document.getElementById(id).style.color=fgHex);
  const sh=document.getElementById('prev-shape');
  sh.style.background=fgHex; sh.style.color=bgHex; sh.style.border='2px solid '+fgHex;
  renderSwatchPairs();
}
function updateSliderGradients(side) {
  const h=state[side];
  document.getElementById('h-'+side).style.background='linear-gradient(to right,hsl(0,80%,50%),hsl(60,80%,50%),hsl(120,80%,50%),hsl(180,80%,50%),hsl(240,80%,50%),hsl(300,80%,50%),hsl(360,80%,50%))';
  document.getElementById('s-'+side).style.background='linear-gradient(to right,hsl('+h.h+',0%,'+h.l+'%),hsl('+h.h+',100%,'+h.l+'%))';
  document.getElementById('l-'+side).style.background='linear-gradient(to right,hsl('+h.h+','+h.s+'%,0%),hsl('+h.h+','+h.s+'%,50%),hsl('+h.h+','+h.s+'%,100%))';
}
function updateHslSliders(side) {
  const hsl=state[side];
  ['h','s','l'].forEach(ax=>{
    document.getElementById(ax+'-'+side).value=hsl[ax];
    document.getElementById(ax+'v-'+side).textContent=hsl[ax]+(ax==='h'?'°':'%');
  });
  const rgb=hslToRgb(hsl.h,hsl.s,hsl.l);
  const hex=rgbToHex(rgb.r,rgb.g,rgb.b);
  document.getElementById('hex-'+side).value=hex.toUpperCase();
  document.getElementById('swatch-'+side).style.background='#'+hex;
  document.getElementById('picker-'+side).value='#'+hex;
  updateSliderGradients(side);
  updatePreview();
}
['bg','fg'].forEach(side=>{
  ['h','s','l'].forEach(ax=>{
    document.getElementById(ax+'-'+side).addEventListener('input',function(){
      state[side][ax]=parseInt(this.value);
      document.getElementById(ax+'v-'+side).textContent=this.value+(ax==='h'?'°':'%');
      const rgb=hslToRgb(state[side].h,state[side].s,state[side].l);
      const hex=rgbToHex(rgb.r,rgb.g,rgb.b);
      document.getElementById('hex-'+side).value=hex.toUpperCase();
      document.getElementById('swatch-'+side).style.background='#'+hex;
      document.getElementById('picker-'+side).value='#'+hex;
      updateSliderGradients(side);
      updatePreview();
    });
  });
  document.getElementById('hex-'+side).addEventListener('input',function(){
    let val=this.value.replace(/[^0-9a-fA-F]/g,'').slice(0,6);
    this.value=val.toUpperCase();
    if (val.length===6) {
      const rgb=hexToRgb(val);
      if (rgb) { this.classList.remove('invalid'); state[side]=rgbToHsl(rgb.r,rgb.g,rgb.b); updateHslSliders(side); }
      else this.classList.add('invalid');
    } else this.classList.add('invalid');
  });
  document.getElementById('picker-'+side).addEventListener('input',function(){
    const rgb=hexToRgb(this.value.slice(1));
    if (rgb) { state[side]=rgbToHsl(rgb.r,rgb.g,rgb.b); updateHslSliders(side); }
  });
});
(function buildCvdGrid(){
  const grid=document.getElementById('cvd-grid');
  CVD_TYPES.forEach(cvd=>{
    const btn=document.createElement('button');
    btn.className='cvd-btn'; btn.id='cvdbtn-'+cvd.id;
    btn.innerHTML='<span class="cvd-name">'+cvd.name+'</span><span class="cvd-sub">'+cvd.sub+'</span><div class="cvd-swatch-pair"><div class="cvd-dot"></div><div class="cvd-dot"></div></div>';
    btn.addEventListener('click',()=>{
      activeCvd=activeCvd===cvd.id?null:cvd.id;
      document.querySelectorAll('.cvd-btn').forEach(b=>b.classList.remove('active'));
      if (activeCvd) btn.classList.add('active');
      document.getElementById('cvd-active-label').textContent=activeCvd?'Simulando: '+cvd.name:'';
      updatePreview();
    });
    grid.appendChild(btn);
  });
})();
document.getElementById('cvd-reset').addEventListener('click',()=>{
  activeCvd=null;
  document.querySelectorAll('.cvd-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('cvd-active-label').textContent='';
  updatePreview();
});
updateHslSliders('bg');
updateHslSliders('fg');