const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const suggestions = document.getElementById('suggestions');
const loadingIndicator = document.getElementById('loading');
const pokemonInfo = document.getElementById('pokemon-info');

searchButton.addEventListener('click', () => searchPokemon(searchInput.value.trim().toLowerCase()));
searchInput.addEventListener('input', () => showSuggestions(searchInput.value.trim().toLowerCase()));

async function searchPokemon(query) {
  if (!query) return alert("Please enter a Pokémon name or ID.");
  
  resetFields();
  loadingIndicator.classList.remove('hidden');
  pokemonInfo.classList.add('hidden');

  try {
    const pokemon = await fetchData(`https://pokeapi.co/api/v2/pokemon/${query}`);
    displayPokemonData(pokemon);
    pokemonInfo.classList.remove('hidden');
  } catch (error) {
    alert(error.message);
  } finally {
    loadingIndicator.classList.add('hidden');
  }
}

async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Pokémon not found');
  return response.json();
}

function displayPokemonData(pokemon) {
  const { name, id, weight, height, types, stats, sprites } = pokemon;
  document.getElementById('pokemon-namefrist').textContent = name.toUpperCase();
  document.getElementById('pokemon-name').textContent = name.toUpperCase();
  document.getElementById('pokemon-id').textContent = `#${id}`;
  document.getElementById('weight').textContent = `${weight}`;
  document.getElementById('height').textContent = `${height}`;

  displayTypes(types);
  displayStats(stats);
  displaySprite(sprites.front_default);
}

function displayTypes(types) {
  const typesContainer = document.getElementById('types');
  typesContainer.innerHTML = types.map(type => `<span class="type-badge ${type.type.name}">${type.type.name.toUpperCase()}</span>`).join('');
}

function displayStats(stats) {
  const statNames = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
  statNames.forEach((statName, index) => {
    document.getElementById(statName).textContent = stats[index].base_stat;
  });
}

function displaySprite(spriteUrl) {
  const spriteContainer = document.getElementById('sprite-container');
  spriteContainer.innerHTML = `<img id="sprite" src="${spriteUrl}" alt="Pokémon sprite">`;
}

function resetFields() {
  document.getElementById('sprite-container').innerHTML = '';
  document.getElementById('pokemon-namefrist').textContent = '';
  document.getElementById('pokemon-name').textContent = '';
  document.getElementById('pokemon-id').textContent = '';
  document.getElementById('weight').textContent = '';
  document.getElementById('height').textContent = '';
  document.getElementById('types').innerHTML = '';
  document.getElementById('hp').textContent = '';
  document.getElementById('attack').textContent = '';
  document.getElementById('defense').textContent = '';
  document.getElementById('special-attack').textContent = '';
  document.getElementById('special-defense').textContent = '';
  document.getElementById('speed').textContent = '';
  suggestions.innerHTML = '';
}

async function showSuggestions(query) {
  if (query.length < 2) return suggestions.innerHTML = ''; 

  try {
    const data = await fetchData(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
    const filteredPokemon = data.results.filter(pokemon => pokemon.name.startsWith(query));
    renderSuggestions(filteredPokemon);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
  }
}

function renderSuggestions(filteredPokemon) {
  suggestions.innerHTML = filteredPokemon.map(pokemon => 
    `<li class="suggestion-item">${pokemon.name}</li>`
  ).join('');
}

suggestions.addEventListener('click', (event) => {
  if (event.target && event.target.matches('.suggestion-item')) {
    searchInput.value = event.target.textContent;
    suggestions.innerHTML = '';
    searchPokemon(event.target.textContent);
  }
});