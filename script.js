const viewer = document.getElementById("viewer");
const info   = document.getElementById("hotspot-info");

let tourIndex = -1;
let backgroundEnabled = false;

// Restore your original camera style
const PHI    = 1.2;   // ~69°
const RADIUS = 0.8;   // close view

// Text for each hotspot
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
}

function hideInfo() {
  info.classList.add("hidden");
}

/* CAMERA MOVEMENT (RESTORED ORIGINAL STYLE) */
function moveCamera(hotspot) {
  if (!hotspot) return;

  const [x, y, z] = hotspot.dataset.position
    .split(" ")
    .map(v => parseFloat(v.replace("m", "")));

  let theta = Math.atan2(z, x);

  viewer.cameraOrbit  = `${theta}rad ${PHI}rad ${RADIUS}m`;
  viewer.cameraTarget = `${x}m ${y}m ${z}m`;
}

/* ACTIVATE A HOTSPOT BY ID */
function activateHotspot(id) {
  const hotspot = viewer.querySelector(`[slot="hotspot-${id}"]`);
  if (!hotspot) return;

  updateHotspots(id);
  highlightMenu(id);
  moveCamera(hotspot);

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

/* BUTTONS: TOUR CONTROLS */
document.getElementById("tour-start").onclick = startTour;
document.getElementById("tour-next").onclick  = nextStep;
document.getElementById("tour-prev").onclick  = prevStep;

/* MENU BUTTON TOGGLE */
document.getElementById("menu-button").onclick = () => {
  document.getElementById("menu-panel").classList.toggle("hidden");
};

/* MENU ITEM CLICKS */
document.querySelectorAll(".menu-item").forEach(btn => {
  btn.onclick = () => {
    const target = btn.dataset.target;

    if (target === "site") {
      // Reset to a nice overview and clear selection
      document.querySelectorAll(".Hotspot").forEach(h => {
        h.classList.remove("active", "dimmed");
      });
      highlightMenu("site");
      hideInfo();

      // Simple overview orbit (you can tweak these numbers)
      viewer.cameraOrbit  = `0deg 75deg 40m`;
      viewer.cameraTarget = `0m 5m 0m`;
      return;
    }

    const id = parseInt(target);
    tourIndex = steps.findIndex(s => s.id === id);
    activateHotspot(id);
  };
});

/* CLICKING HOTSPOTS IN 3D VIEW */
viewer.addEventListener("load", () => {
  viewer.querySelectorAll(".Hotspot").forEach(h => {
    h.addEventListener("click", () => {
      const id = parseInt(h.slot.replace("hotspot-", ""));
      tourIndex = steps.findIndex(s => s.id === id);
      activateHotspot(id);
    });
  });
});

/* SPECIAL EFFECT TOGGLE */
const toggleBtn = document.getElementById("toggle-background");

toggleBtn.onclick = () => {
  backgroundEnabled = !backgroundEnabled;

  if (backgroundEnabled) {
    viewer.environmentImage = "spruit_sunrise_1k_HDR.hdr";
    toggleBtn.classList.add("active");
    toggleBtn.classList.remove("inactive");
  } else {
    viewer.removeAttribute("environment-image");
    toggleBtn.classList.remove("active");
    toggleBtn.classList.add("inactive");
  }
};

/* AR BUTTON */
document.getElementById("ar-button").onclick = () => {
  if (viewer.canActivateAR) {
    viewer.activateAR();
  } else {
    alert("AR is not supported on this device.");
  }
};
