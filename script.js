const viewer = document.getElementById("viewer");
const info   = document.getElementById("hotspot-info");

let tourIndex = -1;
let backgroundEnabled = false;   // Special Effect starts OFF

// CAMERA CONSTANTS
const PHI_HOTSPOT = 1.22173;    // 70°
const PHI_SITE    = 1.22173;    // 70°

/* CAMERA OFFSETS (per-hotspot) */
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

/* CAMERA RADII (0 → 0.1 fix) */
const cameraRadius = {
  1: 3,
  2: 0.1,
  3: 3,
  4: 3,
  5: 0.1,
  6: 0.1,
  7: 3,
  8: 3,
  9: 3,
  10: 3,
  11: 0.1
};

/* TEXT FOR EACH HOTSPOT — updated with <span class="title"> */
const steps = [
  { id: 1,  text: "<span class='title'>Wastewater</span>Wastewater from the sewer network travels down this pipe before entering the storm tank." },

  { id: 2,  text: "<span class='title'>Spill to storm tank</span>When the sewer fills up during heavy rain, wastewater mixes with rainwater and causes the water level to rise. Once it reaches this higher pipe, the excess flow is screened to remove debris before being carried to the storage tank." },

  { id: 3,  text: "<span class='title'>Tank inlet</span>This is where stormwater enters the storage tank during heavy rain. Most of the time it stays dry, but when the system becomes full, extra stormwater flows in here to stop the sewer network from overflowing." },

  { id: 4,  text: "<span class='title'>Underground storage tank</span>This tank stores extra stormwater underground until the sewers have space for it again." },

  { id: 5,  text: "<span class='title'>Pumps</span>The pumps move any remaining stormwater out of the storage tank and send it back to the treatment works to be cleaned once the heavy rain has passed." },

  { id: 6,  text: "<span class='title'>Taps</span>The taps act like a one-way system to let water flow out of the storage tank, but close if it tries to flow back the wrong way. This keeps the flow moving safely back to the sewer network after the heavy rain has passed." },

  { id: 7,  text: "<span class='title'>Return water</span>Once the heavy rain has passed, this pipe carries the stormwater that’s been emptied from the storage tank back into the sewer network, where it continues on to the treatment works as normal." },

  { id: 8,  text: "<span class='title'>Treatment works</span>This pipe carries wastewater to the treatment works, where it is cleaned. It’s always in use, but the pipes above only come into use during heavy rainfall, when the water level rises high enough to reach them." },

  { id: 9,  text: "<span class='title'>Power supply</span>This provides the electricity needed to power the pumps and the screen so the tanks can work properly during and after heavy rain." },

  { id: 10, text: "<span class='title'>Spill to environment</span>The overflow is only used when both the storm tank and storage tank are completely full. When this happens, any extra stormwater is screened before it’s released into the river." },

  { id: 11, text: "<span class='title'>Engineer</span>The engineer works hard, checking the tank and equipment to make sure everything is working properly." }
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

/* FIXED INFO BOX — updated to innerHTML */
function showInfo(text) {
  info.innerHTML = text;
  info.classList.remove("hidden");
  info.classList.add("active");
}

function hideInfo() {
  info.classList.add("hidden");
  info.classList.remove("active");
}

/* CAMERA MOVEMENT */
function moveCamera(hotspot, id) {
  if (!hotspot) return;

  const [x, y, z] = hotspot.dataset.position
    .split(" ")
    .map(v => parseFloat(v.replace("m", "")));

  let theta = Math.atan2(z, x);
  const offset = cameraOffsets[id] || 0;
  theta += offset;

  const radius = cameraRadius[id] || 3;

  viewer.cameraOrbit  = `${theta}rad ${PHI_HOTSPOT}rad ${radius}m`;
  viewer.cameraTarget = `${x}m ${y}m ${z}m`;
}

/* ACTIVATE HOTSPOT */
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
document.getElementById("tour-next").onclick  = nextStep;
document.getElementById("tour-prev").onclick  = prevStep;

/* MENU BUTTON TOGGLE */
document.getElementById("menu-button").onclick = () => {
  document.getElementById("menu-panel").classList.toggle("hidden");
};

/* MENU ITEM CLICKS (including CSO Site) */
document.querySelectorAll(".menu-item").forEach(btn => {
  btn.onclick = () => {
    const target = btn.dataset.target;

    if (target === "site") {
      const tankInlet = viewer.querySelector('[slot="hotspot-3"]');
      if (!tankInlet) return;

      const [x, y, z] = tankInlet.dataset.position
        .split(" ")
        .map(v => parseFloat(v.replace("m", "")));

      let theta = Math.atan2(z, x);
      theta += Math.PI;

      document.querySelectorAll(".Hotspot").forEach(h => {
        h.classList.remove("active", "dimmed");
      });

      highlightMenu("site");
      hideInfo();

      viewer.cameraOrbit  = `${theta}rad ${PHI_SITE}rad 40m`;
      viewer.cameraTarget = `${x}m ${y}m ${z}m`;
      return;
    }

    const id = parseInt(target);
    if (Number.isNaN(id)) return;

    tourIndex = steps.findIndex(s => s.id === id);
    activateHotspot(id);
  };
});

/* CLICKING HOTSPOTS IN 3D VIEW */
viewer.addEventListener("load", () => {
  viewer.querySelectorAll(".Hotspot").forEach(h => {
    h.addEventListener("click", () => {
      const id = parseInt(h.slot.replace("hotspot-", ""));
      if (Number.isNaN(id)) return;
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
