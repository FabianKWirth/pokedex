let totalAmountOfPokemons = 0;

let loadedPokemonNames = [];
loadedPokemonNameOffset = 0;

let pokemonData = [];
loadedPokemonDataOffset = 0;

let abilityData = [];
let loadedAbilityNamesById = [];
let abilityIdNameAssignment = [];

let preferedPokemons = [];

async function getSearchResult(searchInput) {
    startLoadingAnimation();
    let names = await loadAllPokemonNames();
    let suitablePokemons = await getSuitablePokemons(searchInput, names);

    for (let index = 0; index < suitablePokemons.length; index++) {
        const suitablePokemon = suitablePokemons[index];
    }
    /*
    let pokemonValues = await getPokemonValues(currentPokemonData['url']);
    let adaptedPokemonValues = await loadAbilities(pokemonValues);
    await savePokemonValues(pokemonIndex, adaptedPokemonValues);
    */
    endLoadingAnimation();
}

async function loadAllPokemonNames() {
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
    //required onload to implement the search function
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
        loadedPokemonNames[loadedPokemonNameOffset]=thisPokemonListValues[i]['name'];
        loadedPokemonNameOffset++;

    }
}

async function getPokemonList(url) {
    let pokemonList = await fetch(url);
    let thisPokemonList = await pokemonList.json();
    return thisPokemonList;
}



async function getAmountOfUnloadedNamesForNextDataFetch(amountToFetch) {
    let requiredAmount=loadedPokemonNameOffset-loadedPokemonDataOffset;
    if(requiredAmount<amountToFetch){
        amountToFetch=requiredAmount;
    }

    console.log(amountToFetch);

    return 20;
}

async function fetchPokemonData() {
    let amountToFetch = 20;
    amountOfUnloadedNames = await getAmountOfUnloadedNamesForNextDataFetch(amountToFetch);
    console.log(amountOfUnloadedNames);
    if (amountOfUnloadedNames > 1) {
        await fetchNextPokemonNames(amountOfUnloadedNames);
    }

    while (amountToFetch > 1) {
        let currentPokemonName = loadedPokemonNames[loadedPokemonDataOffset+1];
        await loadPokemonData(currentPokemonName);
        amountToFetch--;
    }
}

async function loadPokemonData(pokemonName) {
    let pokemonValues = await getPokemonValues(await getPokemonDataUrl(pokemonName));


    /* ensures, that all the abilities are loaded as well and adds an index to the 
    pokemons ability array to directly access the array of the preloaded abilities */
    let adaptedPokemonValues = await loadAbilities(pokemonValues);

    await savePokemonValues(adaptedPokemonValues);
}

async function loadAbilities(pokemonValues) {
    let abilities = pokemonValues['abilities'];
    let adaptedPokemonValues = pokemonValues;

    for (let index = 0; index < abilities.length; index++) {
        let abilityName = abilities[index]['ability']['name'];
        let abilityId = await getIndexOfAlreadyLoadedAbility(abilityName);
        if (abilityId == false) {
            let abilityData = await getAbility(abilities[index]['ability']['url']);
            abilityId = abilityData['id'];
            await saveAbility(abilityId, abilityName, abilityData);
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
    console.log(url);
    let response = await fetch(url);
    let currentPokemonData = await response.json();
    return currentPokemonData;
}

async function savePokemonValues(values) {
    pokemonData[loadedPokemonDataOffset] = values;
    loadedPokemonDataOffset++;

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



function savePreferedPokemons(pokemonId) {


    localStorage.setItem("myCat", "Tom");
}

function loadPreferedPokemons() {

}


function startLoadingAnimation() {
    document.getElementById("loadingContainer").classList.remove('hide');
}

function endLoadingAnimation() {
    document.getElementById("loadingContainer").classList.add('hide');
}