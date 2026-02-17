// -------------------------------------------------------------
// 1. EXISTING PROGRESS BAR HANDLER
// -------------------------------------------------------------
const viewer = document.querySelector('model-viewer');

const onProgress = (event) => {
  const progressBar = event.target.querySelector('.progress-bar');
  const updatingBar = event.target.querySelector('.update-bar');
  updatingBar.style.width = `${event.detail.totalProgress * 100}%`;

  if (event.detail.totalProgress === 1) {
    progressBar.classList.add('hide');
    event.target.removeEventListener('progress', onProgress);
  } else {
    progressBar.classList.remove('hide');
  }
};
viewer.addEventListener('progress', onProgress);

// -------------------------------------------------------------
// 2. CAMERA ANIMATION ENGINE
// -------------------------------------------------------------
function animateCamera({ targetOrbit, targetFov, targetPosition, duration = 1200 }) {
  const startOrbit = viewer.getCameraOrbit();
  const startFov = viewer.getFieldOfView();
  const startTarget = viewer.getCameraTarget();

  const start = performance.now();

  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = easeOutCubic(t);

    const newTheta = startOrbit.theta + (targetOrbit.theta - startOrbit.theta) * eased;
    const newPhi = startOrbit.phi + (targetOrbit.phi - startOrbit.phi) * eased;
    const newRadius = startOrbit.radius + (targetOrbit.radius - startOrbit.radius) * eased;

    const newFov = startFov + (targetFov - startFov) * eased;

    const newX = startTarget.x + (targetPosition.x - startTarget.x) * eased;
    const newY = startTarget.y + (targetPosition.y - startTarget.y) * eased;
    const newZ = startTarget.z + (targetPosition.z - startTarget.z) * eased;

    viewer.cameraOrbit = `${newTheta}rad ${newPhi}rad ${newRadius}m`;
    viewer.fieldOfView = `${newFov}deg`;
    viewer.cameraTarget = `${newX}m ${newY}m ${newZ}m`;

    if (t < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// -------------------------------------------------------------
// 3. ZOOM PROFILES + DESCRIPTIONS
// -------------------------------------------------------------
const tourSteps = [
  {
    slot: "hotspot-1",
    label: "Pumps",
    description: "These pumps transfer flow through the CSO system.",
    distance: 5,
    fov: 20
  },
  {
    slot: "hotspot-2",
    label: "Detention Tank",
    description: "The detention tank stores excess stormwater.",
    distance: 12,
    fov: 30
  },
  {
    slot: "hotspot-3",
    label: "Motor Control Centre",
    description: "The MCC houses electrical control equipment.",
    distance: 8,
    fov: 25,
    rotate: true
  },
  {
    slot: "hotspot-4",
    label: "Valves",
    description: "Valves regulate flow direction and isolation.",
    distance: 10,
    fov: 28
  },
  {
    slot: "hotspot-5",
    label: "Storm Screen",
    description: "Screens remove debris during storm events.",
    distance: 14,
    fov: 35
  },
  {
    slot: "hotspot-6",
    label: "Overflow",
    description: "Overflow structure protects the system during surges.",
    distance: 25,
    fov: 45
  },
  {
    slot: "hotspot-7",
    label: "River Wharfe",
    description: "Final discharge point into the River Wharfe.",
    distance: 40,
    fov: 60
  }
];

// -------------------------------------------------------------
// 4. HOTSPOT CLICK HANDLING
// -------------------------------------------------------------
viewer.querySelectorAll('.Hotspot').forEach(hotspot => {
  hotspot.addEventListener('click', () => {
    const slot = hotspot.getAttribute('slot');
    const step = tourSteps.find(s => s.slot === slot);
    if (!step) return;

    moveToStep(step);
    updateSidebar(step);
  });
});

// -------------------------------------------------------------
// 5. MOVE CAMERA TO A TOUR STEP
// -------------------------------------------------------------
function moveToStep(step) {
  const pos = viewer.querySelector(`[slot="${step.slot}"]`).dataset.position
    .split(" ")
    .map(v => parseFloat(v));

  const targetPosition = { x: pos[0], y: pos[1], z: pos[2] };

  const theta = Math.atan2(targetPosition.z, targetPosition.x);
  const phi = Math.PI / 4;

  const targetOrbit = {
    theta,
    phi,
    radius: step.distance
  };

  animateCamera({
    targetOrbit,
    targetFov: step.fov,
    targetPosition
  });
}

// -------------------------------------------------------------
// 6. SIDEBAR + TOUR UI
// -------------------------------------------------------------
let currentStep = 0;

function updateSidebar(step) {
  document.getElementById("tour-title").innerText = step.label;
  document.getElementById("tour-description").innerText = step.description;
}

document.getElementById("tour-next").addEventListener("click", () => {
  currentStep = (currentStep + 1) % tourSteps.length;
  const step = tourSteps[currentStep];
  moveToStep(step);
  updateSidebar(step);
});

document.getElementById("tour-prev").addEventListener("click", () => {
  currentStep = (currentStep - 1 + tourSteps.length) % tourSteps.length;
  const step = tourSteps[currentStep];
  moveToStep(step);
  updateSidebar(step);
});

document.getElementById("tour-start").addEventListener("click", () => {
  currentStep = 0;
  const step = tourSteps[currentStep];
  moveToStep(step);
  updateSidebar(step);
});

// -------------------------------------------------------------
// 7. FLOATING HOTSPOT LIST
// -------------------------------------------------------------
const listContainer = document.getElementById("hotspot-list");

tourSteps.forEach(step => {
  const btn = document.createElement("button");
  btn.className = "hotspot-list-item";
  btn.innerText = step.label;
  btn.addEventListener("click", () => {
    moveToStep(step);
    updateSidebar(step);
  });
  listContainer.appendChild(btn);
});
