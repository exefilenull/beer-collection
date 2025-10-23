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
  // 改行コードをHTML改行に変換
  const description = currentBeer.description.replace(/\n/g, "<br>");
  const detail = currentBeer.detail.replace(/\n/g, "<br>");

  const detail = document.getElementById("beer-detail");

  // 画像の相対パス（例: data/01_PERMIT.png）
  const imagePath = `data/${currentBeer.image}`;
  detail.innerHTML = `
    <img src="${imagePath}" alt="${currentBeer.name}" class="beer-image">
    <h2>${currentBeer.name}</h2>
    <p><b>Style:</b> ${currentBeer.style}</p>
    <p><b>ABV:</b> ${currentBeer.abv}%</p>
    <p><b>リリース日:</b> ${currentBeer.release}</p>
    <h4>説明</h4>
    <p>${currentBeer.description}</p>
    <h4>詳細</h4>
    <p>${currentBeer.detail}</p>
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
