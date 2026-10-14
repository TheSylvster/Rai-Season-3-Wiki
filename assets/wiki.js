/*
 * ==================== RAI SEASON 3 WIKI ====================
 *
 * Builds every page of the wiki from assets/content.js, in the same
 * "liquid glass" style as InterPhyr Modern: a slowly drifting
 * background, clear glass panels, a sliding glass lens in the menu,
 * a melting phone menu, smooth travel and animated page changes.
 *
 * Each page's index.html only says which page it is
 * (<body data-page="industrial/muskets">) and loads this file. Moving
 * between pages happens in place, without loading a new page.
 *
 * Motion rule: nothing jumps or snaps; everything that moves, opens or
 * closes animates (instantly for visitors who prefer reduced motion).
 */

(function(){

var WIKI=window.WIKI;
var siteRoot=new URL("../",document.currentScript.src).href;
var imageRoot=siteRoot+"images/";

/* The menu bar: Home and the four branches. */
/* The wiki's logo: the Rai server emblem. */
var BLOCK_MARK='<img class="w-logo-mark" src="'+siteRoot+'images/rai-logo.png" alt="" width="34" height="32">';

var NAV=WIKI.sections.map(function(s){return {label:s.label,path:s.path};});

var PAGES={};
WIKI.pages.forEach(function(p){PAGES[p.path]=p;});

function urlOf(path){
return siteRoot+(path?path+"/":"");
}

/* The branch a page belongs to ("" for the home page). */
function sectionOf(path){
return path?path.split("/")[0]:"";
}

function accentOf(path){
var section=sectionOf(path);
for(var i=0;i<WIKI.sections.length;i++){
if(WIKI.sections[i].path===section)return WIKI.sections[i].accent||"#8fa2ff";
}
return "#8fa2ff";
}

function childrenOf(path){
return WIKI.pages.filter(function(p){return p.parent===path&&p.path!==path;});
}

function escapeHtml(s){
return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

/* Turns {{path|label}} in content text into links to other wiki pages. */
function links(html){
return String(html).replace(/\{\{([^|}]*)\|([^}]*)\}\}/g,function(all,path,label){
return '<a href="'+urlOf(path)+'">'+label+'</a>';
});
}

/* Plain text of a content string, for search and summaries. */
function plain(html){
return String(html).replace(/\{\{[^|}]*\|([^}]*)\}\}/g,"$1").replace(/<[^>]*>/g,"");
}


function el(tag,className,html){
var node=document.createElement(tag);
if(className)node.className=className;
if(html!=null)node.innerHTML=html;
return node;
}

function text(node){
return node?node.textContent.replace(/\s+/g," ").trim():"";
}

/* ---------- Page frame ---------- */

/*
 * The background: a blocky Minecraft-style landscape at dusk (stepped
 * hills, a pixel sun, stars and clouds), drawn for the screen size so
 * it is always sharp. InterPhyr Modern has ribbons instead, so the two
 * sites look different.
 *
 * Parallax: the scene is painted in three layers (sky, far hills, near
 * hills) that move at different speeds as the page scrolls, and shift
 * a little with the mouse, so it has depth. The movement is smoothed,
 * and switched off for visitors who prefer reduced motion.
 */

/* How far each layer moves (pixels) over the whole page, and with the mouse. */
var PARALLAX=[
{name:"sky",scroll:24,mouse:4},
{name:"far",scroll:70,mouse:10},
{name:"near",scroll:150,mouse:22}
];
var EXTRA=170;
/* The scene is this much bigger than the screen, so its edges never show on wide or tall screens. */
var SCENE=1.3;

function backdrop(){
var b=el("div","m-backdrop");
b.setAttribute("aria-hidden","true");
var scene=el("div","m-backdrop-art");
b.appendChild(scene);
var canvases=PARALLAX.map(function(layer){
var canvas=el("canvas","w-layer w-layer-"+layer.name);
scene.appendChild(canvas);
return canvas;
});
function draw(){paintBackdrop(canvases);}
draw();
var timer=0;
window.addEventListener("resize",function(){
clearTimeout(timer);
timer=setTimeout(function(){
/* Only redraw when the screen got bigger, or changed a lot. */
var c=canvases[0];
if(window.innerWidth*SCENE>c.cssWidth+2||window.innerHeight*SCENE>c.cssHeight+2||window.innerWidth<c.cssWidth*0.6)draw();
},250);
});
startParallax(canvases);
return b;
}

function startParallax(canvases){
if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
var target={scroll:0,x:0,y:0},now={scroll:0,x:0,y:0},running=false;
function measure(){
var max=document.documentElement.scrollHeight-window.innerHeight;
target.scroll=max>0?Math.min(1,window.scrollY/max):0;
wake();
}
function wake(){if(!running){running=true;requestAnimationFrame(step);}}
function step(){
/* Ease towards the target, so the layers glide instead of jumping. */
var done=true;
["scroll","x","y"].forEach(function(k){
now[k]+=(target[k]-now[k])*0.12;
if(Math.abs(target[k]-now[k])>0.0005)done=false;else now[k]=target[k];
});
canvases.forEach(function(canvas,i){
var p=PARALLAX[i];
canvas.style.transform="translate3d("+(-now.x*p.mouse).toFixed(2)+"px,"+(-now.scroll*p.scroll-now.y*p.mouse*0.6).toFixed(2)+"px,0)";
});
if(done)running=false;else requestAnimationFrame(step);
}
window.addEventListener("scroll",measure,{passive:true});
window.addEventListener("resize",measure);
/* The mouse only on devices that have one (not on touch screens). */
if(window.matchMedia&&window.matchMedia("(pointer: fine)").matches){
window.addEventListener("pointermove",function(event){
target.x=event.clientX/window.innerWidth*2-1;
target.y=event.clientY/window.innerHeight*2-1;
wake();
},{passive:true});
}
measure();
}

/* A repeatable random number generator, so the scene looks the same every visit. */
function seeded(seed){
return function(){
seed=(seed*1664525+1013904223)>>>0;
return seed/4294967296;
};
}

