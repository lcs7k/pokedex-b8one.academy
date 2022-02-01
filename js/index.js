async function fetchPokemonData(pokemons){

    const allPokemonData = []

    for (const pokemon of pokemons) {

        const pokemonData = await fetchPokemon(pokemon.url)

        allPokemonData.push(pokemonData)

    }

    return allPokemonData

}


async function fetchPokemons(){

    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=26&offset=0");

    const responseJson = await response.json();

    return responseJson.results

}


async function fetchPokemon(url){

    const response = await fetch(url);

    const responseJson = await response.json();

    return responseJson;

}


function insertPokemonHTML(pokemon){

    const hpStat = pokemon.stats.find(item => item.stat.name === "hp")

    const attackStat = pokemon.stats.find(item => item.stat.name === "attack")

    const defenseStat = pokemon.stats.find(item => item.stat.name === "defense")

    const specialAttackStat = pokemon.stats.find(item => item.stat.name === "special-attack")

    const pokemonHtml = `

            <li class="pokemons-item">

            <div class="pokemons-card" data-pokemon-card-type-name="${pokemon.name}">

                <div class="pokemons-card-image-container">

                    <img height= "200" src="${pokemon.sprites.front_default}" alt="" class="pokemons-card-image">

                </div>

                <div class="pokemons-card-info">

                    <h3 class="pokemons-card-name">

                        ${pokemon.name}

                    </h3>

                    <span class="pokemons-card-type">

                    ${pokemon.types[0].type.name}

                    </span>

                </div>

                <ul class="pokemons-card-attributes">

                    <li class="pokemons-card-attributes-item">

                        <span class="pokemons-card-attributes-name">

                            HP

                        </span>

                        <div class="pokemons-card-attributes-progress">

                            <div class="pokemons-card-attributes-progress-bar" style="width: ${hpStat.base_stat}%"></div>

                        </div>

                    </li>

                    <li class="pokemons-card-attributes-item">

                        <span class="pokemons-card-attributes-name">

                            Attack

                        </span>

                        <div class="pokemons-card-attributes-progress">

                            <div class="pokemons-card-attributes-progress-bar" style="width: ${attackStat.base_stat}%"></div>

                        </div>

                    </li>

                    <li class="pokemons-card-attributes-item">

                        <span class="pokemons-card-attributes-name">

                            Defense

                        </span>

                        <div class="pokemons-card-attributes-progress">

                            <div class="pokemons-card-attributes-progress-bar" style="width: ${defenseStat.base_stat}%"></div>

                        </div>

                    </li>

                    <li class="pokemons-card-attributes-item">

                        <span class="pokemons-card-attributes-name">

                            Special Attack

                        </span>

                        <div class="pokemons-card-attributes-progress">

                            <div class="pokemons-card-attributes-progress-bar" style="width: ${specialAttackStat.base_stat}%"></div>

                        </div>

                    </li>

                </ul>

            </div>

        </li>

    `
    const pokemonListUl = document.querySelector(".pokemons-list");
    pokemonListUl.insertAdjacentHTML("beforeend", pokemonHtml)

}

async function populatePokemons(pokemons){

    const allPokemonsData = await fetchPokemonData(pokemons)
    for (const allPokemonData of allPokemonsData) {

        insertPokemonHTML(allPokemonData)

    }

}

function removeAllPokemons(){

    const pokemonListUl = document.querySelector(".pokemons-list")
    pokemonListUl.innerHTML = ""

}

async function handleSearchInput(event, pokemons){

    const value = event.target.value;

    if(!value){

        removeAllPokemons()
        return await populatePokemons(pokemons)

    }

    const currentPokemon = pokemons.find(pokemon => pokemon.name === value.toLowerCase())
    if(currentPokemon){

        const currentPokemonData = await fetchPokemon(currentPokemon.url)
        if(currentPokemonData){

            removeAllPokemons()
            insertPokemonHTML(currentPokemonData)

        }     

    }

}

function initSearchFunction(pokemons){

    const searchInput = document.querySelector(".search-input");
    searchInput.addEventListener("change", async (event) => await handleSearchInput(event, pokemons));

}

async function filterClicked(filter, pokemonsData){

    const pokemonType = filter.dataset.pokemonTypeName
    const pokemonDataFilteredByType = pokemonsData.filter(pokemonData => {

        return pokemonData.types[0].type.name === pokemonType

    })

    if(pokemonType === "all"){

        removeAllPokemons();

        for(const pokemon of pokemonsData){

            insertPokemonHTML(pokemon)

        }

    } else {

        removeAllPokemons();

        for (const pokemon of pokemonDataFilteredByType) {

            insertPokemonHTML(pokemon)

        }

    }

}



function initFiltersFunction(pokemonsData){

    const filters = document.querySelectorAll(".pokemon-filter-button")

    filters.forEach(filter => {

        filter.addEventListener("click", async () => await filterClicked(filter, pokemonsData))

    })

}


async function main(){

    const pokemons = await fetchPokemons();
    const pokemonsData = await fetchPokemonData(pokemons);

    initSearchFunction(pokemons)

    initFiltersFunction(pokemonsData)

    populatePokemons(pokemons)

}



main();