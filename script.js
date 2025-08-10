let countries = [];
const genders = ["남성", "여성"];
const classes = ["부유층", "중산층", "서민", "하층민"];
let map;
let marker;

fetch("countries.json")
    .then(res => res.json())
    .then(data => {
        countries = data;
    })
    .catch(err => {
        console.error("국가 데이터를 불러오는 중 오류:", err);
    });

document.getElementById("generateBtn").addEventListener("click", () => {
    if (countries.length === 0) {
        alert("국가 데이터가 로드되지 않았습니다.");
        return;
    }

    const country = getRandomCountry();
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const economicClass = classes[Math.floor(Math.random() * classes.length)];

    document.getElementById("countryName").textContent = country.name;
    document.getElementById("probability").textContent = `출생 확률: ${country.probability.toFixed(3)}%`;
    document.getElementById("gender").textContent = `성별: ${gender}`;
    document.getElementById("econClass").textContent = `경제적 위치: ${economicClass}`;

    // 국기 표시
    document.getElementById("countryFlag").src = `flags/${country.code.toLowerCase()}.png`;

    document.getElementById("resultPanel").classList.remove("hidden");

    showMap(country.lat, country.lng);
});

function getRandomCountry() {
    const total = countries.reduce((sum, c) => sum + c.probability, 0);
    let r = Math.random() * total;
    for (let c of countries) {
        r -= c.probability;
        if (r <= 0) return c;
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