function paintBackdrop(canvases){
/* A little larger than the screen, so the drift and parallax never show an edge. */
var w=Math.round(window.innerWidth*SCENE),h=Math.round(window.innerHeight*SCENE);
var dpr=Math.min(window.devicePixelRatio||1,1.5);
var ctx=canvases.map(function(canvas){
var ch=h+EXTRA;
canvas.width=Math.round(w*dpr);
canvas.height=Math.round(ch*dpr);
canvas.style.width=w+"px";
canvas.style.height=ch+"px";
canvas.cssWidth=w;canvas.cssHeight=h;
var c=canvas.getContext("2d");
c.setTransform(dpr,0,0,dpr,0,0);
c.imageSmoothingEnabled=false;
c.clearRect(0,0,w,ch);
return c;
});
var sky=ctx[0],full=h+EXTRA;
var rand=seeded(1996);

/* Dusk sky: deep night blue at the top, warm glow at the horizon. */
var horizon=h*0.62;
var gradient=sky.createLinearGradient(0,0,0,horizon);
gradient.addColorStop(0,"#040716");
gradient.addColorStop(0.45,"#121236");
gradient.addColorStop(0.75,"#3c1c4a");
gradient.addColorStop(1,"#c65a3a");
sky.fillStyle=gradient;
sky.fillRect(0,0,w,full);

/* Pixel stars, brighter and denser higher up. */
var px=Math.max(2,Math.round(Math.min(w,h)/400));
for(var s=0;s<Math.round(w*h/9000);s++){
var sx=Math.floor(rand()*w),sy=Math.floor(Math.pow(rand(),1.6)*horizon*0.85);
var big=rand()<0.12;
sky.fillStyle="rgba(255,255,255,"+(0.35+rand()*0.55)*(1-sy/horizon)+")";
sky.fillRect(Math.floor(sx/px)*px,Math.floor(sy/px)*px,big?px*2:px,big?px*2:px);
}

/* A big blocky sun, drawn in squares, with its glow on the sky. */
var block=Math.max(8,Math.round(Math.min(w,h)/70));
var sunX=w*0.7,sunY=h*0.4,sunR=block*6;
/* Each colour ring is filled as one shape, so no lines show between the blocks. */
[["#f2794e",1],["#ffae5c",0.8],["#ffcf7a",0.55]].forEach(function(ring){
sky.beginPath();
for(var by=-sunR;by<=sunR;by+=block){
for(var bx=-sunR;bx<=sunR;bx+=block){
var d=Math.sqrt((bx+block/2)*(bx+block/2)+(by+block/2)*(by+block/2));
if(d<=sunR*ring[1])sky.rect(Math.round(sunX+bx),Math.round(sunY+by),block,block);
}
}
sky.fillStyle=ring[0];
sky.fill();
});
var glow=sky.createRadialGradient(sunX,sunY,sunR*0.5,sunX,sunY,sunR*4);
glow.addColorStop(0,"rgba(255,150,90,.35)");
glow.addColorStop(1,"rgba(255,150,90,0)");
sky.fillStyle=glow;
sky.fillRect(0,0,w,full);

/* Blocky clouds. */
for(var k=0;k<7;k++){
var cx=rand()*w,cy=horizon*(0.15+rand()*0.45),cw=Math.round(4+rand()*7),chh=Math.round(1+rand()*2);
sky.fillStyle="rgba(255,190,200,"+(0.06+rand()*0.08)+")";
for(var r=0;r<chh;r++){
var inset=r===0?Math.round(cw*0.25):0;
sky.fillRect(Math.round(cx+inset*block),Math.round(cy+r*block),(cw-inset*2)*block,block);
}
}

/*
 * Stepped hills in four bands, far to near: each column of blocks gets
 * a height from a smooth random curve, so the ridges come out in steps
 * like a Minecraft landscape. The two far bands go on the "far" layer,
 * the two near ones on the "near" layer, so they move at different speeds.
 */
function smooth(t){return t*t*(3-2*t);}
function curve(scale){
var pts=[];
for(var i=0;i<Math.ceil(w/scale)+3;i++)pts.push(rand());
return function(x){
var f=x/scale,i=Math.floor(f),t=smooth(f-i);
return pts[i]+(pts[i+1]-pts[i])*t;
};
}
var bands=[
{layer:1,size:block,base:0.62,amp:0.14,scale:w*0.22,color:"#3a2450",top:"#4b3062"},
{layer:1,size:block*1.25,base:0.7,amp:0.13,scale:w*0.18,color:"#221636",top:"#2e1f45"},
{layer:2,size:block*1.5,base:0.79,amp:0.11,scale:w*0.15,color:"#120d20",top:"#1d3d2a"},
{layer:2,size:block*2,base:0.89,amp:0.08,scale:w*0.12,color:"#07060d",top:"#17371f"}
];
bands.forEach(function(band,bi){
var c=ctx[band.layer];
var height=curve(band.scale);
var size=Math.round(band.size);
/* The whole band (and its grass) is filled as one shape each, so no lines show between the blocks. */
var ground=new Path2D(),grass=new Path2D(),trees=new Path2D();
for(var x=0;x<w+size;x+=size){
var top=Math.round((h*(band.base-band.amp*height(x)))/size)*size;
ground.rect(x,top,size,full-top);
grass.rect(x,top,size,Math.max(3,Math.round(size*0.35)));
/* A few blocky trees on the near bands. */
if(band.layer===2&&rand()<0.07){
/* A short trunk under a wide, blocky crown, like an oak. */
var trunk=Math.round(size*0.5),treeH=Math.round(size*(1+rand()));
trees.rect(Math.round(x+size/2-trunk/2),top-treeH,trunk,treeH+1);
trees.rect(x-size,Math.round(top-treeH-size*1.6),size*3,Math.round(size*1.6)+1);
trees.rect(Math.round(x-size*0.5),Math.round(top-treeH-size*2.4),size*2,Math.round(size*0.8)+1);
}
}
c.fillStyle=band.color;
c.fill(ground);
c.fill(trees);
c.fillStyle=band.top;
c.fill(grass);
/* Haze over the far bands, so they fade into the dusk. */
if(band.layer===1){
var haze=c.createLinearGradient(0,h*(band.base-band.amp),0,full);
haze.addColorStop(0,"rgba(120,60,110,"+(0.16-bi*0.05)+")");
haze.addColorStop(1,"rgba(120,60,110,0)");
c.globalCompositeOperation="source-atop";
c.fillStyle=haze;
c.fillRect(0,0,w,full);
c.globalCompositeOperation="source-over";
}
});

/* A soft vignette towards the edges, on the nearest layer. */
var near=ctx[2];
var vignette=near.createRadialGradient(w/2,h*0.45,Math.min(w,h)*0.3,w/2,h/2,Math.max(w,h)*0.75);
vignette.addColorStop(0,"rgba(5,6,18,0)");
vignette.addColorStop(1,"rgba(5,6,18,.55)");
near.fillStyle=vignette;
near.fillRect(0,0,w,full);
}

