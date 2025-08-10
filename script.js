const genders = ["남성", "여성"];
const classes = ["부유층", "중산층", "서민", "하층민"];

document.getElementById("generateBtn").addEventListener("click", () => {
    const country = getRandomCountry();
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const economicClass = classes[Math.floor(Math.random() * classes.length)];

    document.getElementById("countryName").textContent = country.name;
    document.getElementById("probability").textContent = `출생 확률: ${formatProbability(country.probability)}`;
    document.getElementById("gender").textContent = `성별: ${gender}`;
    document.getElementById("class").textContent = `경제적 위치: ${economicClass}`;
    
    document.getElementById("result").classList.remove("hidden");
    showMap(country.lat, country.lng);
});

function getRandomCountry() {
    const total = countries.reduce((sum, c) => sum + c.probability, 0);
    let r = Math.random() * total;
    for (let country of countries) {
        r -= country.probability;
        if (r <= 0) return country;
    }
}

function showMap(lat, lng) {
    const map = L.map('map').setView([lat, lng], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    L.marker([lat, lng]).addTo(map);
}

function formatProbability(prob) {
    if (prob >= 1) return `${prob.toFixed(2)}%`;
    if (prob >= 0.1) return `${prob.toFixed(3)}%`;
    return `${prob.toFixed(4)}%`;
}

document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
