const viewer = document.getElementById("viewer");

/* PROGRESS BAR */
viewer.addEventListener("progress", (e) => {
  const bar = viewer.querySelector(".update-bar");
  bar.style.width = `${e.detail.totalProgress * 100}%`;
});

/* CAMERA ANIMATION */
function animateCamera(targetOrbit, targetFov, targetTarget) {
  viewer.cameraOrbit = `${targetOrbit.theta}rad ${targetOrbit.phi}rad ${targetOrbit.radius}m`;
  viewer.fieldOfView = `${targetFov}deg`;
  viewer.cameraTarget = `${targetTarget.x}m ${targetTarget.y}m ${targetTarget.z}m`;
}

/* TOUR STEPS */
const tourSteps = [
  { slot: "hotspot-1", label: "Pumps", desc: "Transfer flow through CSO.", dist: 5, fov: 20 },
  { slot: "hotspot-2", label: "Detention Tank", desc: "Stormwater storage.", dist: 12, fov: 30 },
  { slot: "hotspot-3", label: "MCC", desc: "Electrical control equipment.", dist: 8, fov: 25 },
  { slot: "hotspot-4", label: "Valves", desc: "Flow isolation and control.", dist: 10, fov: 28 },
  { slot: "hotspot-5", label: "Storm Screen", desc: "Debris screening.", dist: 14, fov: 35 },
  { slot: "hotspot-6", label: "Overflow", desc: "System protection.", dist: 25, fov: 45 },
  { slot: "hotspot-7", label: "River Wharfe", desc: "Final discharge point.", dist: 40, fov: 60 }
];

let currentStep = 0;

/* MOVE TO STEP */
function goToStep(step) {
  const el = viewer.querySelector(`[slot="${step.slot}"]`);
  const [x,y,z] = el.dataset.position.split(" ").map(v => parseFloat(v));

  animateCamera(
    { theta: Math.atan2(z, x), phi: Math.PI / 4, radius: step.dist },
    step.fov,
    { x, y, z }
  );

  document.getElementById("tour-title").innerText = step.label;
  document.getElementById("tour-description").innerText = step.desc;
}

/* SIDEBAR BUTTONS */
document.getElementById("tour-start").onclick = () => goToStep(tourSteps[currentStep = 0]);
document.getElementById("tour-next").onclick = () => goToStep(tourSteps[currentStep = (currentStep + 1) % tourSteps.length]);
document.getElementById("tour-prev").onclick = () => goToStep(tourSteps[currentStep = (currentStep - 1 + tourSteps.length) % tourSteps.length]);

/* HOTSPOT CLICKS */
viewer.querySelectorAll(".Hotspot").forEach((hs, i) => {
  hs.onclick = () => {
    currentStep = i;
    goToStep(tourSteps[i]);
  };
});

/* HOTSPOT LIST */
const list = document.getElementById("hotspot-list");
tourSteps.forEach((s, i) => {
  const btn = document.createElement("button");
  btn.className = "hotspot-list-item";
  btn.innerText = s.label;
  btn.onclick = () => {
    currentStep = i;
    goToStep(s);
  };
  list.appendChild(btn);
});

/* SIDEBAR TOGGLE */
document.getElementById("sidebar-toggle").onclick = () => {
  document.getElementById("tour-sidebar").classList.toggle("collapsed");
};