function topbar(page){
var bar=el("header","m-topbar glass");
bar.innerHTML='<a class="m-brand" href="'+urlOf("")+'">'+BLOCK_MARK+'<span>'+escapeHtml(WIKI.name)+'</span></a>';
bar.appendChild(makeGlassButton(urlOf("updates"),"Update Logs",ICON_LOG));
var nav=el("nav","m-nav");
nav.setAttribute("aria-label","Main");
var items=el("span","m-nav-items");
nav.appendChild(items);
NAV.forEach(function(item){
var link=el("a",null,item.label);
link.href=urlOf(item.path);
link.setAttribute("data-path",item.path);
if(item.path===sectionOf(page))link.className="active";
items.appendChild(link);
});
bar.appendChild(nav);
navItems=items;
navLens=makeLens(nav,items,"x");
var search=el("button","w-search-btn",'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg>');
search.type="button";
search.setAttribute("aria-label","Search the wiki");
search.addEventListener("click",function(){openSearch();});
bar.appendChild(search);
return bar;
}


/*
 * ---------- Clear liquid-glass lenses (sliding highlights) ----------
 *
 * A lens marks the selected item in a menu and slides to the next one,
 * stretching a little on the way like liquid. It is CLEAR glass (no
 * frosted fill): a bright rim, a faint rainbow fringe, a soft shadow,
 * and inside it a copy of the menu text, lined up with the real text
 * and bent by an SVG refraction filter: barely at rest, strongly while
 * it travels. Used by the menu bar (sideways) and the phone menu (up
 * and down). Every slider like this must use makeLens.
 */

/* How far the rim bends things, in pixels: a little at rest, more while moving. */
var LENS_REST=5,LENS_MOVING=26;
/* The refracted copy reaches this far past the edge of the lens. */
var LENS_BLEED=14;
var lensMapURL=null,lensCount=0;

/*
 * The refraction map: no bending in the middle, more and more towards
 * the rim, where the glass bends in what is just outside it.
 */
function lensMap(){
if(lensMapURL)return lensMapURL;
var canvas=document.createElement("canvas");
canvas.width=128;canvas.height=48;
var c=canvas.getContext("2d");
var img=c.createImageData(128,48);
for(var j=0;j<48;j++){
for(var i=0;i<128;i++){
var u=i/127*2-1,v=j/47*2-1;
var k=(j*128+i)*4;
img.data[k]=128+Math.sign(u)*Math.pow(Math.abs(u),3)*127;
img.data[k+1]=128+Math.sign(v)*Math.pow(Math.abs(v),3)*127;
img.data[k+2]=128;
img.data[k+3]=255;
}
}
c.putImageData(img,0,0);
lensMapURL=canvas.toDataURL();
return lensMapURL;
}

/*
 * host: the positioned element the lens sits in.
 * items: the element holding the menu items (inside host).
 * axis: "x" for a row of items, "y" for a column.
 */
function makeLens(host,items,axis){
lensCount++;
var id="m-lens-"+lensCount;
var holder=document.createElement("div");
holder.innerHTML=
'<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">'+
/* Sized in pixels to the lens on every frame: relative sizes place the map wrongly in Chrome. */
'<filter id="'+id+'" x="0" y="0" width="100" height="40" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">'+
'<feImage href="'+lensMap()+'" x="0" y="0" width="100" height="40" preserveAspectRatio="none" result="map"/>'+
'<feDisplacementMap in="SourceGraphic" in2="map" scale="'+LENS_REST+'" xChannelSelector="R" yChannelSelector="G"/>'+
'</filter></svg>';
var svg=holder.firstChild;
document.body.appendChild(svg);
var filter=svg.querySelector("filter"),map=svg.querySelector("feImage"),bend=svg.querySelector("feDisplacementMap");

var glass=el("span","m-lens");
glass.setAttribute("aria-hidden","true");
var inner=el("span","m-lens-inner");
inner.style.filter="url(#"+id+")";
/* The copy: the whole menu, cloned, so it has exactly the same layout. */
var track=items.cloneNode(true);
track.removeAttribute("style");
track.classList.remove("m-lens-cut-x","m-lens-cut-y");
track.classList.add("m-lens-track");
track.querySelectorAll("*").forEach(function(node){
node.removeAttribute("id");
node.removeAttribute("href");
node.removeAttribute("title");
node.removeAttribute("data-path");
node.removeAttribute("tabindex");
node.classList.remove("active");
node.classList.add("m-lens-copy");
});
inner.appendChild(track);
glass.appendChild(inner);
host.insertBefore(glass,host.firstChild);
items.classList.add(axis==="y"?"m-lens-cut-y":"m-lens-cut-x");

var lens={el:glass,x:0,y:0,w:0,h:0,anim:0};

/* Hidden (on a page not in this menu): the real text shows again everywhere. */
function hide(){
glass.style.opacity="0";
items.style.setProperty("--cut-a","0px");
items.style.setProperty("--cut-b","0px");
}

function setBend(amount){bend.setAttribute("scale",amount.toFixed(1));}

/* Draws the lens; "bulge" (0 to 1) is how far into a move it is: it swells and magnifies more. */
function draw(x,y,w,h,bulge){
bulge=bulge||0;
if(axis==="x"){var gy=h*0.16*bulge;y-=gy/2;h+=gy;}
else{var gx=w*0.04*bulge;x-=gx/2;w+=gx;}
glass.style.width=w+"px";
glass.style.height=h+"px";
glass.style.transform="translate("+x+"px,"+y+"px)";
var ox=items.offsetLeft,oy=items.offsetTop;
var cx=w/2,cy=h/2,scale=1+0.12*bulge;
track.style.width=items.offsetWidth+"px";
track.style.transform="translate("+(cx+LENS_BLEED)+"px,"+(cy+LENS_BLEED)+"px) scale("+scale+") translate("+(ox-x-cx)+"px,"+(oy-y-cy)+"px)";
/* The refraction map covers the whole lens, including the part past its edge. */
var mw=Math.ceil(w+LENS_BLEED*2),mh=Math.ceil(h+LENS_BLEED*2);
filter.setAttribute("width",mw);filter.setAttribute("height",mh);
map.setAttribute("width",mw);map.setAttribute("height",mh);
/* Hide the real text under the lens, where its refracted copy shows instead. */
if(axis==="x"){
items.style.setProperty("--cut-a",(x-ox+1)+"px");
items.style.setProperty("--cut-b",(x-ox+w-1)+"px");
}else{
items.style.setProperty("--cut-a",(y-oy+1)+"px");
items.style.setProperty("--cut-b",(y-oy+h-1)+"px");
}
}

lens.place=function(item){
cancelAnimationFrame(lens.anim);
if(!item){hide();return;}
glass.style.opacity="";
lens.x=item.offsetLeft;lens.y=item.offsetTop;lens.w=item.offsetWidth;lens.h=item.offsetHeight;
draw(lens.x,lens.y,lens.w,lens.h,0);
setBend(LENS_REST);
};

lens.move=function(item){
/* A page that isn't in this menu (like Update Logs): the lens fades away. */
if(!item){hide();return;}
if(reducedMotion()||!lens.w){lens.place(item);return;}
cancelAnimationFrame(lens.anim);
glass.style.opacity="";
var from=axis==="x"?{a:lens.x,s:lens.w}:{a:lens.y,s:lens.h};
var to=axis==="x"?{a:item.offsetLeft,s:item.offsetWidth}:{a:item.offsetTop,s:item.offsetHeight};
var other=axis==="x"?{a:item.offsetTop,s:item.offsetHeight}:{a:item.offsetLeft,s:item.offsetWidth};
var distance=Math.abs(to.a-from.a);
var duration=Math.min(650,320+distance*0.9);
var started=performance.now();
function frame(now){
var t=Math.min(1,(now-started)/duration);
/*
 * Like a drop of liquid: the leading edge moves first and settles
 * with a small spring, the trailing edge follows a little behind,
 * so the lens stretches on the way (never more than 40px).
 */
var p=Math.min(1,t/0.8);
var lead=1+1.9*Math.pow(p-1,3)+0.9*Math.pow(p-1,2);
var trail=1-Math.pow(1-t,3);
if(distance>0)trail=Math.max(trail,lead-40/distance);
var bulge=Math.sin(Math.PI*t);
var start,end;
if(to.a>=from.a){
end=from.a+from.s+(to.a+to.s-from.a-from.s)*lead;
start=from.a+(to.a-from.a)*trail;
}else{
start=from.a+(to.a-from.a)*lead;
end=from.a+from.s+(to.a+to.s-from.a-from.s)*trail;
}
var size=Math.max(Math.min(from.s,to.s)*0.6,end-start);
if(axis==="x"){lens.x=start;lens.w=size;draw(start,other.a,size,other.s,bulge);}
else{lens.y=start;lens.h=size;draw(other.a,start,other.s,size,bulge);}
setBend(LENS_REST+(LENS_MOVING-LENS_REST)*bulge);
if(t<1)lens.anim=requestAnimationFrame(frame);
else lens.place(item);
}
lens.anim=requestAnimationFrame(frame);
};

return lens;
}

