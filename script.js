document.addEventListener("DOMContentLoaded", () => {

  const viewer = document.getElementById("viewer");
  const sidebar = document.getElementById("sidebar");
  const toggle = document.getElementById("sidebarToggle");
  const container = document.getElementById("hotspotContainer");

  toggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  const hotspotData = [
    {
      name: "Dirty-water",
      desc: "This is the mucky water from toilets, sinks and rain washing along the streets. All that yucky stuff travels through pipes to get cleaned.",
      img: "images/dirty-water.webp"
    },
    {
      name: "Cleaned-water",
      desc: "This water has had the big bits removed. It’s not drinking water, but it’s much cleaner than before.",
      img: "images/cleaned-water.webp"
    },
    {
      name: "Tank Inlet",
      desc: "This is the doorway where screened dirty water enters the underground tank to wait its turn.",
      img: "images/tank-inlet.webp"
    },
    {
      name: "Underground Tank",
      desc: "This giant hidden tank stores extra water during heavy rain so the system doesn’t overflow.",
      img: "images/underground-tank.webp"
    },
    {
      name: "Pumps",
      desc: "These big machines push water back into the system when there’s space again. Like strong water muscles!",
      img: "images/pumps.webp"
    },
    {
      name: "Taps",
      desc: "These valves turn the flow on or off for the pumps — like a giant tap at home.",
      img: "images/taps.webp"
    },
    {
      name: "Return-water",
      desc: "This is where pumped water returns to continue its journey through the sewer system.",
      img: "images/return-water.webp"
    },
    {
      name: "Send to water cleaner",
      desc: "This pipe sends water to the sewage treatment works to be properly cleaned.",
      img: "images/send-to-water-cleaner.webp"
    },
    {
      name: "Power",
      desc: "This is the control room brain. It tells all the machines when to switch on or off.",
      img: "images/power.webp"
    },
    {
      name: "River",
      desc: "After proper treatment, water eventually returns safely to the river.",
      img: "images/river.webp"
    },
    {
      name: "Emergency overflow",
      desc: "Only used in very heavy storms to prevent flooding. A safety release point.",
      img: "images/emergency-overflow.webp"
    },
    {
      name: "Johnny",
      desc: "Johnny shows how big everything is. He stands next to the valve chamber to give you a sense of scale.",
      img: "images/johnny.webp"
    }
  ];

  hotspotData.forEach(data => {

    const section = document.createElement("div");
    section.className = "hotspot-section";

    section.innerHTML = `
      <h3>${data.name}</h3>
      <p>${data.desc}</p>
      <img src="${data.img}" alt="${data.name}" />
    `;

    container.appendChild(section);
  });

});
