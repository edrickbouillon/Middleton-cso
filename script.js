/* ============================================================
   MODEL VIEWER + PROGRESS BAR
   ============================================================ */
const viewer = document.getElementById("viewer");

viewer.addEventListener("progress", (e) => {
  const bar = viewer.querySelector(".update-bar");
  bar.style.width = `${e.detail.totalProgress * 100}%`;
});

/* ============================================================
   HOTSPOT DEFINITIONS (MATCHING NEW CLIENT TEXT)
   ============================================================ */
const hotspotInfo = {
  1: {
    name: "Wastewater",
    text: "Wastewater from the sewer network travels down this pipe before entering the storm tank."
  },
  2: {
    name: "Spill to storm tank",
    text: "When the sewer fills up during heavy rain, wastewater mixes with rainwater and causes the water level to rise. Once it reaches this higher pipe, the excess flow is screened to remove debris before being carried to the storage tank."
  },
  3: {
    name: "Tank inlet",
    text: "This is where stormwater enters the storage tank during heavy rain. Most of the time it stays dry, but when the system becomes full, extra stormwater flows in here to stop the sewer network from overflowing."
  },
  4: {
    name: "Underground storage tank",
    text: "This tank stores extra stormwater underground until the sewers have space for it again."
  },
  5: {
    name: "Pumps",
    text: "The pumps move any remaining stormwater out of the storage tank and send it back to the treatment works to be cleaned once the heavy rain has passed."
  },
  6: {
    name: "Taps",
    text: "The taps act like a one-way system to let water flow out of the storage tank but close if it tries to flow back the wrong way."
  },
  7: {
    name: "Return water",
    text: "Once the heavy rain has passed, this pipe carries the stormwater that’s been emptied from the storage tank back into the sewer network."
  },
  8: {
    name: "Treatment works",
    text: "This pipe carries wastewater to the treatment works where it is cleaned."
  },
  9: {
    name: "Power supply",
    text: "This provides the electricity needed to power the pumps and the screen so the tanks can work properly during and after heavy rain."
  },
  10: {
    name: "Overflow",
    text: "The overflow is only used when both the storm tank and storage tank are completely full. Extra stormwater is screened before being released into the river."
  },
  11: {
    name: "Engineer",
    text: "The engineer works hard, checking the tank and equipment to make sure everything is working properly."
  }
};

/* ============================================================
   FLOATING BUBBLE
   ============================================================ */
const bubble = document.getElementById("floating-bubble");

function showBubble(text, position) {
  bubble.innerText = text;
  bubble.classList.remove("hidden");

  // Convert 3D position to screen position
  const worldPos = position.split(" ").map(v => parseFloat(v));
  const offsetY = worldPos[1] - 0.5; // 0.5m below hotspot

  const screenPos = viewer.positionAndNormalFromPoint(
    {x: worldPos[0], y: offsetY, z: worldPos[2]}
  );

  if (screenPos) {
    bubble.style.left = `${screenPos.position.x}px`;
    bubble.style.top = `${screenPos.position.y}px`;
  }
}

function hideBubble() {
  bubble.classList.add("hidden");
}

/* ============================================================
   CAMERA MOVEMENT
   ============================================================ */
function moveCameraToHotspot(hotspotEl) {
  const [x, y, z] = hotspotEl.dataset.position.split(" ").map(parseFloat);

  const theta = Math.atan2(z, x);
  const phi = Math.PI / 4;
  const radius = 12;

  viewer.cameraOrbit = `${theta}rad ${phi}rad ${radius}m`;
  viewer.cameraTarget = `${x}m ${y}m ${z}m`;
}

/* ============================================================
   ACTIVATE HOTSPOT
   ============================================================ */
function activateHotspot(id) {
  hideBubble();

  // Hide all hotspot labels
  viewer.querySelectorAll(".HotspotAnnotation").forEach(a => {
    a.style.display = "none";
  });

  const hotspotEl = viewer.querySelector(`[slot="hotspot-${id}"]`);
  if (!hotspotEl) return;

  // Show only active label
  hotspotEl.querySelector(".HotspotAnnotation").style.display = "block";

  // Move camera
  moveCameraToHotspot(hotspotEl);

  // Show bubble
  showBubble(hotspotInfo[id].text, hotspotEl.dataset.position);
}

/* ============================================================
   ICON BAR EVENTS
   ============================================================ */
document.querySelectorAll(".icon-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;

    if (target === "site") {
      // Zoom-out view
      viewer.cameraOrbit = `0deg 75deg auto`;
      viewer.cameraTarget = `0m 0m 0m`;
      hideBubble();
      return;
    }

    activateHotspot(parseInt(target));
  });
});

/* ============================================================
   MENU PANEL
   ============================================================ */
document.getElementById("menu-button").onclick = () => {
  document.getElementById("menu-panel").classList.toggle("hidden");
};

/* ============================================================
   AR BUTTON
   ============================================================ */
const arButton = document.getElementById("ar-button");

arButton.addEventListener("click", () => {
  if (viewer.canActivateAR) {
    viewer.activateAR();
  } else {
    alert("AR is not supported on this device.");
  }
});
