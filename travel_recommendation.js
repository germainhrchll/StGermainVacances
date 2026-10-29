// ===== 1. Attraper les éléments de la page =====
const searchInput = document.getElementById('searchInput');
const btnSearch = document.getElementById('btnSearch');
const btnClear = document.getElementById('btnClear');
const resultsDiv = document.getElementById('results');
const heroContent = document.querySelector('.hero-content');

// ===== 2. Charger les données une seule fois, au démarrage =====
let travelData = null;

fetch('travel_recommendation_api.json')
  .then(response => response.json())
  .then(data => {
    travelData = data;
    console.log('Données chargées :', travelData);
  })
  .catch(error => {
    console.error('Error:', error);
  });

// ===== 3. Trouver les recommandations selon le mot-clé =====
function getRecommendations(keyword) {
  if (keyword.includes('beach')) {
    return travelData.beaches;
  }

  if (keyword.includes('temple')) {
    return travelData.temples;
  }

  if (keyword.includes('countr')) {
    const cities = [];
    travelData.countries.forEach(country => {
      country.cities.forEach(city => {
        cities.push(city);
      });
    });
    return cities;
  }

  return [];
}

// ===== 4. Obtenir l'heure locale d'un fuseau horaire (tâche optionnelle) =====
function getLocalTime(timeZone) {
  const options = { timeZone: timeZone, hour12: true, hour: 'numeric', minute: 'numeric' };
  return new Date().toLocaleTimeString('en-US', options);
}

// ===== 5. Afficher les résultats sous forme de cartes =====
function displayResults(results) {
  heroContent.style.display = 'none';

  if (results.length === 0) {
    resultsDiv.innerHTML = `
      <h2 class="results-title">No results</h2>
      <p class="no-results">Sorry, no recommendations found. Try "beach", "temple" or "country".</p>
    `;
    return;
  }

  const cardsHTML = results.map(place => `
    <div class="result-card">
      <img src="${place.imageUrl}" alt="${place.name}">
      <h3>${place.name}</h3>
      <p>${place.description}</p>
      ${place.timeZone ? `<p class="local-time"><i class="fa-regular fa-clock"></i> Local time: ${getLocalTime(place.timeZone)}</p>` : ''}
    </div>
  `).join('');

  resultsDiv.innerHTML = `
    <h2 class="results-title">Search Results</h2>
    <div class="results-grid">${cardsHTML}</div>
  `;
}

// ===== 6. La recherche, déclenchée par le bouton Search =====
function searchRecommendations() {
  const keyword = searchInput.value.trim().toLowerCase();

  if (keyword === '') {
    return;
  }

  if (travelData === null) {
    console.log('Les données ne sont pas encore chargées.');
    return;
  }

  const results = getRecommendations(keyword);
  displayResults(results);
}

// ===== 7. Effacer les résultats, déclenché par le bouton Clear =====
function clearResults() {
  resultsDiv.innerHTML = '';
  heroContent.style.display = '';
  searchInput.value = '';
}

// ===== 8. Brancher les boutons =====
btnSearch.addEventListener('click', searchRecommendations);
btnClear.addEventListener('click', clearResults);