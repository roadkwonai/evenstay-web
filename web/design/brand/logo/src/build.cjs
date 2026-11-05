// Builds every logo SVG in ../ from glyphs.json. Usage: node design/brand/logo/src/build.cjs
const fs=require('fs');const G=require('./glyphs.json');const OUT=require('path').join(__dirname,'..');fs.mkdirSync(OUT,{recursive:true});
const C={light:{a:'#17191C',b:'#2340A0',fill:'#F3D766',sub:'#555A60'},dark:{a:'#F4F4F1',b:'#8EA6F0',fill:'#F3D766',sub:'#AEB2B8'},black:{a:'#17191C',b:'#17191C',fill:null,sub:'#17191C'},white:{a:'#FEFEFC',b:'#FEFEFC',fill:null,sub:'#FEFEFC'}};
// symbol in its own 62x62 box (regular: stroke 6, side 38; small: stroke 8, side 36)
function symbol(c,{small=false}={}){const s=small?8:6,a=small?36:38,o=18,r=8,ir=r-s/2;const A=s/2,B=s/2+o;
 const lo=B+s/2,hi=A+a-s/2; // overlap of the two interiors
 const fill=c.fill?`<path d="M${lo+ir} ${lo}H${hi}V${hi-ir}A${ir} ${ir} 0 0 1 ${hi-ir} ${hi}H${lo}V${lo+ir}A${ir} ${ir} 0 0 1 ${lo+ir} ${lo}Z" fill="${c.fill}"/>`:'';
 return `${fill}<rect x="${A}" y="${A}" width="${a}" height="${a}" rx="${r}" fill="none" stroke="${c.a}" stroke-width="${s}"/><rect x="${B}" y="${B}" width="${a}" height="${a}" rx="${r}" fill="none" stroke="${c.b}" stroke-width="${s}"/>`;}
const svg=(w,h,body,title,vb)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb||`0 0 ${w} ${h}`}" width="${w}" height="${h}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;
const r1=v=>Math.round(v*100)/100;
// horizontal lockup (product word 0.66 x-height after the wordmark advance, about 39 visible): symbol height = 72 (1.36 x-height), centred on the x-height middle; gap 28. viewBox hugs the real outlines.
function lockup(c,sub){const H=72,k=H/62,cy=-G.word.xHeight/2,top=cy-H/2,gap=28,wx=H+gap;
 let w=wx+G.word.maxX,minY=Math.min(top,G.word.minY),maxY=Math.max(top+H,G.word.maxY),extra='';
 if(sub){const sx=wx+G.word.advance+G.word.xHeight*0.66;extra=`<g transform="translate(${r1(sx)} 0)" fill="${c.sub}"><path d="${G[sub].d}"/></g>`;w=sx+G[sub].maxX;minY=Math.min(minY,G[sub].minY);maxY=Math.max(maxY,G[sub].maxY);}
 const body=`<g transform="translate(0 ${r1(top)}) scale(${r1(k*1000)/1000})">${symbol(c)}</g><g transform="translate(${wx} 0)" fill="${c.a}"><path d="${G.word.d}"/></g>${extra}`;
 return {w:r1(w),body,vb:`0 ${r1(minY)} ${r1(w)} ${r1(maxY-minY)}`};}
// stacked: symbol above, wordmark centred; viewBox hugs the outlines
function stacked(c){const H=120,k=H/62,gap=36,ww=G.word.maxX,W=Math.max(ww,H);const sx=(W-H)/2,wx=(W-ww)/2,base=H+gap-G.word.minY;
 return {W,Hh:base+G.word.maxY,body:`<g transform="translate(${r1(sx)} 0) scale(${r1(k*1000)/1000})">${symbol(c)}</g><g transform="translate(${r1(wx)} ${r1(base)})" fill="${c.a}"><path d="${G.word.d}"/></g>`};}
const files=[];const put=(n,s)=>{fs.writeFileSync(`${OUT}/${n}`,s);files.push(n);};
for(const[k,c]of Object.entries(C)){
 put(`evenstay-symbol-${k}.svg`,svg(62,62,symbol(c),'Evenstay'));
 const l=lockup(c);put(`evenstay-logo-${k}.svg`,svg(l.w,0,l.body,'Evenstay',l.vb).replace(` height="0"`,''));
 for(const sub of ['home','family']){const l2=lockup(c,sub);put(`evenstay-${sub}-logo-${k}.svg`,svg(l2.w,0,l2.body,sub==='home'?'Evenstay 홈':'Evenstay 패밀리',l2.vb).replace(` height="0"`,''));}
 const st=stacked(c);put(`evenstay-logo-stacked-${k}.svg`,svg(r1(st.W),r1(st.Hh),st.body,'Evenstay'));
}
// small symbol for 16-32px
put('evenstay-symbol-small-light.svg',svg(62,62,symbol(C.light,{small:true}),'Evenstay'));
// favicon: thick strokes, follows the browser colour scheme
const fav=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -3 68 68"><style>.a{stroke:#17191C}.b{stroke:#2340A0}@media (prefers-color-scheme:dark){.a{stroke:#F4F4F1}.b{stroke:#8EA6F0}}</style>${symbol({a:'X',b:'Y',fill:'#F3D766'},{small:true}).replace('stroke="X"','class="a"').replace('stroke="Y"','class="b"')}</svg>\n`;
put('favicon.svg',fav);
// app icon: cobalt field, paper + yellow strokes, symbol at 52% of the canvas (inside the 80% maskable safe zone)
function appIcon(size,{rounded=false}={}){const S=1024,k=S*0.52/62,off=(S-62*k)/2;return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${size}" height="${size}" role="img" aria-label="Evenstay 홈"><title>Evenstay 홈</title><rect width="${S}" height="${S}" ${rounded?'rx="224"':''} fill="#2340A0"/><g transform="translate(${r1(off)} ${r1(off)}) scale(${r1(k*1000)/1000})">${symbol({a:'#FAFAF7',b:'#F3D766',fill:null})}</g></svg>\n`;}
put('app-icon.svg',appIcon(1024));put('app-icon-rounded.svg',appIcon(1024,{rounded:true}));
console.log(files.length,'files');
