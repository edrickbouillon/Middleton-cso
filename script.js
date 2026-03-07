const viewer = document.getElementById("viewer");
const info   = document.getElementById("hotspot-info");

let tourIndex = -1;
let backgroundEnabled = false;

// CAMERA CONSTANTS
const PHI_HOTSPOT = 0.349;      // 20°
const PHI_SITE    = 1.22173;    // 70°

// CAMERA OFFSETS
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

// CAMERA RADII
const cameraRadius = {
  1: 3,
  2: 0,
  3: 3,
  4: 3,
  5: 0,
  6: 0,
  7: 3,
  8: 3,
  9: 3,
  10: 3,
  11: 0
};

// TEXT FOR EACH HOTSPOT
const steps = [
  { id: 1,  text: "Wastewater from the sewer network travels down this pipe before entering the storm tank." },
  { id: 2,  text: "When the sewer fills up during heavy rain, wastewater mixes with rainwater and causes the water level to rise. Once it reaches this higher pipe, the excess flow is screened to remove debris before being carried to the storage tank." },
  { id: 3,  text: "This is where stormwater enters the storage tank during heavy rain. Most of the time it stays dry, but when the system becomes full, extra stormwater flows in here to stop the sewer network from overflowing." },
  { id: 4,  text: "This tank stores extra stormwater underground until the sewers have space for it again." },
  { id: 5,  text: "The pumps move any remaining stormwater out of the storage tank and send it back to the treatment works to be cleaned once the heavy rain has passed." },
  { id: 6,  text: "The taps act like a one-way system to let water flow out of the storage tank, but close if it tries to flow back the wrong way. This keeps the flow moving safely back to the sewer network after the heavy rain has passed." },
  { id: 7,  text: "The overflow is only used when both the storm tank and storage tank are completely full. When this happens, any extra stormwater is screened before it’s released into the river. " },
  { id: 8,  text: "This pipe carries wastewater to the treatment works where it is cleaned. It’s always in use, but the pipes above only come into use during heavy rainfall, when the water level rises high enough to reach them." },
  { id: 9,  text: "This provides the electricity needed to power the pumps and the screen so the tanks can work properly during and after heavy rain." },
  { id: 10, text: "The overflow is only used when both the storm tank and storage tank are completely full. When this happens, any extra stormwater is screened before it’s released into the river. " },
  { id: 11, text: "The engineer works hard, checking the tank and equipment to make sure everything is working properly." }
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
