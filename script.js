/* ============================
   MODEL VIEWER + PROGRESS BAR
   ============================ */
const viewer = document.getElementById("viewer");

viewer.addEventListener("progress", (e) => {
  const bar = viewer.querySelector(".update-bar");
  bar.style.width = `${e.detail.totalProgress * 100}%`;
});

/* ============================
   CAMERA ANIMATION
   ============================ */
function animateCamera(targetOrbit, targetFov, targetTarget) {
  viewer.cameraOrbit = `${targetOrbit.theta}rad ${targetOrbit.phi}rad ${targetOrbit.radius}m`;
  viewer.fieldOfView = `${targetFov}deg`;
  viewer.cameraTarget = `${targetTarget.x}m ${targetTarget.y}m ${targetTarget.z}m`;
}

/* ============================
   START VIEW (FULL MODEL)
   ============================ */
const startView = {
  name: "Collective Dirty Water Overflow",
  explanation:
    "This is the whole CSO system working together. All the dirty water from homes, streets and rainstorms comes here to be safely managed. Press NEXT and I’ll show you each part step by step!",
  photo: "",
  fov: 65,
  dist: 120
};

/* ============================
   HOTSPOT DATA (12 ITEMS)
   ============================ */
const hotspotData = [
  {
    name: "Dirty-water",
    explanation:
      "This is the mucky water that comes from toilets, sinks and rain washing along the streets. All that yucky stuff travels through pipes to get cleaned.",
    photo: "Take a photo showing the inlet where the dirty water first arrives.",
    fov: 22,
    dist: 6
  },
  {
    name: "Cleaned-water",
    explanation:
      "This water has had the big bits and rubbish taken out of it. It’s not drinking water, but it’s much cleaner than before.",
    photo: "Capture the area where the cleaned water flows out.",
    fov: 25,
    dist: 8
  },
  {
    name: "Tank Inlet",
    explanation:
      "This is the doorway where the screened dirty water goes into the big underground tank to wait its turn.",
    photo: "Photograph the inlet pipe leading into the tank.",
    fov: 25,
    dist: 7
  },
  {
    name: "Underground Tank",
    explanation:
      "This giant hidden tank is like a holding pen underground. It keeps extra dirty water safe during heavy rain so the system doesn’t get overwhelmed.",
    photo: "Take a photo showing the tank access area.",
    fov: 30,
    dist: 10
  },
  {
    name: "Pumps",
    explanation:
      "These powerful machines push the dirty water back into the system when there’s space again. Think of them like big water-moving muscles!",
    photo: "Photograph the pump housings or pump access covers.",
    fov: 20,
    dist: 5
  },
  {
    name: "Taps",
    explanation:
      "These are special valves that can turn the water flow on or off for the pumps. Like a tap at home, but much bigger and much stronger.",
    photo: "Capture the valve handles or tap mechanisms.",
    fov: 22,
    dist: 6
  },
  {
    name: "Return-water",
    explanation:
      "This is where the pumped water goes back into the main sewer system to continue its journey.",
    photo: "Take a photo of the return pipework.",
    fov: 28,
    dist: 8
  },
  {
    name: "Send to water cleaner",
    explanation:
      "This pipe sends the dirty water to the sewage treatment works where it gets properly cleaned before being released safely.",
    photo: "Photograph the outgoing pipe to the treatment works.",
    fov: 25,
    dist: 7
  },
  {
    name: "Power",
    explanation:
      "This is the Motor Control Centre — the brain box of the site. It tells the pumps and equipment when to switch on and off.",
    photo: "Capture the MCC cabinet or electrical control area.",
    fov: 30,
    dist: 10
  },
  {
    name: "River",
    explanation:
      "This is the nearby river. After water is properly treated and safe, it eventually returns here.",
    photo: "Take a photo showing the river outfall direction.",
    fov: 35,
    dist: 15
  },
  {
    name: "Emergency overflow",
    explanation:
      "If there’s too much water during a huge storm, this is the safety release point to stop flooding. It’s only used in emergencies.",
    photo: "Photograph the overflow structure.",
    fov: 35,
    dist: 15
  },
  {
    name: "Johnny",
    explanation:
      "This is Johnny! He’s here to show how big everything is. Standing next to the valve chamber helps you see the true size of the site.",
    photo: "Take a fun photo of Johnny next to the equipment.",
    fov: 20,
    dist: 5
  }
];

