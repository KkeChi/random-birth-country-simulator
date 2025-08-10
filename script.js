const countries = [
    { name: "대한민국", probability: 0.67, lat: 36.5, lng: 127.5 },
    { name: "미국", probability: 4.25, lat: 37.1, lng: -95.7 },
    { name: "중국", probability: 17.8, lat: 35.8, lng: 104.1 },
    { name: "인도", probability: 17.6, lat: 20.6, lng: 78.9 },
    // ... 나머지 국가들
];

const genders = ["남성", "여성"];
const classes = ["부유층", "중산층", "서민", "하층민"];

let map;
let marker;

document.getElementById("generateBtn").addEventListener("click", () => {
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
    document.getElementById("class").textContent = `경제적 위치: ${economicClass}`;

    document.getElementById("result").classList.remove("hidden");

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
