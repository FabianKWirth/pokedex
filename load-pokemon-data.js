let totalAmountOfPokemons = 0;

let loadedPokemonNames = [];
loadedPokemonNameOffset = 0;

let pokemonData = [];
loadedPokemonDataOffset = 0;

let abilityData = [];
let loadedAbilityNamesById = [];
let abilityIdNameAssignment = [];

let likedPokemons = loadLikedPokemons();

async function getPokemonsOfSearch(searchInput) {
    await loadAllPokemonNames();
    let suitablePokemons = await getSuitablePokemons(searchInput);
    let pokemonDataOfSearch = [];
    for (let index = 0; index < suitablePokemons.length; index++) {
        let thisPokemonData = await getPokemonData(suitablePokemons[index]);
        thisPokemonIndex = thisPokemonData['id'];
        pokemonData[thisPokemonIndex - 1] = thisPokemonData;
        pokemonDataOfSearch.push(thisPokemonData);
    }
    return pokemonDataOfSearch;
}

async function getSuitablePokemons(searchInput) {
    foundPokemons= await searchForPokemons(searchInput);
    
    if (foundPokemons.length > 50) {
        alert("Your search request has " + foundPokemons.length + " fitting results. Please specify your search.");
        return 0;
    }else if (foundPokemons.length == 0) {
        alert(`No pokemons were found for the search input: "${searchInput}"`);
        return 0;
    }  else {
        return foundPokemons;
    }
}

async function searchForPokemons(searchInput){
    foundPokemons=[];
    for (let index = 0; index < pokemonData.length & index < totalAmountOfPokemons; index++) {
        const pokemonName = pokemonData[index]['name'];
        if (pokemonName.includes(searchInput)) {
            foundPokemons.push(pokemonName);
        }
        setLoadingText("Searching...<br>" + foundPokemons.length + " Pokemon found");
    }
    return foundPokemons;
}

async function loadAllPokemonNames() {
    setLoadingText('Loading all pokemon names');
    while (loadedPokemonNameOffset < totalAmountOfPokemons) {
        await fetchNextPokemonNames(limit = 100);
    }
}

async function loadPokemons() {
    startLoadingAnimation();
    await fetchPokemonData();
    endLoadingAnimation();
}

async function fetchNextPokemonNames(limit) {
    let url = await getPokemonListUrl(limit);

    thisPokemonList = await getPokemonList(url);
    totalAmountOfPokemons = thisPokemonList['count'];
    thisPokemonListValues = thisPokemonList['results'];
    await savePokemonNames(thisPokemonListValues);
    return thisPokemonListValues;
}

async function getPokemonListUrl(limit) {
    let url = `https://pokeapi.co/api/v2/pokemon/?offset=${loadedPokemonNameOffset}&limit=${limit}`;
    return url;
}

async function getPokemonDataUrl(pokemonName) {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    return url;

}

async function savePokemonNames(thisPokemonListValues) {
    for (let i = 0; i < thisPokemonListValues.length; i++) {
        pokemonName = { "name": thisPokemonListValues[i]['name'] };
        pokemonData[loadedPokemonNameOffset] = pokemonName;
        loadedPokemonNameOffset++;
    }
}

async function getPokemonList(url) {
    let pokemonList = await fetch(url);
    let thisPokemonList = await pokemonList.json();
    return thisPokemonList;
}

async function getAmountOfUnloadedNamesForNextDataFetch(amountToFetch) {
    let requiredAmount = loadedPokemonNameOffset - loadedPokemonDataOffset;
    if (requiredAmount < amountToFetch) {
        amountToFetch = requiredAmount;
    }
    return 20;
}

async function fetchPokemonData() {
    let amountToFetch = 20;
    amountOfUnloadedNames = await getAmountOfUnloadedNamesForNextDataFetch(amountToFetch);
    if (amountOfUnloadedNames > 1) {
        await fetchNextPokemonNames(amountOfUnloadedNames);
    }

    while (amountToFetch > 0) {
        let currentPokemonName = pokemonData[loadedPokemonDataOffset]['name'];
        await loadPokemonData(currentPokemonName);
        amountToFetch--;
    }
}

async function loadPokemonData(pokemonName) {
    setLoadingText("Loading pokemon: " + pokemonName);
    let pokemonValues = await getPokemonValues(await getPokemonDataUrl(pokemonName));

    /* ensures, that all the abilities are loaded as well and adds an index to the 
    pokemons ability array to directly access the array of the preloaded abilities */
    let adaptedPokemonValues = await loadAbilities(pokemonValues);
    await savePokemonValues(adaptedPokemonValues);
}

async function getPokemonData(pokemonName) {
    setLoadingText("Loading pokemon: " + pokemonName);
    let pokemonValues = await getPokemonValues(await getPokemonDataUrl(pokemonName));
    /* ensures, that all the abilities are loaded as well and adds an index to the 
    pokemons ability array to directly access the array of the preloaded abilities */
    let adaptedPokemonValues = await loadAbilities(pokemonValues);
    return adaptedPokemonValues;
}

async function loadAbilities(pokemonValues) {
    let abilities = pokemonValues['abilities'];
    let adaptedPokemonValues = pokemonValues;

    for (let index = 0; index < abilities.length; index++) {
        let abilityName = abilities[index]['ability']['name'];
        let abilityUrl = abilities[index]['ability']['url']

        abilityId = await loadAbility(abilityName, abilityUrl);

        adaptedPokemonValues = await saveAbilityReferenceInPokemonData(pokemonValues, index, abilityId);
    }
    return adaptedPokemonValues;
}

async function loadAbility(abilityName,abilityUrl,pokemonValues) {
    let abilityId = await getIndexOfAlreadyLoadedAbility(abilityName);
    if (abilityId == false) {
        let abilityData = await getAbility(abilityUrl);
        abilityId= abilityData['id'];
        await saveAbility(abilityId, abilityName, abilityData);
    }
    return abilityId;
}

async function getAbility(url) {
    let response = await fetch(url);
    currentAbility = response.json();
    return currentAbility;
}

async function saveAbilityReferenceInPokemonData(pokemonValues, index, abilityId) {
    pokemonValues['abilities'][index]['ability']['id'] = abilityId;
    return pokemonValues;
}

async function saveAbility(id, name, data) {
    abilityData[id] = data;
    loadedAbilityNamesById[id] = name;
}

function getIndexOfAlreadyLoadedAbility(thisAbilityName) {
    let index = loadedAbilityNamesById.indexOf(thisAbilityName);
    if (index == -1) {
        return false;
    } else {
        return index;
    }
}

async function getPokemonValues(url) {
    let response = await fetch(url);
    let currentPokemonData = await response.json();
    return currentPokemonData;
}

async function savePokemonValues(values) {
    pokemonData[loadedPokemonDataOffset] = values;
    loadedPokemonDataOffset++;
}

function saveLikedPokemons() {
    likedPokemonsText = JSON.stringify(likedPokemons);
    localStorage.setItem("likedPokemons", likedPokemonsText);
}

function loadLikedPokemons() {
    let likedPokemonsString = localStorage.getItem("likedPokemons");
    if (likedPokemonsString) {
        return JSON.parse(likedPokemonsString);
    } else {
        return [];
    }
}


