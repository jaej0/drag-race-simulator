const cars = [
  {
    id: 1,
    name: "Street King",
    className: "Pro Street",
    hp: 760,
    weight: 3150,
    launch: 72,
    topSpeed: 168,
    colorA: "#38bdf8",
    colorB: "#ec4899",
    rating: 9.2,
  },
  {
    id: 2,
    name: "Nitro X",
    className: "Top Fuel",
    hp: 930,
    weight: 2480,
    launch: 81,
    topSpeed: 186,
    colorA: "#f59e0b",
    colorB: "#ef4444",
    rating: 9.7,
  },
  {
    id: 3,
    name: "Carbon Pulse",
    className: "Street Outlaw",
    hp: 680,
    weight: 2890,
    launch: 76,
    topSpeed: 173,
    colorA: "#22c55e",
    colorB: "#14b8a6",
    rating: 9.1,
  },
  {
    id: 4,
    name: "Midnight R",
    className: "Grudge",
    hp: 850,
    weight: 2720,
    launch: 77,
    topSpeed: 180,
    colorA: "#a78bfa",
    colorB: "#60a5fa",
    rating: 9.5,
  },
];

const leaderboardSeed = [
  { name: "Luna Velo", et: "6.86" },
  { name: "Damon Sky", et: "7.02" },
  { name: "Cora Blaze", et: "7.14" },
  { name: "Evan Rush", et: "7.21" },
  { name: "Rex Kells", et: "7.33" },
];

const state = {
  selectedCarId: 1,
  bestEt: null,
  raceLog: ["Track lights are green. Ready for the next pass."],
};

const els = {
  carList: document.getElementById("carList"),
  selectedName: document.getElementById("selectedName"),
  selectedClass: document.getElementById("selectedClass"),
  selectedHp: document.getElementById("selectedHp"),
  selectedWeight: document.getElementById("selectedWeight"),
  selectedLaunch: document.getElementById("selectedLaunch"),
  selectedTopSpeed: document.getElementById("selectedTopSpeed"),
  selectedVisual: document.getElementById("selectedVisual"),
  launchControl: document.getElementById("launchControl"),
  launchValue: document.getElementById("launchValue"),
  boostLevel: document.getElementById("boostLevel"),
  boostValue: document.getElementById("boostValue"),
  trackPrep: document.getElementById("trackPrep"),
  weatherSelect: document.getElementById("weatherSelect"),
  raceMode: document.getElementById("raceMode"),
  opponentPool: document.getElementById("opponentPool"),
  runRaceBtn: document.getElementById("runRaceBtn"),
  resetBtn: document.getElementById("resetBtn"),
  resultBadge: document.getElementById("resultBadge"),
  userEt: document.getElementById("userEt"),
  userSpeed: document.getElementById("userSpeed"),
  rivalEt: document.getElementById("rivalEt"),
  rivalSpeed: document.getElementById("rivalSpeed"),
  reactionMetric: document.getElementById("reactionMetric"),
  sixtyMetric: document.getElementById("sixtyMetric"),
  speedMetric: document.getElementById("speedMetric"),
  leaderboardList: document.getElementById("leaderboardList"),
  raceLog: document.getElementById("raceLog"),
  trackName: document.getElementById("trackName"),
  weatherLabel: document.getElementById("weatherLabel"),
  bestEt: document.getElementById("bestEt"),
  powerReadout: document.getElementById("powerReadout"),
  userCarVisual: document.getElementById("userCarVisual"),
};

function formatEt(value) {
  return `${value.toFixed(2)} sec`;
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function renderCarList() {
  els.carList.innerHTML = "";

  cars.forEach((car) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `car-card ${car.id === state.selectedCarId ? "selected" : ""}`;
    card.innerHTML = `
      <div class="car-top">
        <div class="car-title">
          <strong>${car.name}</strong>
          <span>${car.className}</span>
        </div>
        <span class="pill">${car.rating.toFixed(1)}</span>
      </div>
      <div class="car-preview">
        <div class="car-body-mini" style="background: linear-gradient(90deg, ${car.colorA}, ${car.colorB});"></div>
      </div>
      <div class="car-metrics">
        <span>${car.hp} HP</span>
        <span>${car.topSpeed} mph</span>
      </div>
    `;

    card.addEventListener("click", () => {
      state.selectedCarId = car.id;
      renderDetails();
      renderCarList();
    });

    els.carList.appendChild(card);
  });
}

function renderDetails() {
  const car = cars.find((entry) => entry.id === state.selectedCarId);

  if (!car) return;

  els.selectedName.textContent = car.name;
  els.selectedClass.textContent = car.className;
  els.selectedHp.textContent = `${car.hp} HP`;
  els.selectedWeight.textContent = `${car.weight.toLocaleString()} lbs`;
  els.selectedLaunch.textContent = `${car.launch}%`;
  els.selectedTopSpeed.textContent = `${car.topSpeed} mph`;

  els.selectedVisual.innerHTML = `
    <div class="car-body" style="background: linear-gradient(90deg, ${car.colorA}, ${car.colorB}); width: 180px; left: 26px; bottom: 32px;"></div>
  `;

  els.powerReadout.textContent = `${car.hp} HP`;
  const userCarColor = `linear-gradient(90deg, ${car.colorA}, ${car.colorB})`;
  els.userCarVisual.style.background = userCarColor;

  const launch = Number(els.launchControl.value);
  const boost = Number(els.boostLevel.value);
  const combo = Math.round((launch + boost) / 2);
  els.launchValue.textContent = `${launch}%`;
  els.boostValue.textContent = `${boost}%`;

  const trackPrep = Number(els.trackPrep.value);
  const weather = Number(els.weatherSelect.value);
  const currentPower = Math.round(car.hp * (combo / 100) * trackPrep * weather);
  els.powerReadout.textContent = `${currentPower} HP`;
}

