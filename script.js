const genders = ["남성", "여성"];
const classes = ["부유층", "중산층", "서민", "하층민"];

let map;
let marker;
let countries = [];

async function loadCountries() {
  try {
    const response = await fetch("countries.json");
    if (!response.ok) throw new Error("국가 데이터 로드 실패");
    countries = await response.json();
  } catch (error) {
    alert("국가 데이터 로드 실패! 페이지를 새로고침 해주세요.");
    console.error(error);
  }
}

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
    map = L.map("map").setView([lat, lng], 4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);
    marker = L.marker([lat, lng]).addTo(map);
  } else {
    map.setView([lat, lng], 4);
    marker.setLatLng([lat, lng]);
  }
}

function updateResult(country) {
  document.getElementById("countryName").textContent = country.name;
  document.getElementById("probability").textContent = `${country.probability.toFixed(2)}%`;
  const gender = genders[Math.floor(Math.random() * genders.length)];
  document.getElementById("gender").textContent = gender;
  const econClass = classes[Math.floor(Math.random() * classes.length)];
  document.getElementById("econClass").textContent = econClass;

  // 국기 이미지 (using country code in lowercase if available)
  const flagImg = document.getElementById("flagImg");
  // countries.json에 "code": "KR" 등 ISO 3166-1 alpha-2 코드가 있어야 합니다.
  if (country.code) {
    flagImg.src = `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`;
    flagImg.alt = `${country.name} 국기`;
  } else {
    flagImg.src = "";
    flagImg.alt = "";
  }

  document.getElementById("resultPanel").classList.remove("hidden");
}

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
  updateResult(country);
  showMap(country.lat, country.lng);
});

// 다크모드 토글
document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// 공유 버튼 기능 (클립보드 복사 및 SNS)
document.getElementById("shareBtn").addEventListener("click", () => {
  const url = window.location.href;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      alert("현재 페이지 URL이 클립보드에 복사되었습니다!");
    });
  } else {
    alert("클립보드 복사 기능을 지원하지 않는 브라우저입니다.");
  }
});

window.onload = loadCountries;
