const countries = [
  // 예시
  { name: "대한민국", probability: 0.7, lat: 36.5, lng: 127.5, iso: "KR" },
  { name: "미국", probability: 4.3, lat: 38.9, lng: -77.0, iso: "US" },
  // ... 실제 195개국 데이터 모두 들어가야 함
];

// 성별, 경제적 위치 랜덤 함수
function getRandomGender() {
  return Math.random() < 0.5 ? "남성" : "여성";
}

function getRandomEconClass() {
  const classes = ["부유층", "중산층", "서민", "하층민"];
  return classes[Math.floor(Math.random() * classes.length)];
}

const map = L.map("map").setView([20, 0], 2);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

const generateBtn = document.getElementById("generateBtn");
const countryNameElem = document.getElementById("countryName");
const probabilityElem = document.getElementById("probability");
const genderElem = document.getElementById("gender");
const econClassElem = document.getElementById("econClass");
const flagImage = document.getElementById("flagImage");

const resultPanel = document.getElementById("resultPanel");

function weightedRandomCountry() {
  const totalProb = countries.reduce((acc, c) => acc + c.probability, 0);
  let r = Math.random() * totalProb;
  for (const country of countries) {
    if (r < country.probability) {
      return country;
    }
    r -= country.probability;
  }
  return countries[countries.length - 1];
}

generateBtn.addEventListener("click", () => {
  const selected = weightedRandomCountry();

  countryNameElem.textContent = selected.name;
  probabilityElem.textContent = selected.probability.toFixed(2) + "%";
  genderElem.textContent = getRandomGender();
  econClassElem.textContent = getRandomEconClass();

  // 국기 이미지 주소 (ISO 코드 소문자 변환)
  const isoLower = selected.iso.toLowerCase();
  flagImage.src = `https://flagcdn.com/w320/${isoLower}.png`;
  flagImage.alt = `${selected.name} 국기`;

  // 지도 이동 및 마커 표시
  map.setView([selected.lat, selected.lng], 4);

  if (window.currentMarker) {
    map.removeLayer(window.currentMarker);
  }
  window.currentMarker = L.marker([selected.lat, selected.lng]).addTo(map);

  resultPanel.classList.remove("hidden");
});
