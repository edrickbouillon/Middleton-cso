const viewer = document.getElementById("viewer");
const info   = document.getElementById("hotspot-info");

let tourIndex = -1;
let backgroundEnabled = false;

// CAMERA CONSTANTS
const PHI_HOTSPOT = 0.349;      // 20°
const PHI_SITE    = 1.22173;    // 70°

// CAMERA OFFSETS (your table)
const cameraOffsets = {
  1:  Math.PI / 2,
  2:  0,
  3: -Math.PI,
  4: -Math.PI,
  5: -Math.PI,
  6: -Math.PI,
  7:  Math.PI / 2,
  8:  0,
  9: -Math.PI,
  10: 0,
  11: -Math.PI
};

// CAMERA RADII (your table)
const cameraRadius = {
  1: 3,
  2: 1,
  3: 3,
  4: 3,
  5: 1,
  6: 1,
  7: 3,
  8: 3,
  9: 3,
  10: 3,
  11: 1
};

// TEXT FOR EACH HOTSPOT
const steps = [
  { id: 1,  text: "Wastewater from the sewer network travels down this pipe before entering the storm tank." },
  { id: 2,  text: "When the sewer fills up during heavy rain the water level rises." },
  { id: 3,  text: "Stormwater enters the tank here." },
  { id: 4,  text: "The tank stores excess stormwater underground." },
  { id: 5,  text: "Pumps remove stored stormwater." },
  { id: 6,  text: "Taps allow one-way water flow." },
  { id: 7,  text: "Water returns to the sewer network." },
  { id: 8,  text: "Wastewater goes to treatment works." },
  { id: 9,  text: "Electricity powers the pumps." },
  { id: 10, text: "Overflow used when tanks are full." },
  { id: 11, text: "Engineer checks equipment." }
];

function getStepById(id) {
  return steps.find(s => s.id === id);
}

/* MENU HIGHLIGHT */
function highlightMenu(id) {
  document.querySelectorAll(".menu-item").forEach(btn => {
    btn.classList.remove("active");
  });
  const activeBtn = document.querySelector(`.menu-item[data-target="${id}"]`);
  if (activeBtn) activeBtn.classList.add("active");
}

/* HOTSPOT HIGHLIGHT */
function updateHotspots(id) {
  document.querySelectorAll(".Hotspot").forEach(h => {
    h.classList.remove("active");
    h.classList.add("dimmed");
  });

  const active = viewer.querySelector(`[slot="hotspot-${id}"]`);
  if (active) {
    active.classList.add("active");
    active.classList.remove("dimmed");
  }
}

/* FIXED INFO BOX */
function showInfo(text) {
  info.innerText = text;
  info.classList.remove("hidden");
  info.classList.add("active");
}

function hideInfo() {
  info.classList.add("hidden");
  info.classList.remove("active");
}

/* CAMERA MOVEMENT WITH OFFSETS + RADII */
function moveCamera(hotspot, id) {
  if (!hotspot) return;

  const [x, y, z] = hotspot.dataset.position
    .split(" ")
    .map(v => parseFloat(v.replace("m", "")));

  let theta = Math.atan2(z, x);
  theta += cameraOffsets[id];

  const radius = cameraRadius[id];

  viewer.cameraOrbit  = `${theta}rad ${PHI_HOTSPOT}rad ${radius}m`;
  viewer.cameraTarget = `${x}m ${y}m ${z}m`;
}

/* ACTIVATE A HOTSPOT */
function activateHotspot(id) {
  const hotspot = viewer.querySelector(`[slot="hotspot-${id}"]`);
  if (!hotspot) return;

  updateHotspots(id);
  highlightMenu(id);
  moveCamera(hotspot, id);

  const step = getStepById(id);
  if (step) showInfo(step.text);
}

/* TOUR LOGIC */
function startTour() {
  tourIndex = 0;
  activateHotspot(steps[tourIndex].id);
}

function nextStep() {
  if (tourIndex < steps.length - 1) {
    tourIndex++;
    activateHotspot(steps[tourIndex].id);
  }
}

function prevStep() {
  if (tourIndex > 0) {
    tourIndex--;
    activateHotspot(steps[tourIndex].id);
  }
}

/* TOUR BUTTONS */
document.getElementById("tour-start").onclick = startTour;
document.getElementById("
