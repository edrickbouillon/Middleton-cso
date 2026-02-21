document.addEventListener("DOMContentLoaded", () => {

const sidebar = document.getElementById("sidebar");
const toggle = document.getElementById("sidebarToggle");
const presentationBtn = document.getElementById("presentationToggle");
const container = document.getElementById("hotspotContainer");
const hotspots = document.querySelectorAll(".Hotspot");

toggle.addEventListener("click", () => {
sidebar.classList.toggle("collapsed");
});

/* Presentation Mode */
presentationBtn.addEventListener("click", () => {
document.body.classList.toggle("presentation-mode");
});

/* Sidebar Content */
const hotspotData = [
{ name: "Dirty-water", img: "images/dirty-water.webp" },
{ name: "Cleaned-water", img: "images/cleaned-water.webp" },
{ name: "Tank Inlet", img: "images/tank-inlet.webp" },
{ name: "Underground Tank", img: "images/underground-tank.webp" },
{ name: "Pumps", img: "images/pumps.webp" },
{ name: "Taps", img: "images/taps.webp" },
{ name: "River", img: "images/river.webp" }
];

hotspotData.forEach(data => {

const section = document.createElement("div");
section.className = "hotspot-section";

section.innerHTML = `
<h3>${data.name}</h3>
<img src="${data.img}" alt="${data.name}" />
`;

container.appendChild(section);

setTimeout(() => {
section.classList.add("visible");
}, 200);

});

/* Glow on click */
hotspots.forEach(hotspot => {
hotspot.addEventListener("click", () => {

hotspots.forEach(h => h.classList.remove("active"));
hotspot.classList.add("active");

});
});

});