/* The menu item for a page, in a list of items. */
function itemFor(items,page){
var links=items.querySelectorAll(":scope > a");
for(var i=0;i<links.length;i++){
if(links[i].getAttribute("data-path")===page)return links[i];
}
return null;
}

var navLens=null,navItems=null;

function placePill(page){if(navLens)navLens.place(itemFor(navItems,page));}
function movePill(page){if(navLens)navLens.move(itemFor(navItems,page));}

/*
 * ---------- Glass buttons ----------
 *
 * A button that turns into clear liquid glass while it is pressed,
 * like the menu lens: it swells, its rim catches the light (with the
 * faint rainbow fringe) and its text bends; on release it springs back.
 */

function glassButton(button){
lensCount++;
var id="m-press-"+lensCount;
var holder=document.createElement("div");
holder.innerHTML=
'<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">'+
'<filter id="'+id+'" x="0" y="0" width="100" height="40" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">'+
'<feImage href="'+lensMap()+'" x="0" y="0" width="100" height="40" preserveAspectRatio="none" result="map"/>'+
'<feDisplacementMap in="SourceGraphic" in2="map" scale="0" xChannelSelector="R" yChannelSelector="G"/>'+
'</filter></svg>';
var svg=holder.firstChild;
document.body.appendChild(svg);
var filter=svg.querySelector("filter"),map=svg.querySelector("feImage"),bend=svg.querySelector("feDisplacementMap");
var face=button.querySelector(".m-glass-face");
var amount=0,anim=0,pressed=false;
function size(){
var w=Math.ceil(face.offsetWidth),h=Math.ceil(face.offsetHeight);
filter.setAttribute("width",w);filter.setAttribute("height",h);
map.setAttribute("width",w);map.setAttribute("height",h);
}
/* The bend grows while pressed and fades away after release. */
function bendTo(target){
cancelAnimationFrame(anim);
var from=amount,started=performance.now(),duration=target?220:380;
if(target)face.style.filter="url(#"+id+")";
function frame(now){
var t=Math.min(1,(now-started)/duration);
amount=from+(target-from)*(1-Math.pow(1-t,3));
bend.setAttribute("scale",amount.toFixed(1));
if(t<1)anim=requestAnimationFrame(frame);
else if(!target)face.style.filter="";
}
anim=requestAnimationFrame(frame);
}
function down(){
if(pressed)return;
pressed=true;
size();
button.classList.add("pressed");
if(!reducedMotion())bendTo(14);
}
function up(){
if(!pressed)return;
pressed=false;
button.classList.remove("pressed");
if(!reducedMotion())bendTo(0);
}
button.addEventListener("pointerdown",down);
["pointerup","pointerleave","pointercancel","blur"].forEach(function(type){button.addEventListener(type,up);});
button.addEventListener("keydown",function(event){if(event.key===" "||event.key==="Enter")down();});
button.addEventListener("keyup",up);
return button;
}

/* A glass button with an icon and a label (the label hides on narrow phones). */
function makeGlassButton(href,label,icon){
var a=el("a","m-glass-btn");
a.href=href;
a.setAttribute("aria-label",label);
a.innerHTML='<span class="m-glass-face">'+icon+'<span class="m-glass-text">'+label+'</span></span>';
return glassButton(a);
}

var ICON_LOG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 8v4l3 2"/><path d="M3.05 11a9 9 0 1 1 .5 4"/><path d="M3 4v5h5"/></svg>';

/* The footer, with the wiki's maker's marks. */
function footer(){
var f=el("footer","m-footer glass");
f.innerHTML=
'<span>'+escapeHtml(WIKI.name)+' &middot; Crafting information from JR\'s Crafting Guide for Season 3</span>'+
'<span>Wiki '+escapeHtml(WIKI.version)+' &middot; Built by Sylvia Valentina &middot; Built with Visual Studio Code</span>';
return f;
}

/* ---------- Pages ---------- */

/* The small label above a title: the branch it belongs to. */
function whereOf(page){
if(!page.path)return "Wiki";
if(page.path===sectionOf(page.path))return "Season 3 branch";
return PAGES[sectionOf(page.path)].title;
}

function crumbs(page){
var trail=[],p=page;
while(p){trail.unshift(p);p=PAGES[p].parent||"";}
var nav=el("nav","w-crumbs");
nav.setAttribute("aria-label","You are here");
var html='<a href="'+urlOf("")+'">Home</a>';
trail.forEach(function(path,i){
html+='<span aria-hidden="true">&rsaquo;</span>';
html+=i===trail.length-1?'<span>'+escapeHtml(PAGES[path].title)+'</span>':'<a href="'+urlOf(path)+'">'+escapeHtml(PAGES[path].title)+'</a>';
});
nav.innerHTML=html;
return nav;
}

