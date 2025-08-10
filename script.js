let countries = [];
const genders = ["남성", "여성"];
const classes = ["부유층", "중산층", "서민", "하층민"];
let map;
let marker;

async function loadCountries() {
  try {
    const response = await fetch("countries.json");
    countries = await response.json();
  } catch (e) {
    alert("국가 데이터 로드 실패! 페이지를 새로고침 해주세요.");
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

function updateFlag(country) {
  const flagImg = document.getElementById("flagImage");
  if (country && country.code) {
    flagImg.src = `https://flagcdn.com/w320/${country.code.toLowerCase()}.png`;
    flagImg.alt = `${country.name} 국기`;
  } else {
    flagImg.src = "";
    flagImg.alt = "국기 없음";
  }
}

document.getElementById("generateBtn").addEventListener("click", () => {
  if (countries.length === 0) {
    alert("국가 데이터가 아직 로드되지 않았습니다.");
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
  document.getElementById("probability").textContent = country.probability.toFixed(2) + "%";
  document.getElementById("gender").textContent = gender;
  document.getElementById("econClass").textContent = economicClass;

  updateFlag(country);
  showMap(country.lat, country.lng);

  document.getElementById("resultPanel").classList.remove("hidden");
});

document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

document.getElementById("shareBtn").addEventListener("click", () => {
  if (navigator.share) {
    navigator.share({
      title: "환생 국가 시뮬레이터",
      text: "내가 태어날 확률 높은 나라가 어디인지 확인해보세요!",
      url: window.location.href,
    });
  } else {
    // fallback: URL 복사
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert("링크가 복사되었습니다!");
    });
  }
});

// 초기 데이터 로드
loadCountries();
