let beers = [];
let currentBeer = null;

document.addEventListener("DOMContentLoaded", () => {
  fetch("data/beers.json")
    .then(res => res.json())
    .then(data => {
      beers = data;
      renderBeerList();
      renderCharts();
    });
});

function showSection(section) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById(section + "-section").classList.add("active");
}

function renderBeerList() {
  const container = document.getElementById("beer-list");
  container.innerHTML = "";
  beers.forEach((beer, index) => {
    const card = document.createElement("div");
    card.className = "beer-card";
    card.innerHTML = `
      <h3>${beer.name}</h3>
      <p><b>Style:</b> ${beer.style}</p>
      <p><b>ABV:</b> ${beer.abv}%</p>
    `;
    card.onclick = () => showBeerDetail(index);
    container.appendChild(card);
  });
}

function showBeerDetail(index) {
  currentBeer = beers[index];
  const detail = document.getElementById("beer-detail");
  detail.innerHTML = `
    <h2>${currentBeer.name}</h2>
    <p><b>Style:</b> ${currentBeer.style}</p>
    <p><b>ABV:</b> ${currentBeer.abv}%</p>
    <p><b>Release:</b> ${currentBeer.release}</p>
    <h4>説明</h4>
    <p>${currentBeer.description}</p>
    <h4>ストーリー</h4>
    <p>${currentBeer.story}</p>
  `;
  showSection("detail");
}

function renderCharts() {
  // ABVグラフ
  const abvCtx = document.getElementById("abvChart").getContext("2d");
  new Chart(abvCtx, {
    type: "bar",
    data: {
      labels: beers.map(b => b.name),
      datasets: [{
        label: "ABV (%)",
        data: beers.map(b => b.abv),
      }]
    }
  });

  // スタイル分布
  const styleCount = {};
  beers.forEach(b => styleCount[b.style] = (styleCount[b.style] || 0) + 1);

  const styleCtx = document.getElementById("styleChart").getContext("2d");
  new Chart(styleCtx, {
    type: "pie",
    data: {
      labels: Object.keys(styleCount),
      datasets: [{
        data: Object.values(styleCount),
      }]
    }
  });
}