function image(src,alt){
return '<img src="'+imageRoot+src+'" alt="'+escapeHtml(alt||"")+'" loading="lazy" data-zoom>';
}

/* A card for each sub-page (on the home page: one per branch, in its colour). */
function childCards(page){
var grid=el("div","w-children");
childrenOf(page.path).forEach(function(child){
var card=el("a","w-card glass");
card.href=urlOf(child.path);
if(!page.path)card.style.setProperty("--card-accent",accentOf(child.path));
var pic=child.image||"";
var html="";
if(pic)html+='<div class="w-card-img'+(/\.png$/.test(pic)?" w-contain":"")+'" style="background-image:url(\''+imageRoot+pic+'\')"></div>';
html+='<div class="w-card-body"><b>'+escapeHtml(child.title)+'</b><span>'+escapeHtml(child.summary||"")+'</span>';
var count=childrenOf(child.path).length;
html+='<i>'+(count?count+(count===1?" page":" pages")+" &rarr;":"Read &rarr;")+'</i></div>';
card.innerHTML=html;
grid.appendChild(card);
});
return grid;
}

function block(b,page){
switch(b.type){
case "text":return el("p",null,links(b.html));
case "heading":return el("h2",null,escapeHtml(b.text));
case "callout":return el("div","w-callout",'<p>'+links(b.html)+'</p>');
case "list":
var ul=el("ul");
b.items.forEach(function(item){ul.appendChild(el("li",null,links(item)));});
return ul;
case "steps":
var box=el("div");
if(b.title)box.appendChild(el("h3","w-steps-title",escapeHtml(b.title)));
var ol=el("ol","w-steps");
b.items.forEach(function(item){ol.appendChild(el("li",null,links(item)));});
box.appendChild(ol);
return box;
case "recipes":
var wrap=el("div");
if(b.title)wrap.appendChild(el("h3","w-recipes-title",escapeHtml(b.title)));
var grid=el("div","w-recipes");
b.items.forEach(function(r){
grid.appendChild(el("figure","w-recipe",image(r.img,r.name)+'<b>'+escapeHtml(r.name)+'</b>'+(r.note?'<span>'+links(r.note)+'</span>':"")));
});
wrap.appendChild(grid);
return wrap;
case "gallery":
var gallery=el("div","w-gallery");
b.items.forEach(function(g){
gallery.appendChild(el("figure",null,image(g.img,g.caption)+(g.caption?'<figcaption>'+escapeHtml(g.caption)+'</figcaption>':"")));
});
return gallery;
case "table":
var html='<table class="w-table"><thead><tr>'+b.head.map(function(h){return "<th>"+escapeHtml(h)+"</th>";}).join("")+'</tr></thead><tbody>';
b.rows.forEach(function(row){html+="<tr>"+row.map(function(c){return "<td>"+links(c)+"</td>";}).join("")+"</tr>";});
return el("div","w-table-wrap",html+"</tbody></table>");
case "children":
return childrenOf(page.path).length?childCards(page):null;
case "changelog":
var log=el("div","m-log");
(WIKI.changelog||[]).forEach(function(entry){
var card=el("section","m-log-entry");
card.innerHTML='<div class="m-log-head"><h3>'+escapeHtml(entry.version)+'</h3><span class="m-log-date">'+escapeHtml(entry.date)+'</span></div>';
var ul=el("ul","m-log-items");
entry.items.forEach(function(item){ul.appendChild(el("li",null,links(item)));});
card.appendChild(ul);
log.appendChild(card);
});
return log;
}
return null;
}

function renderPage(main,path){
var page=PAGES[path]||PAGES[""];
main.innerHTML="";
if(page.path)main.appendChild(crumbs(page.path));

var hero=el("section","m-hero glass");
hero.innerHTML=
'<div class="m-hero-orb" aria-hidden="true"></div>'+
'<span class="m-eyebrow"></span>'+
'<h1></h1>'+
'<p class="m-lead"></p>';
hero.querySelector(".m-eyebrow").textContent=page.eyebrow||whereOf(page);
hero.querySelector("h1").textContent=page.title;
hero.querySelector(".m-lead").textContent=page.summary||"";
/* Quick buttons ("Frequently visited" on the home page); the first one is highlighted. */
if(page.quick&&page.quick.length){
var actions=el("div","m-actions w-quick");
actions.appendChild(el("span","w-quick-label",page.path?"Quick links":"Frequently visited"));
page.quick.forEach(function(path,i){
if(!PAGES[path])return;
var button=el("a","m-btn"+(i===0?" m-btn-primary":""),escapeHtml(PAGES[path].title));
button.href=urlOf(path);
if(i===0)button.style.setProperty("--btn-accent",accentOf(path));
actions.appendChild(button);
});
hero.appendChild(actions);
}
main.appendChild(hero);

/* The home page shows the branches as big cards; other pages are one article. */
if(!page.path){
var intro=el("section","m-section");
page.blocks.forEach(function(b){
var node=block(b,page);
if(!node)return;
if(b.type==="children"){node.classList.add("m-section");intro.appendChild(node);}
else intro.appendChild(el("div","w-article glass",node.outerHTML));
});
main.appendChild(intro);
return;
}

/* The article; cards for sub-pages go below it (glass on glass would look flat). */
var article=el("article","w-article glass"),cards=null;
page.blocks.forEach(function(b){
var node=block(b,page);
if(!node)return;
if(b.type==="children"){cards=node;cards.classList.add("m-section");return;}
article.appendChild(node);
});
if(article.children.length)main.appendChild(article);
if(cards)main.appendChild(cards);

/* Where to go next: the parent and the pages next to this one. */
var near=[];
if(page.parent)near.push(page.parent);
childrenOf(page.parent||"").forEach(function(p){if(p.path!==page.path)near.push(p.path);});
if(near.length){
var related=el("section","m-section");
related.innerHTML='<div class="m-section-head"><h2>See also</h2></div>';
var chips=el("nav","w-related");
near.forEach(function(p){
var a=el("a",null,escapeHtml(PAGES[p].title));
a.href=urlOf(p);
chips.appendChild(a);
});
related.appendChild(chips);
main.appendChild(related);
}
}

/* ---------- Search ---------- */

var searchBox=null;

