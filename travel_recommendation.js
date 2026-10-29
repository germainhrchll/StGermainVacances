// ===== 1. Attraper les éléments de la page =====
const searchInput = document.getElementById('searchInput');
const btnSearch = document.getElementById('btnSearch');
const btnClear = document.getElementById('btnClear');

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

// ===== 4. La recherche, déclenchée par le bouton Search =====
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
  console.log(`Résultats pour "${keyword}" :`, results);
}

btnSearch.addEventListener('click', searchRecommendations);