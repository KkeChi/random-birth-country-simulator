const genders = ["남성", "여성"];
const classes = ["부유층", "중산층", "서민", "하층민"];

let countries = [];
let map;
let marker;

window.addEventListener("DOMContentLoaded", () => {
  // countries.json 파일을 fetch해서 데이터 읽기
  fetch("countries.json")
    .then((response) => {
      if (!response.ok) throw new Error("countries.json을 불러오는데 실패했습니다.");
      return response.json();
    })
    .then((data) => {
      countries = data;
    })
    .catch((error) => {
      alert(error.message);
    });

  // 버튼 이벤트 등록
  document.getElementById("generateBtn").addEventListener("click", () => {
    if (countries.length === 0) {
      alert("국가 데이터가 준비되지 않았습니다.");
      return;
    }

    const country = getRandomCountry();
    if (!country) {
      alert("국가 데이터가 없습니다.");
      return;
    }

    const gender = genders[Math.floor(Math.random() * genders.length)];
    const economicClass = classes[Math.floor(Math.random() * classes.length)];

    document.getElementById("countryName").textContent = country.name;
    document.getElementById("probability").textContent = `출생 확률: ${country.probability.toFixed(2)}%`;
    document.getElementById("gender").textContent = `성별: ${gender}`;
    document.getElementById("econClass").textContent = `경제적 위치: ${economicClass}`;

    document.getElementById("resultPanel").classList.remove("hidden");

    showMap(country.lat, country.lng);
  });

  document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
});

function getRandomCountry() {
  const total = countries.reduce((sum, c) => sum + c.probability, 0);
  if (total === 0) return null;
  let r = Math.random() * total;
  for (let country of countries) {
    r -= country.probability;
    if (r <= 0) return country;
  }
}

function showMap(lat, lng) {
  if (!map) {
    map = L.map('map').setView([lat, lng], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    marker = L.marker([lat, lng]).addTo(map);
  } else {
    map.setView([lat, lng], 4);
    marker.setLatLng([lat, lng]);
  }
}
