const viewer = document.getElementById("viewer");

viewer.addEventListener("progress", (e) => {
  const bar = viewer.querySelector(".update-bar");
  bar.style.width = `${e.detail.totalProgress * 100}%`;
});

const hotspotInfo = {
  1: { text: "Wastewater from the sewer network travels down this pipe before entering the storm tank." },
  2: { text: "When the sewer fills up during heavy rain, wastewater mixes with rainwater and causes the water level to rise." },
  3: { text: "This is where stormwater enters the storage tank during heavy rain." },
  4: { text: "This tank stores extra stormwater underground until the sewers have space for it again." },
  5: { text: "The pumps move any remaining stormwater out of the storage tank." },
  6: { text: "The taps act like a one-way system to let water flow out of the storage tank." },
  7: { text: "This pipe carries stormwater emptied from the storage tank back into the sewer network." },
  8: { text: "This pipe carries wastewater to the treatment works where it is cleaned." },
  9: { text: "This provides the electricity needed to power the pumps and the screen." },
  10:{ text: "The overflow is only used when both tanks are completely full." },
  11:{ text: "The engineer checks the tank and equipment to ensure everything works properly." }
};

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

const PHI_HOTSPOT = 0.349;     // 20°
const PHI_SITE = 1.22173;      // 70°

const bubble = document.getElementById("floating-bubble");

function showBubble(text, position) {
  bubble.innerText = text;
  bubble.classList.remove("hidden");

  const [x, y, z] = position.split(" ").map(parseFloat);
  const offset = { x, y: y - 0.5, z };

  const screen = viewer.positionAndNormalFromPoint(offset);

  if (screen && screen.position) {
    bubble.style.left = `${screen.position.x}px`;
    bubble.style.top = `${screen.position.y}px`;
  }
}

function hideBubble() {
  bubble.classList.add("hidden");
}

function moveCameraToHotspot(hotspotEl, id) {
  const [x, y, z] = hotspotEl.dataset.position.split(" ").map(parseFloat);

  let theta = Math.atan2(z, x);
  theta += cameraOffsets[id];

  const radius = cameraRadius[id];

  viewer.cameraOrbit = `${theta}rad ${PHI_HOTSPOT}rad ${radius}m`;
  viewer.cameraTarget = `${x}m ${y}m ${z}m`;
}

function activateHotspot(id) {
  hideBubble();

  viewer.querySelectorAll(".HotspotAnnotation").forEach(a => {
    a.style.display = "none";
  });

  const hotspotEl = viewer.querySelector(`[slot="hotspot-${id}"]`);
  if (!hotspotEl) return;

  hotspotEl.querySelector(".HotspotAnnotation").style.display = "block";

  moveCameraToHotspot(hotspotEl, id);

  showBubble(hotspotInfo[id].text, hotspotEl.dataset.position);
}

document.querySelectorAll(".menu-item").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;

    if (target === "site") {
      const tankInlet = viewer.querySelector('[slot="hotspot-3"]');
      const [x, y, z] = tankInlet.dataset.position.split(" ").map(parseFloat);

      viewer.cameraOrbit = `0rad ${PHI_SITE}rad 40m`;
      viewer.cameraTarget = `${x}m ${y}m ${z}m`;

      hideBubble();
      return;
    }

    activateHotspot(parseInt(target));
  });
});

document.getElementById("menu-button").onclick = () => {
  document.getElementById("menu-panel").classList.toggle("hidden");
};

document.getElementById("ar-button").addEventListener("click", () => {
  if (viewer.canActivateAR) viewer.activateAR();
  else alert("AR is not supported on this device.");
});
