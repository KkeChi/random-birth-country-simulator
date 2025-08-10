// countries.json 대신 여기서 바로 데이터 넣어도 되지만,
// 나중에 countries.json에서 불러오도록 fetch 방식으로 구현할게

// 기본 변수들
const genders = ["남성", "여성"];
const classes = ["부유층", "중산층", "서민", "하층민"];

let countries = []; // JSON에서 불러올 국가 데이터 저장용
let map;
let marker;

// DOM 요소 캐싱
const generateBtn = document.getElementById("generateBtn");
const countryNameEl = document.getElementById("countryName");
const probabilityEl = document.getElementById("probability");
const genderEl = document.getElementById("gender");
const econClassEl = document.getElementById("econClass");
const resultPanel = document.getElementById("resultPanel");
const flagImg = document.getElementById("flagImg");

const darkModeToggle = document.getElementById("darkModeToggle");

const shareBtn = document.getElementById("shareBtn");
const shareModal = document.getElementById("shareModal");
const copyLinkBtn = document.getElementById("copyLinkBtn");
const fbShareBtn = document.getElementById("fbShareBtn");
const twShareBtn = document.getElementById("twShareBtn");
const kakaoShareBtn = document.getElementById("kakaoShareBtn");
const closeShareModal = document.getElementById("closeShareModal");

// 1. countries.json에서 국가 데이터 불러오기
async function loadCountries() {
  try {
    const response = await fetch("countries.json");
    countries = await response.json();
  } catch (error) {
    alert("국가 데이터 로드 실패! 페이지를 새로고침 해주세요.");
  }
}

// 2. 확률 기반으로 랜덤 국가 선택 함수
function getRandomCountry() {
  const totalProb = countries.reduce((sum, c) => sum + c.probability, 0);
  let r = Math.random() * totalProb;
  for (const country of countries) {
    r -= country.probability;
    if (r <= 0) return country;
  }
  return null; // 혹시 몰라서
}

// 3. 지도에 위치와 마커 표시
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

// 4. 국기 URL 만드는 함수 (country code 기반)
function getFlagUrl(countryName) {
  // ISO 3166-1 alpha-2 country codes (일부만 예시)
  const countryCodeMap = {
    대한민국: "kr",
    미국: "us",
    중국: "cn",
    인도: "in",
    일본: "jp",
    인도네시아: "id",
    파키스탄: "pk",
    나이지리아: "ng",
    브라질: "br",
    방글라데시: "bd",
    러시아: "ru",
    멕시코: "mx",
    // 나머지 국가는 countries.json에 코드 추가하거나 여기에 추가 필요
  };
  const code = countryCodeMap[countryName];
  if (!code) return "";
  return `https://flagcdn.com/w40/${code}.png`; // 40px 너비 국기 이미지
}

// 5. 다크 모드 토글
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// 6. 결과 생성 버튼 클릭 이벤트
generateBtn.addEventListener("click", () => {
  if (countries.length === 0) {
    alert("국가 데이터를 불러오는 중입니다. 잠시만 기다려주세요.");
    return;
  }

  const country = getRandomCountry();
  if (!country) {
    alert("국가 데이터가 없습니다.");
    return;
  }

  const gender = genders[Math.floor(Math.random() * genders.length)];
  const econClass = classes[Math.floor(Math.random() * classes.length)];

  countryNameEl.textContent = country.name;
  probabilityEl.textContent = `출생 확률: ${country.probability.toFixed(2)}%`;
  genderEl.textContent = `성별: ${gender}`;
  econClassEl.textContent = `경제적 위치: ${econClass}`;

  // 국기 표시
  const flagUrl = getFlagUrl(country.name);
  if (flagUrl) {
    flagImg.src = flagUrl;
    flagImg.alt = `${country.name} 국기`;
    flagImg.style.display = "inline-block";
  } else {
    flagImg.style.display = "none";
  }

  resultPanel.classList.remove("hidden");

  showMap(country.lat, country.lng);
});

// 7. 공유 버튼 관련 이벤트들
shareBtn.addEventListener("click", () => {
  shareModal.classList.remove("hidden");
});

closeShareModal.addEventListener("click", () => {
  shareModal.classList.add("hidden");
});

// 링크 복사
copyLinkBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(window.location.href).then(() => {
    alert("링크가 복사되었습니다!");
  });
});

// 페이스북 공유 링크 생성
fbShareBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;

// 트위터 공유 링크 생성
twShareBtn.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=환생 시뮬레이터에서 내 운명을 확인해보세요!`;

// 카카오톡 공유 (SDK 초기화 및 버튼 이벤트)
if (Kakao && !Kakao.isInitialized()) {
  Kakao.init("YOUR_KAKAO_JAVASCRIPT_KEY"); // 카카오 개발자센터에서 발급받은 JavaScript 키로 교체!
}

kakaoShareBtn.addEventListener("click", () => {
  if (!Kakao) {
    alert("카카오톡 공유를 지원하지 않는 환경입니다.");
    return;
  }
  Kakao.Link.sendDefault({
    objectType: "text",
    text: "환생 시뮬레이터에서 내 운명을 확인해보세요!",
    link: {
      mobileWebUrl: window.location.href,
      webUrl: window.location.href,
    },
  });
});

// 8. 초기 실행 시 데이터 로드
loadCountries();
