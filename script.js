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
  { name: "Dirty-water", explanation: "...", photo: "...", fov: 22, dist: 4, rotate: Math.PI/2 },
  { name: "Cleaned-water", explanation: "...", photo: "...", fov: 25, dist: 5, rotate: 0 },
  { name: "Tank Inlet", explanation: "...", photo: "...", fov: 25, dist: 5, rotate: Math.PI },
  { name: "Underground Tank", explanation: "...", photo: "...", fov: 30, dist: 8, rotate: Math.PI },
  { name: "Pumps", explanation: "...", photo: "...", fov: 20, dist: 4, rotate: Math.PI },
  { name: "Taps", explanation: "...", photo: "...", fov: 22, dist: 4, rotate: Math.PI },
  { name: "Return-water", explanation: "...", photo: "...", fov: 28, dist: 5, rotate: Math.PI/2 },
  { name: "Send to water cleaner", explanation: "...", photo: "...", fov: 25, dist: 5, rotate: 0 },
  { name: "Power", explanation: "...", photo: "...", fov: 30, dist: 4, rotate: Math.PI/2 },
  { name: "River", explanation: "...", photo: "...", fov: 35, dist: 8, rotate: -Math.PI/2 },
  { name: "Emergency overflow", explanation: "...", photo: "...", fov: 35, dist: 4, rotate: -Math.PI/2 },
  { name: "Johnny", explanation: "...", photo: "...", fov: 20, dist: 4, rotate: Math.PI }
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
  hotspotEl.classList.add("active");

  // Extract hotspot coordinates
  const [x, y, z] = hotspotEl.dataset.position
    .split(" ")
    .map(v => parseFloat(v));

  // Natural facing direction (theta)
  let theta = Math.atan2(z, x);

  // Apply your custom rotation offset
  theta += step.rotate;

  // Camera vertical angle (phi)
  const phi = Math.PI / 4;

  // Apply your custom radius
  const radius = step.dist;

  // Animate camera
  animateCamera(
    { theta, phi, radius },
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
  const powerHotspot = viewer.querySelector(`[slot="hotspot-9"]`);
  const sendHotspot = viewer.querySelector(`[slot="hotspot-8"]`);

  const [px, py, pz] = powerHotspot.dataset.position.split(" ").map(parseFloat);
  const [sx, sy, sz] = sendHotspot.dataset.position.split(" ").map(parseFloat);

  // Compute Send-to-water-cleaner camera angle
  const theta = Math.atan2(sz, sx);
  const phi = Math.PI / 4;

  animateCamera(
    { theta, phi, radius: startView.dist },
    startView.fov,
    { x: px, y: py, z: pz }
  );

  // Sidebar
  document.getElementById("hotspot-name").innerText = startView.name;
  document.getElementById("hotspot-explanation").innerText = startView.explanation;
  document.getElementById("hotspot-photo").innerText = "";
  document.getElementById("photo-image").style.display = "none";

  viewer.querySelectorAll(".Hotspot").forEach(h => h.classList.remove("active"));

  currentStep = -1;
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