function searchIndex(){
return WIKI.pages.map(function(p){
var words=[p.title,p.summary||""];
(p.blocks||[]).forEach(function(b){
if(b.html)words.push(plain(b.html));
if(b.text)words.push(b.text);
if(b.title)words.push(b.title);
(b.items||[]).forEach(function(i){
if(typeof i==="string")words.push(plain(i));
else words.push(i.name||"",i.note?plain(i.note):"",i.caption||"");
});
(b.rows||[]).forEach(function(r){words.push(plain(r.join(" ")));});
});
return {page:p,title:p.title.toLowerCase(),text:words.join(" ").toLowerCase()};
});
}

function openSearch(){
if(!searchBox){
searchBox=el("div","w-search");
searchBox.innerHTML='<div class="w-search-panel glass" role="dialog" aria-label="Search the wiki"><input type="search" placeholder="Search recipes, items, machines..." aria-label="Search"><div class="w-results" aria-live="polite"></div></div>';
document.body.appendChild(searchBox);
var input=searchBox.querySelector("input"),results=searchBox.querySelector(".w-results");
var index=searchIndex(),selected=0;
function show(){
var q=input.value.trim().toLowerCase();
results.innerHTML="";
if(!q){results.innerHTML="<p>Type to search all "+WIKI.pages.length+" pages.</p>";return;}
var words=q.split(/\s+/);
var hits=index.filter(function(e){return words.every(function(w){return e.text.indexOf(w)>=0;});});
hits.sort(function(a,b){return (b.title.indexOf(q)>=0)-(a.title.indexOf(q)>=0);});
if(!hits.length){results.innerHTML="<p>Nothing found for &ldquo;"+escapeHtml(input.value)+"&rdquo;.</p>";return;}
hits.slice(0,12).forEach(function(e,i){
var a=el("a");
a.href=urlOf(e.page.path);
if(i===selected)a.className="sel";
var where=whereOf(e.page);
a.innerHTML='<small>'+escapeHtml(where)+'</small><b>'+escapeHtml(e.page.title)+'</b><span>'+escapeHtml(e.page.summary||"")+'</span>';
results.appendChild(a);
});
}
input.addEventListener("input",function(){selected=0;show();});
input.addEventListener("keydown",function(event){
var rows=results.querySelectorAll("a");
if(event.key==="ArrowDown"||event.key==="ArrowUp"){
event.preventDefault();
if(!rows.length)return;
selected=(selected+(event.key==="ArrowDown"?1:-1)+rows.length)%rows.length;
rows.forEach(function(r,i){r.classList.toggle("sel",i===selected);});
}else if(event.key==="Enter"&&rows[selected]){
event.preventDefault();
rows[selected].click();
}
});
searchBox.addEventListener("click",function(event){
if(event.target===searchBox)closeSearch();
else if(event.target.closest("a"))closeSearch();
});
show();
}
searchBox.classList.add("open");
var field=searchBox.querySelector("input");
field.value="";
field.dispatchEvent(new Event("input"));
setTimeout(function(){field.focus();},30);
}

function closeSearch(){
if(searchBox)searchBox.classList.remove("open");
}

/* ---------- Pictures open larger ---------- */

/* The picture glides from its place on the page to the middle of the screen, and back. */
function zoom(img){
var box=el("div","w-zoom");
var big=el("img");
big.src=img.src;
big.alt=img.alt;
box.appendChild(big);
if(img.alt)box.appendChild(el("div","w-zoom-caption",escapeHtml(img.alt)));
document.body.appendChild(box);
function fromThumb(){
var a=img.getBoundingClientRect(),b=big.getBoundingClientRect();
if(!b.width)return "none";
return "translate("+(a.left+a.width/2-(b.left+b.width/2))+"px,"+(a.top+a.height/2-(b.top+b.height/2))+"px) scale("+(a.width/b.width)+")";
}
big.style.transition="none";
big.style.transform=fromThumb();
requestAnimationFrame(function(){
requestAnimationFrame(function(){
big.style.transition="";
big.style.transform="none";
box.classList.add("open");
});
});
function close(){
document.removeEventListener("keydown",onKey);
box.classList.remove("open");
big.style.transform=fromThumb();
setTimeout(function(){box.remove();},reducedMotion()?0:380);
}
function onKey(event){if(event.key==="Escape")close();}
box.addEventListener("click",close);
document.addEventListener("keydown",onKey);
}

document.addEventListener("click",function(event){
var img=event.target.closest&&event.target.closest("img[data-zoom]");
if(img)zoom(img);
});

/*
 * ---------- The phone menu ----------
 *
 * On phones the menu is a round glass button. Tapping it melts it open
 * into a glass panel, joined to the button by a liquid "neck", and it
 * melts back when closed. The whole shape is one outline (drawn by
 * menuShape), so it always looks like a single piece of glass.
 */

var menu=null;
var MENU_R=22,MENU_ITEM=46;

function buildMenu(page){
var box=el("div","m-menu");
var ns="http://www.w3.org/2000/svg";
box.innerHTML=
'<svg class="m-menu-shadow" aria-hidden="true"><path/></svg>'+
'<div class="m-menu-glass"></div>'+
'<svg class="m-menu-rim" aria-hidden="true"><defs><linearGradient id="m-menu-rim-g" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".45" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity=".3"/></linearGradient></defs><path/></svg>'+
'<button type="button" class="m-menu-button" aria-label="Menu" aria-expanded="false"><span></span><span></span></button>';
var links=el("nav","m-menu-links");
links.setAttribute("aria-label","Main");
var rows=el("div","m-menu-items");
links.appendChild(rows);
NAV.forEach(function(item){
var row;
if(item.path==null){
row=el("span","m-menu-soon",item.label+" <small>soon</small>");
}else{
row=el("a",null,item.label);
row.href=urlOf(item.path);
row.setAttribute("data-path",item.path);
if(item.path===page)row.className="active";
}
rows.appendChild(row);
});
box.appendChild(links);
document.body.appendChild(box);
menu={box:box,links:links,items:rows,lens:makeLens(links,rows,"y"),open:false,amount:0,anim:0,
glass:box.querySelector(".m-menu-glass"),
rim:box.querySelector(".m-menu-rim path"),
shadow:box.querySelector(".m-menu-shadow path"),
button:box.querySelector(".m-menu-button")};
menu.button.addEventListener("click",function(){setMenu(!menu.open);});
document.addEventListener("click",function(event){
if(menu.open&&!box.contains(event.target))setMenu(false);
});
document.addEventListener("keydown",function(event){
if(event.key==="Escape"&&menu.open){setMenu(false);menu.button.focus();}
});
window.addEventListener("resize",function(){drawMenu(menu.amount);});
drawMenu(0);
}

function lerp(a,b,t){return a+(b-a)*t;}

/*
 * The outline at "amount" (0 = just the round button, 1 = fully open).
 * The panel grows down and to the left from the button; its top edge
 * flows into the button through a curved neck.
 */
