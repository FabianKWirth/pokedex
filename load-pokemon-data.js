let pokemonAmount = null;
let pokemonData = [];
let abilityData = [];
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
        let response = await fetch(pokemonSetUrl);
        let thisPokemonData = await response.json();
        pokemonSetUrl = thisPokemonData['next'];
        await savePokemonDataToGlobalArray(thisPokemonData['results']);
    } catch (e) {
        console.log(e);
    }
}

async function savePokemonDataToGlobalArray(pokemonDataResults) {
    for (let index = 0; index < pokemonDataResults.length; index++) {
        const element = pokemonDataResults[index];
        let pokemonValues = await getPokemonValues(element['url']);
        await savePokemonValues(index, pokemonValues);

        await loadAbilities(pokemonValues);


    }
}

async function loadAbilities(pokemonValues) {
    let unloadedAbilities = await getUnloadedAbilities(pokemonValues);
    for (let index = 0; index < unloadedAbilities.length; index++) {
        let name = unloadedAbilities[index]['name'];
        let abilityData = await getAbility(unloadedAbilities[index]['url']);
        await saveAbility(name, abilityData);
    }
}

async function getAbility(url) {
    let response = await fetch(url);
    currentAbility = response.json();
    return currentAbility;
}

async function saveAbility(name, data) {
    var newJsonObject = { "name": name, "data": data };
    await abilityData.push(newJsonObject);
}

async function getUnloadedAbilities(pokemonValues) {
    let pokemonAbilities = pokemonValues['abilities'];
    i = 0;
    unloadedAbilities = [];
    for (let index = 0; index < pokemonAbilities.length; index++) {
        const thisAbility = pokemonAbilities[index];
        if (await abilityIsLoaded(thisAbility['ability']['name']) == false) {
            abilityValues = { name: thisAbility['ability']['name'], url: thisAbility['ability']['url'] }
            unloadedAbilities.push(abilityValues);
            i++;
        }
    }
    return unloadedAbilities;
}

function abilityIsLoaded(thisAbilityName) {
    var hasMatch = false;

    for (var index = 0; index < abilityData.length; index++) {

        var ability = abilityData[index];

        if (ability.name == thisAbilityName) {
            hasMatch = true;
            break;
        }
    }
    return hasMatch;
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