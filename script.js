const viewer=document.getElementById("viewer");
const info=document.getElementById("hotspot-info");

let tourIndex=-1;
let backgroundEnabled=false;

const PHI=1.2;

const steps=[
{ id:1,text:"Wastewater from the sewer network travels down this pipe before entering the storm tank."},
{ id:2,text:"When the sewer fills up during heavy rain the water level rises."},
{ id:3,text:"Stormwater enters the tank here."},
{ id:4,text:"The tank stores excess stormwater underground."},
{ id:5,text:"Pumps remove stored stormwater."},
{ id:6,text:"Taps allow one-way water flow."},
{ id:7,text:"Water returns to the sewer network."},
{ id:8,text:"Wastewater goes to treatment works."},
{ id:9,text:"Electricity powers the pumps."},
{ id:10,text:"Overflow used when tanks full."},
{ id:11,text:"Engineer checks equipment."}
];

function highlightMenu(id){
document.querySelectorAll(".menu-item").forEach(btn=>{
btn.classList.remove("active");
});
const activeBtn=document.querySelector(`.menu-item[data-target="${id}"]`);
if(activeBtn) activeBtn.classList.add("active");
}

function updateHotspots(id){

document.querySelectorAll(".Hotspot").forEach(h=>{
h.classList.remove("active");
h.classList.add("dimmed");
});

const active=viewer.querySelector(`[slot="hotspot-${id}"]`);
active.classList.add("active");
active.classList.remove("dimmed");

}

function showInfo(text,position){

const [x,y,z]=position.split(" ").map(v=>parseFloat(v.replace("m","")));

info.innerText=text;
info.classList.remove("hidden");

function update(){

const screen=viewer.positionAndNormalFromPoint({x,y:y-0.5,z});

if(screen){

info.style.left=screen.position.x+"px";
info.style.top=(screen.position.y+40)+"px";

}

requestAnimationFrame(update);

}

update();

}

function moveCamera(hotspot){

const [x,y,z]=hotspot.dataset.position.split(" ").map(v=>parseFloat(v.replace("m","")));

let theta=Math.atan2(z,x);

viewer.cameraOrbit=`${theta}rad ${PHI}rad 0.8m`;
viewer.cameraTarget=`${x}m ${y}m ${z}m`;

}

function activateHotspot(id){

const hotspot=viewer.querySelector(`[slot="hotspot-${id}"]`);

updateHotspots(id);
highlightMenu(id);

moveCamera(hotspot);

showInfo(
steps.find(s=>s.id===id).text,
hotspot.dataset.position
);

}

function startTour(){
tourIndex=0;
activateHotspot(steps[tourIndex].id);
}

function nextStep(){
if(tourIndex<steps.length-1){
tourIndex++;
activateHotspot(steps[tourIndex].id);
}
}

function prevStep(){
if(tourIndex>0){
tourIndex--;
activateHotspot(steps[tourIndex].id);
}
}

document.getElementById("tour-start").onclick=startTour;
document.getElementById("tour-next").onclick=nextStep;
document.getElementById("tour-prev").onclick=prevStep;

document.querySelectorAll(".menu-item").forEach(btn=>{
btn.onclick=()=>{
activateHotspot(parseInt(btn.dataset.target));
};
});

document.getElementById("menu-button").onclick=()=>{
document.getElementById("menu-panel").classList.toggle("hidden");
};

/* SPECIAL EFFECT */

const toggleBtn=document.getElementById("toggle-background");

toggleBtn.onclick=()=>{

backgroundEnabled=!backgroundEnabled;

if(backgroundEnabled){

viewer.environmentImage="spruit_sunrise_1k_HDR.hdr";
toggleBtn.classList.add("active");
toggleBtn.classList.remove("inactive");

}else{

viewer.removeAttribute("environment-image");
toggleBtn.classList.remove("active");
toggleBtn.classList.add("inactive");

}

};
