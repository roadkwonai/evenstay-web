// Extracts outlines from the official Pretendard v1.3.9 static OTFs (public/static/ in the release zip; not kept in the repo). Needs opentype.js@1.3.4. Writes glyphs.json.
// 홈·패밀리: Bold at 88, so the Hangul is as tall as the old Home/Family lockup (1.46 x-height) and its stems read close to the wordmark's.
const opentype=require('opentype.js');const fs=require('fs');
function shape(file,text,size,track){const f=opentype.loadSync(file);let x=0;const paths=[];const glyphs=f.stringToGlyphs(text);
 let minY=1e9,maxY=-1e9,maxX=0;glyphs.forEach((g,i)=>{const p=g.getPath(x,0,size);paths.push(p.toPathData(2));const b=p.getBoundingBox();if(b.y1<b.y2){minY=Math.min(minY,b.y1);maxY=Math.max(maxY,b.y2);maxX=Math.max(maxX,b.x2);}x+=g.advanceWidth*size/f.unitsPerEm+(i<glyphs.length-1?track*size:0);});
 return {d:paths.join(''),advance:x,minY,maxY,maxX,xHeight:f.tables.os2.sxHeight*size/f.unitsPerEm,capHeight:f.tables.os2.sCapHeight*size/f.unitsPerEm,upm:f.unitsPerEm};}
const out={word:shape('Pretendard-Bold.otf','evenstay',100,-0.02),home:shape('Pretendard-Bold.otf','홈',88,-0.01),family:shape('Pretendard-Bold.otf','패밀리',88,-0.01),cap:shape('Pretendard-Bold.otf','E',100,0)};
fs.writeFileSync('glyphs.json',JSON.stringify(out));for(const[k,v]of Object.entries(out))console.log(k,v.advance.toFixed(1),'xh',v.xHeight.toFixed(1),'cap',v.capHeight.toFixed(1),'len',v.d.length);
