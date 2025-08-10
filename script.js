const genders = ["남성", "여성"];
const classes = ["부유층", "중산층", "서민", "하층민"];

let countries = [];
let map;
let marker;

// JSON 파일에서 국가 데이터 비동기 로드
fetch('countries.json')
  .then(response => response.json())
  .then(data => {
    countries = data;
  })
  .catch(err => {
    alert("국가 데이터를 불러오는 데 실패했습니다.");
    console.error(err);
  });

// 버튼 클릭 이벤트 등록
document.getElementById("generateBtn").addEventListener("click", () => {
  if (countries.length === 0) {
    alert("국가 데이터가 아직 준비되지 않았습니다. 잠시 후 다시 시도하세요.");
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

document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
