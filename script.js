const viewer = document.getElementById("viewer");
const hotspots = document.querySelectorAll(".hotspot");
const menuItems = document.querySelectorAll(".menuItem");
const infoBox = document.getElementById("hotspotInfo");
const effectButton = document.getElementById("specialEffect");

let currentStep = null;

const tourData = {

1:{
text:"Engineer access area where inspections and maintenance are performed.",
orbit:"45deg 65deg 1.1m",
target:"0m 1m 0m"
},

2:{
text:"Primary equipment used in the process system.",
orbit:"120deg 65deg 1.1m",
target:"1m 1m 0.3m"
},

3:{
text:"System control components and monitoring area.",
orbit:"-80deg 65deg 1.1m",
target:"-0.8m 1.1m -0.2m"
}

};

function activateStep(id){

currentStep=id;

hotspots.forEach(h=>{
h.classList.remove("active");
if(h.dataset.id==id){
h.classList.add("active");
}
});

menuItems.forEach(m=>{
m.classList.remove("active");
if(m.dataset.id==id){
m.classList.add("active");
}
});

const step=tourData[id];

viewer.cameraOrbit=step.orbit;
viewer.cameraTarget=step.target;

infoBox.innerHTML=step.text;
infoBox.style.display="block";

}

hotspots.forEach(h=>{

h.addEventListener("click",()=>{

activateStep(h.dataset.id);

});

});

menuItems.forEach(m=>{

m.addEventListener("click",()=>{

activateStep(m.dataset.id);

});

});

effectButton.addEventListener("click",()=>{

effectButton.classList.toggle("active");

if(effectButton.classList.contains("active")){

viewer.style.background="radial-gradient(circle,#1e3c72,#000)";

}else{

viewer.style.background="#000";

}

});