function menuShape(amount,W,H){
var r=MENU_R,cx=W-r,cy=r;
var ew=Math.min(1,amount*1.15),eh=amount;
var x1=W,w=lerp(2*r,W,ew),x0=x1-w;
var y0=cy,y1=lerp(2*r,H,eh);
var Rb=Math.min(lerp(r,26,amount),(y1-y0),w/2);
var f=lerp(0,24,Math.min(1,amount*1.6));
var Rt=Math.min(lerp(0,24,amount),y1-y0-Rb);
f=Math.max(0,Math.min(f,cx-r-x0-Rt));
var nx=cx-r-f;
var beta=Math.min(1.05,f/r*1.1);
var px=cx-r*Math.cos(beta),py=cy-r*Math.sin(beta);
var k1=f*0.6,k2=f*0.55;
function n(v){return v.toFixed(2);}
return "M"+n(cx)+","+n(cy-r)+
" A"+r+","+r+" 0 0 1 "+n(x1)+","+n(cy)+
" L"+n(x1)+","+n(y1-Rb)+
" A"+n(Rb)+","+n(Rb)+" 0 0 1 "+n(x1-Rb)+","+n(y1)+
" L"+n(x0+Rb)+","+n(y1)+
" A"+n(Rb)+","+n(Rb)+" 0 0 1 "+n(x0)+","+n(y1-Rb)+
" L"+n(x0)+","+n(y0+Rt)+
(Rt>0.01?" A"+n(Rt)+","+n(Rt)+" 0 0 1 "+n(x0+Rt)+","+n(y0):"")+
" L"+n(nx)+","+n(y0)+
" C"+n(nx+k1)+","+n(y0)+" "+n(px-k2*Math.sin(beta))+","+n(py+k2*Math.cos(beta))+" "+n(px)+","+n(py)+
" A"+r+","+r+" 0 0 1 "+n(cx)+","+n(cy-r)+" Z";
}

function menuSize(){
var count=menu.items.children.length;
return {W:Math.min(260,window.innerWidth-32),H:2*MENU_R+12+count*MENU_ITEM+14};
}

function drawMenu(amount){
var size=menuSize(),W=size.W,H=size.H;
menu.box.style.width=W+"px";
/* A little taller than the panel, so the opening overshoot has room. */
menu.box.style.height=(H+16)+"px";
var d=menuShape(amount,W,H);
menu.glass.style.clipPath="path('"+d+"')";
menu.glass.style.webkitClipPath="path('"+d+"')";
/* The links are cut to the same shape, so they only ever show inside the glass. */
menu.links.style.clipPath="path('"+d+"')";
menu.links.style.webkitClipPath="path('"+d+"')";
menu.rim.setAttribute("d",d);
menu.shadow.setAttribute("d",d);
/* The links appear once the panel is mostly open, one after another. */
/* The lens fades in with the links. */
menu.links.style.setProperty("--lens-appear",Math.max(0,Math.min(1,(amount-0.5)/0.3)));
Array.prototype.forEach.call(menu.items.children,function(row,i){
var show=Math.max(0,Math.min(1,(amount-0.45-i*0.05)/0.35));
row.style.opacity=show;
row.style.transform="translateY("+((1-show)*-8)+"px)";
});
menu.links.style.visibility=amount>0.4?"visible":"hidden";
menu.box.classList.toggle("open",amount>0.02);
}

function setMenu(open){
if(!menu||open===menu.open)return;
menu.open=open;
menu.button.setAttribute("aria-expanded",open?"true":"false");
menu.box.classList.toggle("opening",open);
/* Put the lens on the current page before the panel opens. */
if(open)menu.lens.place(itemFor(menu.items,sectionOf(currentPage)));
cancelAnimationFrame(menu.anim);
if(reducedMotion()){menu.amount=open?1:0;drawMenu(menu.amount);return;}
var from=menu.amount,to=open?1:0;
var duration=open?620:420;
var started=performance.now();
function frame(now){
var t=Math.min(1,(now-started)/duration);
/* Opening overshoots a little and settles, like liquid; closing is quicker and smooth. */
var e=open?1+2.1*Math.pow(t-1,3)+1.1*Math.pow(t-1,2):1-Math.pow(1-t,3);
menu.amount=lerp(from,to,e);
drawMenu(Math.max(0,menu.amount));
if(t<1)menu.anim=requestAnimationFrame(frame);
else{menu.amount=to;drawMenu(to);}
}
menu.anim=requestAnimationFrame(frame);
}

/* ---------- Page changes ---------- */

/*
 * Moving between wiki pages doesn't load a new page: the menu lens
 * slides over, the old panels fade out and the new ones rise in.
 * The address bar, Back and Forward still work as normal.
 */

var mainEl=null;
var currentPage=null;
var renderToken=0;
var MISSING="__missing";

