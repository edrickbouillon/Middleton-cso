document.addEventListener("DOMContentLoaded", () => {

const viewer = document.getElementById("viewer");
const sidebar = document.getElementById("sidebar");
const toggle = document.getElementById("sidebarToggle");
const presentationBtn = document.getElementById("presentationToggle");
const container = document.getElementById("hotspotContainer");
const hotspots = document.querySelectorAll(".Hotspot");

/* Sidebar Toggle */
toggle.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

/* Presentation Mode */
presentationBtn.addEventListener("click", () => {
  document.body.classList.toggle("presentation-mode");
});

/* Hotspot Data with Camera Targets */
const hotspotData = {
  "Dirty-water": {
    target: "50.835m 3.44m -2.10m",
    orbit: "45deg 75deg 120m"
  },
  "Cleaned-water": {
    target: "56.01m 12.54m 0.19m",
    orbit: "30deg 70deg 130m"
  },
  "Tank Inlet": {
    target: "61.46m 14.02m 7.27m",
    orbit: "10deg 65deg 110m"
  },
  "Underground Tank": {
    target: "45.06m 11.64m -5.32m",
    orbit: "0deg 80deg 150m"
  },
  "Pumps": {
    target: "82.74m 12.82m -33.74m",
    orbit: "-20deg 75deg 120m"
  },
  "Taps": {
    target: "109.87m 10.36m -27.63m",
    orbit: "-40deg 70deg 130m"
  },
  "River": {
    target: "104.52m 9.48m -13.68m",
    orbit: "90deg 80deg 180m"
  }
};

/* Fade-in Sidebar */
Object.keys(hotspotData).forEach(name => {

  const section = document.createElement("div");
  section.className = "hotspot-section";

  section.innerHTML = `<h3>${name}</h3>`;
  container.appendChild(section);

  setTimeout(() => {
    section.classList.add("visible");
  }, 200);

});

/* Camera Fly-To Animation */
hotspots.forEach(hotspot => {

  hotspot.addEventListener("click", () => {

    const name = hotspot.dataset.name;
    const data = hotspotData[name];

    if (!data) return;

    /* Remove previous glow */
    hotspots.forEach(h => h.classList.remove("active"));
    hotspot.classList.add("active");

    /* Stop auto rotate */
    viewer.autoRotate = false;

    /* Smooth transition */
    viewer.cameraTarget = data.target;
    viewer.cameraOrbit = data.orbit;

  });

});

});
