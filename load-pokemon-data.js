let pokemonAmount = null;
let pokemonData = [];
let abilityData = [];
let loadedAbilityNamesById = [];
let abilityIdNameAssignment = [];
let pokemonSetUrl = "https://pokeapi.co/api/v2/pokemon/";



async function loadPokemons() {
    startLoadingAnimation();
    await fetchPokemonData();
    endLoadingAnimation();
}

function startLoadingAnimation() {
    document.getElementById("loadingScreen").classList.remove('hide');
}

function endLoadingAnimation() {
    document.getElementById("loadingScreen").classList.add('hide');
}

async function fetchPokemonData() {
    try {
        let response = await fetch (pokemonSetUrl);
        let thisPokemonData = await response.json();
        pokemonSetUrl = thisPokemonData['next'];
        await savePokemonDataToGlobalArray(thisPokemonData['results']);
    } catch (e) {
        console.log(e);
    }
}

async function savePokemonDataToGlobalArray(pokemonDataResults) {
    for (let pokemonIndex = 0; pokemonIndex < pokemonDataResults.length; pokemonIndex++) {
        const pokemonData = pokemonDataResults[pokemonIndex];
        let pokemonValues = await getPokemonValues(pokemonData['url']);

        /*
        ensures, that all the abilities are loaded as well and adds an index to the 
        pokemons ability array to directly access the array of the preloaded abilities
        */
        let adaptedPokemonValues = await loadAbilities(pokemonValues);

        await savePokemonValues(pokemonIndex, adaptedPokemonValues);
    }
}

async function loadAbilities(pokemonValues) {
    let abilities = pokemonValues['abilities'];
    let adaptedPokemonValues=pokemonValues;

    for (let index = 0; index < abilities.length; index++) {
        let abilityName = abilities[index]['ability']['name'];
        let abilityId = await getIndexOfAlreadyLoadedAbility(abilityName);
        if (abilityId == false) {
            let abilityData = await getAbility(abilities[index]['ability']['url']);
            abilityId = abilityData['id'];
            await saveAbility(abilityId,abilityName, abilityData);
        }

        adaptedPokemonValues = await saveAbilityReferenceInPokemonData(pokemonValues, index, abilityId);
    }
    return adaptedPokemonValues;
}



async function getAbility(url) {
    let response = await fetch(url);
    currentAbility = response.json();
    return currentAbility;
}

async function saveAbilityReferenceInPokemonData(pokemonValues, index, abilityId) {
    pokemonValues['abilities'][index]['ability']['id']=abilityId;
    return pokemonValues;
}

async function saveAbility(id,name, data) {
    abilityData[id] = data;
    loadedAbilityNamesById[id]=name;
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

async function savePokemonValues(index, values) {
    pokemonData[index] = values;
}

function loadAbility(abilityName) {
    if (abilities[abilityName]) {
        return abilities[abilityName];
    } else {
        let abilityData = fetchAbilityData(abilities[abilityName]);
        if (abilityData[0] == 'true') {
            return abilityData[1];
        }
    }
}

async function fetchAbilityData(abilityName) {
    try {
        let urlAbility = `https://pokeapi.co/api/v2/ability/${abilityName}`;
        let response = await fetch(urlAbility);
        let abilityData = await response.json();
        return [true, abilityData];
    } catch (e) {
        return [false, e];
    }

}