function reducedMotion(){
return !!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

/* Clears the page for new content, just before it is drawn. */
function enter(main){
main.classList.remove("m-leaving","m-enter");
main.innerHTML="";
/* After the new content is in place: number the panels and let them rise in. */
requestAnimationFrame(function(){
var parts=main.querySelectorAll(".glass,.m-section-head,.w-crumbs");
parts.forEach(function(part,i){part.style.setProperty("--i",Math.min(i,10));});
main.classList.add("m-enter");
setTimeout(function(){main.classList.remove("m-enter");},1400);
});
}

function render(page,ready){
renderToken++;
var token=renderToken;
ready.then(function(){
if(token!==renderToken)return;
var p=PAGES[page];
document.title=p&&p.path?p.title+" — "+WIKI.name:(p?WIKI.name:"Page not found — "+WIKI.name);
document.body.setAttribute("data-page",page);
document.body.style.setProperty("--accent",accentOf(p?page:""));
var description=document.querySelector('meta[name="description"]');
if(description&&p)description.setAttribute("content",p.summary||"");
enter(mainEl);
if(p)renderPage(mainEl,page);
else renderMissing(mainEl);
});
}

/*
 * "Page not found": a big 404 built from Minecraft blocks (grass on top
 * of each digit, dirt below), with buttons home and to the search.
 */
function blockDigits(text){
var FONT={
"4":["101","101","111","001","001"],
"0":["111","101","101","101","111"]
};
var S=10,gap=1,rects="",x=0;
text.split("").forEach(function(ch){
var rows=FONT[ch];
for(var r=0;r<5;r++){
for(var c=0;c<3;c++){
if(rows[r][c]!=="1")continue;
var bx=(x+c)*S,by=r*S;
var grass=r===0||rows[r-1][c]!=="1";
/* Dirt with a darker edge; grass blocks get a green top. */
rects+='<rect x="'+bx+'" y="'+by+'" width="'+(S-gap)+'" height="'+(S-gap)+'" fill="#8b5a3c"/>';
rects+='<rect x="'+bx+'" y="'+(by+S-gap-2)+'" width="'+(S-gap)+'" height="2" fill="#6b4329"/>';
rects+='<rect x="'+(bx+2)+'" y="'+(by+5)+'" width="1" height="1" fill="#a06a47"/><rect x="'+(bx+6)+'" y="'+(by+3)+'" width="1" height="1" fill="#55361f"/>';
if(grass)rects+='<rect x="'+bx+'" y="'+by+'" width="'+(S-gap)+'" height="3" fill="#5bbf4a"/><rect x="'+bx+'" y="'+(by+3)+'" width="2" height="1" fill="#5bbf4a"/><rect x="'+(bx+5)+'" y="'+(by+3)+'" width="2" height="1" fill="#4fae3e"/>';
}
}
x+=4;
});
var w=x*S-S;
return '<svg class="w-404-blocks" viewBox="0 0 '+w+' '+(5*S)+'" shape-rendering="crispEdges" aria-hidden="true">'+rects+'</svg>';
}

function renderMissing(main){
var hero=el("section","m-hero glass w-404");
hero.innerHTML=
'<div class="m-hero-orb" aria-hidden="true"></div>'+
blockDigits("404")+
'<span class="m-eyebrow">Error 404</span>'+
'<h1>This chunk didn\'t load</h1>'+
'<p class="m-lead">The page you\'re looking for isn\'t in this world. It may have moved, or it was never generated. Try the search, or pick a branch below.</p>'+
'<div class="m-actions"><a class="m-btn m-btn-primary" href="'+urlOf("")+'">Back to the wiki</a><button type="button" class="m-btn w-404-search">Search the wiki</button></div>';
hero.querySelector(".w-404-search").addEventListener("click",function(){openSearch();});
main.appendChild(hero);
var cards=childCards(PAGES[""]);
cards.classList.add("m-section");
main.appendChild(cards);
}

/* The wiki page an address points to, or null if it isn't one. */
function pageOf(url){
var base=new URL(siteRoot).pathname;
if(url.pathname.indexOf(base)!==0)return null;
var path=url.pathname.slice(base.length).replace(/index\.html$/,"").replace(/\/$/,"");
return PAGES.hasOwnProperty(path)?path:null;
}

function markActive(page){
var section=sectionOf(page);
if(navItems)navItems.querySelectorAll(":scope > a").forEach(function(a){a.classList.toggle("active",a.getAttribute("data-path")===section);});
if(menu)menu.items.querySelectorAll("a").forEach(function(a){a.classList.toggle("active",a.getAttribute("data-path")===section);});
}

function navigate(page,push){
if(page===currentPage)return;
currentPage=page;
if(push)history.pushState({page:page},"",urlOf(page));
markActive(page);
/* In the phone menu, the lens slides to the new page first, then the menu melts shut. */
if(menu&&menu.open){
menu.lens.move(itemFor(menu.items,sectionOf(page)));
setTimeout(function(){setMenu(false);},reducedMotion()?0:480);
}
movePill(sectionOf(page));
var wait=reducedMotion()?0:220;
mainEl.classList.remove("m-enter");
mainEl.classList.add("m-leaving");
var ready=new Promise(function(resolve){setTimeout(function(){
window.scrollTo({top:0,behavior:"instant"});
resolve();
},wait);});
render(page,ready);
}

/*
 * Smooth travel: links that go somewhere on the same page glide there
 * instead of jumping, and stop just below the top bar. Scrolling with
 * the mouse or a finger takes over.
 */
var glideAnim=0;

function glideTo(target){
cancelAnimationFrame(glideAnim);
var bar=document.querySelector(".m-topbar");
var offset=(bar?bar.offsetHeight+bar.offsetTop:0)+24;
var startY=window.scrollY;
var maxY=document.documentElement.scrollHeight-window.innerHeight;
var endY=Math.max(0,Math.min(maxY,target.getBoundingClientRect().top+startY-offset));
var distance=endY-startY;
if(reducedMotion()||Math.abs(distance)<2){window.scrollTo(0,endY);return;}
var duration=Math.min(1100,Math.max(450,320+Math.abs(distance)*0.35));
var started=performance.now();
function stop(){cancelAnimationFrame(glideAnim);removeEventListener("wheel",stop);removeEventListener("touchstart",stop);}
addEventListener("wheel",stop,{passive:true});
addEventListener("touchstart",stop,{passive:true});
function frame(now){
var t=Math.min(1,(now-started)/duration);
/* Ease in and out: starts gently, glides, settles softly. */
var e=t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
window.scrollTo(0,startY+distance*e);
if(t<1)glideAnim=requestAnimationFrame(frame);
else stop();
}
glideAnim=requestAnimationFrame(frame);
}

/* Links to other wiki pages change page in place. */
function onLinkClick(event){
if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
var link=event.target.closest&&event.target.closest("a[href]");
if(!link||link.target==="_blank")return;
var url=new URL(link.href);
if(url.origin!==location.origin)return;
var page=pageOf(url);
if(page===null)return;
if(page===currentPage&&url.hash){
var target=document.getElementById(decodeURIComponent(url.hash.slice(1)));
if(!target)return;
event.preventDefault();
history.replaceState(history.state,"",url.href);
glideTo(target);
return;
}
event.preventDefault();
navigate(page,true);
}

/* ---------- Start ---------- */

function start(){
var page=document.body.getAttribute("data-page")||"";
/* The "page not found" page also shows any wiki page that has no folder of its own yet. */
if(page==="404"){
var found=pageOf(location);
page=found!==null?found:MISSING;
}
document.body.insertBefore(backdrop(),document.body.firstChild);
var shell=el("div","m-shell");
shell.appendChild(topbar(page));
mainEl=el("main");
mainEl.id="main";
mainEl.appendChild(el("div","m-skeleton glass"));
shell.appendChild(mainEl);
shell.appendChild(footer());
document.body.appendChild(shell);
placePill(sectionOf(page));
window.addEventListener("resize",function(){placePill(sectionOf(currentPage));});
buildMenu(sectionOf(page));

currentPage=page;
history.replaceState({page:page},"");
document.addEventListener("click",onLinkClick);
window.addEventListener("popstate",function(){
var back=pageOf(location);
navigate(back!==null?back:MISSING,false);
});
document.addEventListener("keydown",function(event){
/* "/" opens the search, like on many sites. */
if(event.key==="/"&&!/input|textarea/i.test(document.activeElement.tagName)){event.preventDefault();openSearch();}
if(event.key==="Escape")closeSearch();
});
render(page,Promise.resolve());
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);
else start();

})();
