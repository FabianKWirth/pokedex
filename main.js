let selectedPokemon = null;
let pokemonAmount = 20;
let selectedBodyType = null;


async function init() {
    await renderPokemonGrid();
    if (selectedPokemon != null) {
        await renderSelectedPokemon();
    }
}

async function renderPokemonGrid() {
    emptyGrid();
    for (let index = 0; index < pokemonAmount; index++) {
        let pokemonData = await getPokemonData(index);
        await renderPokemonGridItemLayout(index);
        await loadPokemonHeadValues(index, pokemonData);
    }
}

async function renderSelectedPokemon() {
    emptySelectedPokemon();
    await renderSelectedPokemonLayout();
    await loadPokemonAllValues();
}

async function loadPokemonAllValues() {
    let pokemonData = await getPokemonData(selectedPokemon);
    await loadPokemonHeadValues(selectedPokemon, pokemonData);
    await loadPokemonBodyValues(pokemonData);
}

function renderSelectedPokemonLayout() {
    html = `
        <div id='currentSelectedPokemon' class="current-selected-pokemon">`+
        getSelectedPokemonHeaderLayout(selectedPokemon)
        + getSelectedPokemonBodyLayout(selectedPokemon)
        + `</div>`;
    document.getElementById("selectedPokemon").innerHTML += html;
}

function renderPokemonGridItemLayout(index) {
    html = `
    <div id="pokemon${index}" class='pokemon-grid-item-container' onclick="selectPokemon(${index});">
        <div class="d-flex justify-content-between align-items-baseline w-75">
            <h2 id='pokemonName${index}' ></h2>
            <div id='pokemonId${index}' class='align-bottom'></div>
        </div>
        <div id='pokemonContent${index}' class='d-flex justify-content-between w-75' o>
            <div class='btn-group-vertical' id='pokemonTypes${index}' ></div>
            <img id='pokemonImg${index}' class='pokemon-img' >
        </div>
     </div>`;
    document.getElementById("pokedexGrid").innerHTML += html;
}

function selectPokemon(index) {
    selectedPokemon = index;
    renderSelectedPokemon();
}

async function loadPokemonHeadValues(index, pokemonData) {
    if (pokemonData[0]) {
        const currentPokemonData = pokemonData[1];

        let defaultImg = currentPokemonData["sprites"]["front_default"];
        document.getElementById("pokemonImg" + index).src = defaultImg;

        let name = currentPokemonData["name"];
        document.getElementById("pokemonName" + index).innerHTML = name;

        let id = index + 1;
        document.getElementById("pokemonId" + index).innerHTML = '#' + id;

        let types = currentPokemonData["types"];
        document.getElementById("pokemonTypes" + index).innerHTML = "";

        setBorderColor("pokemon" + index, types);


        for (let i = 0; i < types.length; i++) {
            document.getElementById("pokemonTypes" + index).innerHTML +=
                `<button class='btn d-inline-block ${types[i]['type']['name']}' >${types[i]['type']['name']}</button>`;
        }
    }
}

function setBorderColor(id, types) {
    document.getElementById(id).classList.add("border-" + types[0]['type']['name']);
}

async function loadPokemonBodyValues(pokemonData) {
    let informationContainer = document.getElementById('pokemonInfoContainer');
    informationContainer.innerHTML = "";
    informationContainer.innerHTML += getPokemonAttributeMenu();

    switch (selectedBodyType) {
        case 'abilities':
            informationContainer.innerHTML += await getAbilities(pokemonData);
            break;
        case 'forms':

            break;
        case 'stats':
            informationContainer.innerHTML += `<div><canvas id='statGraph'></canvas></div>`;
            let stats= await getStats(pokemonData);
            console.log(stats);
            visualizeStats(stats);
            break;
        default:
            informationContainer.innerHTML += await getAbilities(pokemonData);
    }
}

