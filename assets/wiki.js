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
 * The background: flowing colour ribbons, like a modern wallpaper,
 * with faint survey-map contour lines on top. It is drawn for the
 * screen size (so it is always sharp) and drifts slowly (CSS). The
 * ribbon edges and lines give the glass something to bend.
 */

function backdrop(){
var b=el("div","m-backdrop");
b.setAttribute("aria-hidden","true");
var canvas=el("canvas","m-backdrop-art");
b.appendChild(canvas);
function draw(){paintBackdrop(canvas);}
draw();
var timer=0;
window.addEventListener("resize",function(){
clearTimeout(timer);
timer=setTimeout(function(){
/* Only redraw when the screen got bigger, or changed a lot. */
if(window.innerWidth*1.15>canvas.cssWidth||window.innerHeight*1.15>canvas.cssHeight||window.innerWidth<canvas.cssWidth*0.6)draw();
},250);
});
return b;
}

/* A repeatable random number generator, so the scene looks the same every visit. */
function seeded(seed){
return function(){
seed=(seed*1664525+1013904223)>>>0;
return seed/4294967296;
};
}

function paintBackdrop(canvas){
/* A little larger than the screen, so the slow drift never shows an edge. */
var w=Math.round(window.innerWidth*1.15),h=Math.round(window.innerHeight*1.15);
var dpr=Math.min(window.devicePixelRatio||1,2);
canvas.width=Math.round(w*dpr);
canvas.height=Math.round(h*dpr);
canvas.style.width=w+"px";
canvas.style.height=h+"px";
canvas.cssWidth=w;canvas.cssHeight=h;
var c=canvas.getContext("2d");
c.setTransform(dpr,0,0,dpr,0,0);

/* Deep night-blue base. */
var base=c.createLinearGradient(0,0,w,h);
base.addColorStop(0,"#0a1030");
base.addColorStop(0.55,"#080b1f");
base.addColorStop(1,"#120a26");
c.fillStyle=base;
c.fillRect(0,0,w,h);

/* The ribbons: wide bands with wavy edges, each with its own colours. */
var ribbons=[
{y:0.18,thick:0.20,amp:0.10,freq:1.1,phase:0.4,tilt:0.18,colors:["#2f5bff","#7b4dff","#c04dff"],alpha:0.62},
{y:0.46,thick:0.16,amp:0.08,freq:1.4,phase:2.1,tilt:-0.12,colors:["#16c7b0","#2f7dff","#5b4dff"],alpha:0.5},
{y:0.70,thick:0.22,amp:0.11,freq:0.9,phase:4.0,tilt:0.1,colors:["#e8453a","#f07a3d","#a83dff"],alpha:0.5},
{y:0.92,thick:0.14,amp:0.06,freq:1.6,phase:1.2,tilt:-0.08,colors:["#7b4dff","#2f5bff","#16c7b0"],alpha:0.42}
];
c.save();
c.filter="blur(1.5px)";
ribbons.forEach(function(r){
function edge(x,offset){
var u=x/w;
return h*(r.y+offset+r.tilt*(u-0.5)+r.amp*Math.sin(u*Math.PI*2*r.freq+r.phase)+r.amp*0.35*Math.sin(u*Math.PI*5.3*r.freq+r.phase*1.7));
}
var steps=60,i,x;
c.beginPath();
for(i=0;i<=steps;i++){x=w*i/steps;if(i===0)c.moveTo(x,edge(x,-r.thick/2));else c.lineTo(x,edge(x,-r.thick/2));}
for(i=steps;i>=0;i--){x=w*i/steps;c.lineTo(x,edge(x,r.thick/2)+h*0.04*Math.sin(i/steps*Math.PI*3+r.phase));}
c.closePath();
var g=c.createLinearGradient(0,0,w,0);
g.addColorStop(0,r.colors[0]);
g.addColorStop(0.5,r.colors[1]);
g.addColorStop(1,r.colors[2]);
c.globalAlpha=r.alpha;
c.fillStyle=g;
c.fill();
/* A silky shine along the top edge of each ribbon. */
c.globalAlpha=r.alpha*0.55;
c.lineWidth=2;
c.strokeStyle="rgba(255,255,255,.55)";
c.beginPath();
for(i=0;i<=steps;i++){x=w*i/steps;if(i===0)c.moveTo(x,edge(x,-r.thick/2));else c.lineTo(x,edge(x,-r.thick/2));}
c.stroke();
});
c.restore();
c.globalAlpha=1;

/* Darken between the ribbons a little, so text stays easy to read. */
var shade=c.createLinearGradient(0,0,0,h);
shade.addColorStop(0,"rgba(6,9,24,.42)");
shade.addColorStop(0.5,"rgba(6,9,24,.25)");
shade.addColorStop(1,"rgba(6,9,24,.48)");
c.fillStyle=shade;
c.fillRect(0,0,w,h);

/* Contour lines, like a survey map, from a smooth random height field. */
var rand=seeded(1996);
var cell=180,gx=Math.ceil(w/cell)+2,gy=Math.ceil(h/cell)+2,grid=[],gi;
for(gi=0;gi<gx*gy;gi++)grid.push(rand());
function smooth(t){return t*t*(3-2*t);}
function noise(x,y){
var fx=x/cell,fy=y/cell,ix=Math.floor(fx),iy=Math.floor(fy),tx=smooth(fx-ix),ty=smooth(fy-iy);
/* Wraps around, so any position has a value. */
function at(i,j){return grid[((j%gy)+gy)%gy*gx+((i%gx)+gx)%gx];}
var a=at(ix,iy),b2=at(ix+1,iy),c2=at(ix,iy+1),d=at(ix+1,iy+1);
return (a+(b2-a)*tx)+((c2+(d-c2)*tx)-(a+(b2-a)*tx))*ty;
}
function height(x,y){return noise(x,y)*0.7+noise(x*2.3+400,y*2.3+400)*0.3;}
var step=6,cols=Math.ceil(w/step)+1,rows=Math.ceil(h/step)+1,field=new Float32Array(cols*rows),ix2,iy2;
for(iy2=0;iy2<rows;iy2++)for(ix2=0;ix2<cols;ix2++)field[iy2*cols+ix2]=height(ix2*step,iy2*step);
c.lineWidth=1;
for(var level=0.1;level<0.95;level+=0.05){
var major=Math.abs(level*10-Math.round(level*10))<0.01;
c.strokeStyle=major?"rgba(255,255,255,.11)":"rgba(255,255,255,.055)";
c.beginPath();
for(iy2=0;iy2<rows-1;iy2++){
for(ix2=0;ix2<cols-1;ix2++){
/* Marching squares: where the line crosses each little square. */
var v0=field[iy2*cols+ix2],v1=field[iy2*cols+ix2+1],v2=field[(iy2+1)*cols+ix2+1],v3=field[(iy2+1)*cols+ix2];
var pts=[];
var x0=ix2*step,y0=iy2*step;
if((v0<level)!==(v1<level))pts.push([x0+step*(level-v0)/(v1-v0),y0]);
if((v1<level)!==(v2<level))pts.push([x0+step,y0+step*(level-v1)/(v2-v1)]);
if((v3<level)!==(v2<level))pts.push([x0+step*(level-v3)/(v2-v3),y0+step]);
if((v0<level)!==(v3<level))pts.push([x0,y0+step*(level-v0)/(v3-v0)]);
if(pts.length>=2){c.moveTo(pts[0][0],pts[0][1]);c.lineTo(pts[1][0],pts[1][1]);}
if(pts.length===4){c.moveTo(pts[2][0],pts[2][1]);c.lineTo(pts[3][0],pts[3][1]);}
}
}
c.stroke();
}

/* A soft vignette towards the edges. */
var vignette=c.createRadialGradient(w/2,h*0.45,Math.min(w,h)*0.3,w/2,h/2,Math.max(w,h)*0.75);
vignette.addColorStop(0,"rgba(5,7,20,0)");
vignette.addColorStop(1,"rgba(5,7,20,.6)");
c.fillStyle=vignette;
c.fillRect(0,0,w,h);
}

function topbar(page){
var bar=el("header","m-topbar glass");
bar.innerHTML='<a class="m-brand" href="'+urlOf("")+'"><span class="m-brand-mark" aria-hidden="true"></span><span>'+escapeHtml(WIKI.name)+'</span></a>';
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
if(!item){glass.style.opacity="0";return;}
glass.style.opacity="";
lens.x=item.offsetLeft;lens.y=item.offsetTop;lens.w=item.offsetWidth;lens.h=item.offsetHeight;
draw(lens.x,lens.y,lens.w,lens.h,0);
setBend(LENS_REST);
};

lens.move=function(item){
if(!item)return;
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

function renderMissing(main){
var hero=el("section","m-hero glass");
hero.innerHTML='<div class="m-hero-orb" aria-hidden="true"></div><span class="m-eyebrow">Error 404</span><h1>Page not found</h1><p class="m-lead">This page doesn\'t exist (yet). Try the search, or pick a branch below.</p>';
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
