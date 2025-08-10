// countries.json을 fetch로 불러오므로,
// 실제로 서버(로컬서버라도) 환경에서 테스트해야 합니다.

const genders = ["남성", "여성"];
const classes = ["부유층", "중산층", "서민", "하층민"];

let countries = [];
let map;
let marker;

const resultDiv = document.getElementById("result");
const spinBtn = document.getElementById("spinBtn");
const darkModeBtn = document.getElementById("darkModeBtn");
const shareBtn = document.getElementById("shareBtn");

async function loadCountries() {
  try {
    const res = await fetch("countries.json");
    if (!res.ok) throw new Error("국가 데이터 로드 실패");
    countries = await res.json();
  } catch (e) {
    alert("국가 데이터 로드 실패! 페이지를 새로고침 해주세요.");
    console.error(e);
  }
}

function getRandomCountry() {
  const totalProb = countries.reduce((acc, c) => acc + c.probability, 0);
  let r = Math.random() * totalProb;
  for (let c of countries) {
    r -= c.probability;
    if (r <= 0) return c;
  }
  return null;
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

function displayResult(country, gender, econClass) {
  // 국기 URL (https://flagcdn.com/w320/국가코드.png)
  // countries.json에 iso2 코드가 있다고 가정해야 하지만, 없으면 따로 매핑 필요.
  // 여기선 간단히 한글 국가명으로 한글 ISO2 매핑 (필요 시 확장)
  const iso2Map = {
    "대한민국": "kr",
    "미국": "us",
    "중국": "cn",
    "인도": "in",
    "일본": "jp",
    // 필요시 더 추가
  };
  const code = iso2Map[country.name.toLowerCase()] || iso2Map[country.name] || "";
  const flagUrl = code ? `https://flagcdn.com/w320/${code}.png` : "";

  resultDiv.innerHTML = `
    <h2>당신은...</h2>
    <p><strong>국가:</strong> ${country.name}</p>
    <p><strong>출생 확률:</strong> ${country.probability.toFixed(2)}%</p>
    <p><strong>성별:</strong> ${gender}</p>
    <p><strong>경제적 위치:</strong> ${econClass}</p>
    ${flagUrl ? `<img src="${flagUrl}" alt="${country.name} 국기" class="flag">` : ""}
  `;
}

spinBtn.addEventListener("click", () => {
  if (!countries.length) {
    alert("국가 데이터를 불러오는 중입니다. 잠시만 기다려 주세요.");
    return;
  }

  const country = getRandomCountry();
  if (!country) {
    alert("국가 데이터가 없습니다.");
    return;
  }
  const gender = genders[Math.floor(Math.random() * genders.length)];
  const econClass = classes[Math.floor(Math.random() * classes.length)];

  showMap(country.lat, country.lng);
  displayResult(country, gender, econClass);
});

darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

shareBtn.addEventListener("click", () => {
  const shareData = {
    title: "환생 시뮬레이터",
    text: "내가 환생하면 어디서 태어날까? 시뮬레이터에서 확인해보세요!",
    url: window.location.href,
  };

  if (navigator.share) {
    navigator
      .share(shareData)
      .catch((error) => alert("공유에 실패했습니다: " + error));
  } else {
    // fallback: 클립보드 복사
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert("링크가 복사되었습니다. SNS에 붙여넣기 해주세요!");
    });
  }
});

// 초기 실행
loadCountries();