function getPokemonAttributeMenu() {
    return `<div class="btn-group pokemon-attribute-menu" role="group">
        <button type="button menu-button" class="btn btn-secondary" onclick='setSelectedBodyType(\"abilities\")'>Abilities</button>
        <button type="button menu-button" class="btn btn-secondary" onclick='setSelectedBodyType(\"stats\")'>Stats</button>
        <button type="button menu-button" class="btn btn-secondary" onclick='setSelectedBodyType(\"right\")'>Right</button>
    </div>`;
}

function setSelectedBodyType(typeName) {
    selectedBodyType = typeName;
    renderSelectedPokemon();
}

async function getAbilities(pokemonData) {
    let abilities = pokemonData[1]['abilities'];

    html = `<div class='abilities'><h3>Abilities</h3>
    <table class='abilities-table'><thead><th>Name</th><th>Description</th></thead>`;
    for (let index = 0; index < abilities.length; index++) {
        const ability = abilities[index]['ability'];
        let abilityData = await getAbilityData(ability['url']);

        let abilityDescription = getAbilityDescription(abilityData);

        html += `<tr><td id='ability'>${ability['name']}</td><td>${abilityDescription}</td></tr>`;

    }
    html += `</table></div>`;
    return html;
}

async function getStats(pokemonData) {
    let statNames=[];
    let statValues=[];
    let stats = pokemonData[1]['stats'];
    console.log(stats);
    for (let index = 0; index < stats.length; index++) {
        const stat = stats[index];
        statNames[index] = stat['stat']['name'];
        statValues[index] = stat['base_stat'];
    }
    return [statNames,statValues];
}

function getAbilityDescription(abilityData) {
    let abilityDescription = "";
    //german and englisch texts are mixed up in array indexes
    effectEntries = abilityData[1]['effect_entries'];
    for (let index = 0; index < effectEntries.length; index++) {
        const effectEntry = effectEntries[index];
        if (effectEntry['language']['name'] == "en") {
            abilityDescription = effectEntry['effect'];
        }
    }
    return abilityDescription;
}

function visualizeStats(stats) {
    const ctx = document.getElementById('statGraph');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: stats[0],
            datasets: [{
                label: '',
                data: stats[1],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

async function getPokemonData(index) {
    pokemonId = index + 1;//pokemonId startet bei 1; index bei 0; 
    try {
        let url = "https://pokeapi.co/api/v2/pokemon/" + pokemonId;
        let response = await fetch(url);
        let pokemonData = await response.json();
        return ['true', pokemonData];
    } catch (e) {
        return ['false', e];
    }
}

async function getAbilityData(url) {
    try {
        let response = await fetch(url);
        let abilityData = await response.json();
        return ['true', abilityData];
    } catch (e) {
        return ['false', e];
    }

}

function emptyGrid() {
    document.getElementById("pokedexGrid").innerHTML = "";
}

function emptySelectedPokemon() {
    document.getElementById("selectedPokemon").innerHTML = "";
}

function unsetCurrentPokemon() {
    selectedPokemon = null;
    emptySelectedPokemon();
    renderPokemonGrid();
}


function getSelectedPokemonBodyLayout(index) {
    html = `<div class='pokemon-info-container' id='pokemonInfoContainer'></div>`;
    return html;
}

function getSelectedPokemonHeaderLayout() {
    index = selectedPokemon;
    html = `
    <div class='pokemon-header' id='selectedPokemonHeader'>
        <div class='pokemon-header-menu w-75'>
            <img class='icon invert' src='./icons/arrow-back.png' onclick="unsetCurrentPokemon();">
            <img class='icon invert' src='./icons/heart.png' onclick="">
        </div>
        <div class='d-flex justify-content-around align-items-baseline w-75'>
        <h1 id='pokemonName${index}'></h1>
        <div id='pokemonId${index}' class='pokemon-id align-bottom'></div>
        </div>
        <div id="pokemonTypes${index}" class="pokemon-types">
        </div>
        <img id="pokemonImg${index}" class="pokemon-img-200">
    </div>`
    return html;
}