/* ============================
   TOUR LOGIC
   ============================ */
let currentStep = 0;

function goToStep(index) {
  const step = hotspotData[index];
  const hotspotEl = viewer.querySelector(`[slot="hotspot-${index + 1}"]`);
  if (!hotspotEl) return;

  // Remove highlight from all hotspots
  viewer.querySelectorAll(".Hotspot").forEach(h => h.classList.remove("active"));

  // Highlight active hotspot
  hotspotEl.classList.add("active");

  // Camera movement
  const [x, y, z] = hotspotEl.dataset.position
    .split(" ")
    .map(v => parseFloat(v));

  animateCamera(
    {
      theta: Math.atan2(z, x),
      phi: Math.PI / 4,
      radius: step.dist
    },
    step.fov,
    { x, y, z }
  );

  // Sidebar text
  document.getElementById("hotspot-name").innerText = step.name;
  document.getElementById("hotspot-explanation").innerText = step.explanation;
  document.getElementById("hotspot-photo").innerText = step.photo;

  // Sidebar image (slug-safe)
  const img = document.getElementById("photo-image");
  const slug = step.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  img.src = `images/${slug}.webp`;
  img.style.display = "block";

  currentStep = index;
}

/* ============================
   SIDEBAR BUTTONS
   ============================ */
document.getElementById("tour-start").onclick = () => {
  // Reset camera to full model view
  animateCamera(
    { theta: 0, phi: Math.PI / 4, radius: startView.dist },
    startView.fov,
    { x: 0, y: 10, z: 0 }
  );

  // Sidebar text
  document.getElementById("hotspot-name").innerText = startView.name;
  document.getElementById("hotspot-explanation").innerText = startView.explanation;
  document.getElementById("hotspot-photo").innerText = "";
  document.getElementById("photo-image").style.display = "none";

  // Remove hotspot highlight
  viewer.querySelectorAll(".Hotspot").forEach(h => h.classList.remove("active"));

  currentStep = -1; // NEXT starts at Dirty-water
};

document.getElementById("tour-next").onclick = () => {
  if (currentStep === -1) {
    currentStep = 0; // Start at Dirty-water
  } else {
    currentStep = (currentStep + 1) % hotspotData.length;
  }
  goToStep(currentStep);
};

document.getElementById("tour-prev").onclick = () => {
  currentStep = (currentStep - 1 + hotspotData.length) % hotspotData.length;
  goToStep(currentStep);
};

/* ============================
   HOTSPOT CLICK EVENTS
   ============================ */
viewer.querySelectorAll(".Hotspot").forEach((hs, i) => {
  hs.onclick = () => goToStep(i);
});

/* ============================
   FLOATING HOTSPOT LIST
   ============================ */
const list = document.getElementById("hotspot-list");

hotspotData.forEach((step, i) => {
  const btn = document.createElement("button");
  btn.className = "hotspot-list-item";
  btn.innerText = step.name;
  btn.onclick = () => goToStep(i);
  list.appendChild(btn);
});

/* ============================
   SIDEBAR COLLAPSE
   ============================ */
document.getElementById("sidebar-toggle").onclick = () => {
  document.getElementById("tour-sidebar").classList.toggle("collapsed");
};

/* ============================
   AR BUTTON
   ============================ */
const arButton = document.getElementById("ar-button");

arButton.addEventListener("click", () => {
  if (viewer.canActivateAR) {
    viewer.activateAR();
  } else {
    alert("AR is not supported on this device.");
  }
});