function renderLeaderboard() {
  const list = [...leaderboardSeed].sort((a, b) => parseFloat(a.et) - parseFloat(b.et));

  els.leaderboardList.innerHTML = "";

  list.forEach((entry, index) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <span class="rank">${index + 1}</span>
      <div class="driver-name">
        <strong>${entry.name}</strong>
        <span>Street series</span>
      </div>
      <span class="quick-et">${entry.et}</span>
    `;
    els.leaderboardList.appendChild(item);
  });
}

function renderRaceLog() {
  els.raceLog.innerHTML = "";
  state.raceLog.slice(-7).forEach((line) => {
    const item = document.createElement("li");
    item.textContent = line;
    els.raceLog.appendChild(item);
  });
}

function updateTrackMeta() {
  const weather = els.weatherSelect.options[els.weatherSelect.selectedIndex].text;
  const track = ["Vapor Strip", "Summit Grid", "Tarmac Pulse", "Northline"];
  const trackName = track[Math.floor(Math.random() * track.length)];
  els.trackName.textContent = trackName;
  els.weatherLabel.textContent = weather;
}

function runRace() {
  const car = cars.find((entry) => entry.id === state.selectedCarId);
  const launch = Number(els.launchControl.value);
  const boost = Number(els.boostLevel.value);
  const trackPrep = Number(els.trackPrep.value);
  const weather = Number(els.weatherSelect.value);
  const mode = Number(els.raceMode.value);
  const opponents = Number(els.opponentPool.value);

  const powerBias = ((launch + boost) / 200) * (car.hp / 1000);
  const launchFactor = (car.launch / 100) * (trackPrep * weather);
  const totalPower = car.hp * (0.4 + powerBias) * launchFactor;

  const yourReaction = randomBetween(0.12, 0.22);
  const rivalReaction = randomBetween(0.12, 0.28);

  const baseEt = 8.2 - (totalPower / 430) - (car.launch / 180) + (1 - trackPrep) * 0.2;
  const yourEt = Math.max(5.7, baseEt + randomBetween(-0.12, 0.28));
  const rivalEt = Math.max(5.8, yourEt + randomBetween(0.08, 0.65) + (opponents * 0.07));

  const userSpeed = Math.min(220, 120 + totalPower / 32 + randomBetween(0, 18));
  const rivalSpeed = Math.max(108, userSpeed - randomBetween(2, 15));

  const bestEt = state.bestEt !== null ? Math.min(state.bestEt, yourEt) : yourEt;
  state.bestEt = bestEt;

  els.userEt.textContent = formatEt(yourEt);
  els.userSpeed.textContent = `${Math.round(userSpeed)} mph`;
  els.rivalEt.textContent = formatEt(rivalEt);
  els.rivalSpeed.textContent = `${Math.round(rivalSpeed)} mph`;

  els.reactionMetric.textContent = `${yourReaction.toFixed(3)} sec`;
  els.sixtyMetric.textContent = `${(yourEt * 11.5).toFixed(2)} sec`;
  els.speedMetric.textContent = `${Math.round(userSpeed)} mph`;

  const resultText =
    yourEt < rivalEt
      ? `You won the pass with a ${formatEt(yourEt)} ET and ${Math.round(userSpeed)} mph.`
      : `The rival edged you out with a ${formatEt(rivalEt)} ET. You ran ${formatEt(yourEt)}.`;

  els.resultBadge.textContent = yourEt < rivalEt ? "Win" : "Close loss";
  els.resultBadge.style.color = yourEt < rivalEt ? "#86efac" : "#facc15";

  state.raceLog.push(
    `Run ${state.raceLog.length + 1}: ${car.name} with ${mode}x mode and ${opponents} rival lane(s). ${resultText}`
  );
  renderRaceLog();

  const currentBest = state.bestEt !== null ? formatEt(state.bestEt) : "--";
  els.bestEt.textContent = currentBest;
  els.weatherLabel.textContent = els.weatherSelect.options[els.weatherSelect.selectedIndex].text;
}

function resetRace() {
  state.raceLog = ["Track lights are green. Ready for the next pass."];
  state.bestEt = null;
  els.bestEt.textContent = "--";
  els.userEt.textContent = "--";
  els.userSpeed.textContent = "-- mph";
  els.rivalEt.textContent = "--";
  els.rivalSpeed.textContent = "-- mph";
  els.resultBadge.textContent = "Awaiting launch";
  els.resultBadge.style.color = "#edf3ff";
  els.reactionMetric.textContent = "--";
  els.sixtyMetric.textContent = "--";
  els.speedMetric.textContent = "--";
  renderRaceLog();
}

function bindControls() {
  els.launchControl.addEventListener("input", () => {
    els.launchValue.textContent = `${els.launchControl.value}%`;
    renderDetails();
  });

  els.boostLevel.addEventListener("input", () => {
    els.boostValue.textContent = `${els.boostLevel.value}%`;
    renderDetails();
  });

  els.trackPrep.addEventListener("change", renderDetails);
  els.weatherSelect.addEventListener("change", () => {
    updateTrackMeta();
    renderDetails();
  });
  els.raceMode.addEventListener("change", renderDetails);
  els.opponentPool.addEventListener("change", renderDetails);
  els.runRaceBtn.addEventListener("click", runRace);
  els.resetBtn.addEventListener("click", resetRace);
}

function initialize() {
  renderCarList();
  renderDetails();
  renderLeaderboard();
  renderRaceLog();
  bindControls();
  updateTrackMeta();
}

initialize();
