let selectedPokemon = null;
let selectedBodyType = null;

async function init() {
    await loadPokemons();
    await renderPokemonGrid();
    console.log(abilityIdNameAssignment);
}

async function increasePokemonPool() {
    await loadPokemons();
}


async function selectPokemon(index) {
    selectedPokemon = index;
    await renderSelectedPokemon();
}

function visualizeStats(stats) {
    const ctx = document.getElementById('statGraph');
    const dataSet = getDataSet(stats);
    const config = getRadarChartConfig();
    const radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: stats[0],
            datasets: dataSet,
        },
        options: config,
    });
}

async function getAbilities(pokemonId) {
    let currentPokemonAbilities = pokemonData[pokemonId]['abilities'];
    html = `<div class='abilities'><h3>Abilities</h3>
    <table class='abilities-table'><thead><th>Name</th><th>Description</th></thead>`;
    for (let index = 0; index < currentPokemonAbilities.length; index++) {
        let abilityName = currentPokemonAbilities[index]['ability']['name'];
        let abilityDescription = getAbilityDescription(abilityName);
        html += `<tr><td id='ability'>${abilityName.toUpperCase()}</td><td>${abilityDescription}</td></tr>`;
    }
    html += `</table></div>`;
    return html;
}

async function getStats() {
    let statNames = [];
    let statValues = [];
    let stats = pokemonData[1]['stats'];
    for (let index = 0; index < stats.length; index++) {
        const stat = stats[index];
        statNames[index] = stat['stat']['name'];
        statValues[index] = stat['base_stat'];
    }
    return [statNames, statValues];
}

function getAbilityDescription(abilityName) {
    console.log(abilityName);
    console.log(abilityData);
    //german and englisch texts are mixed up in array indexes
    effectEntries = abilityData[1]['effect_entries'];
        
    let abilityDescription = "";
    //abilityDescription=getEnglishDescription(found,"en");

    return abilityDescription;
}

function getAbilityId(abilityName){
    
}

function getEnglishDescription(abilityData,languageCode){
    for (let index = 0; index < abilityData.length; index++) {
        const effectEntry = abilityData[index];
        if (effectEntry['language']['name'] == languageCode) {
            abilityDescription = effectEntry['effect'];
        }
    }
}

function getDataSet(stats) {
    const dataset = [{
        label: 'Stats anzeigen',
        data: stats[1],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)',
    }];
    return dataset;
}

function getRadarChartConfig() {
    const config = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                min: 0,
                pointLabels: {
                    font: {
                        size: 18
                    }
                }
            },
        },
        plugins: {
            legend: {
                display: false
            }
        },
        layout: {
            autoPadding: true
        }
    };
    return config;
}

function getSelectedPokemonBodyLayout() {
    html = `<div class='pokemon-info-container' id='pokemonInfoContainer'></div>`;
    return html;
}

function getSelectedPokemonHeaderLayout() {
    index = selectedPokemon;
    html = `
    <div class='pokemon-header' id='selectedPokemonHeader'>
        <div class='pokemon-header-menu w-75'>
            <img class='icon' src='./icons/arrow-back.png' onclick="unsetCurrentPokemon()">
            <img class='icon' src='./icons/heart.png'>
        </div>
        <div class='d-flex justify-content-between align-items-baseline w-75'>
        <h2 id='pokemonName${index}'></h2>
        <div id='pokemonId${index}' class='pokemon-id align-bottom'></div>
        </div>
        <div id="pokemonTypes${index}" class="pokemon-types d-flex justify-content-start w-75">
        </div>
        <img id="pokemonImg${index}" class="pokemon-img-200">
    </div>`
    return html;
}

function getPokemonAttributeMenu() {
    return `
    <div class="btn-group pokemon-attribute-menu" role="group">
        <button type="button menu-button" class="btn btn-secondary" onclick='setSelectedBodyType(\"abilities\")'>Abilities</button>
        <button type="button menu-button" class="btn btn-secondary" onclick='setSelectedBodyType(\"stats\")'>Stats</button>
    </div>`;
}
async function setPokemonAllValues() {
    setPokemonHeadValues(selectedPokemon, pokemonData, true);
    await setPokemonBodyValues(pokemonData);
}


function setPokemonHeadValues(index, isSelectedPokemon = false) {
    const currentPokemonData = pokemonData[index];
    if (isSelectedPokemon == true) {
        setImg(index, currentPokemonData["sprites"]["other"]["home"]["front_default"]);
        setBackgroundColor("selectedPokemonHeader", currentPokemonData["types"]);
    } else {
        setImg(index, currentPokemonData["sprites"]["front_default"]);
        setBorderColor("pokemon" + index, currentPokemonData["types"]);
    }
    setName(index, currentPokemonData["name"]);
    setId(index);
    setTypes(index, currentPokemonData["types"]);
}


function setImg(index, source) {
    document.getElementById("pokemonImg" + index).src = source;
}

function setName(index, name) {
    name = name.charAt(0).toUpperCase() + name.slice(1);//Sets first letter to upper-case
    document.getElementById("pokemonName" + index).innerHTML = name;
}

function setId(index) {
    id = index + 1;
    document.getElementById("pokemonId" + index).innerHTML = '#' + id;
}

function setTypes(index, types) {
    let html = "";
    for (let i = 0; i < types.length; i++) {
        html +=
            `<button class='btn d-inline-block ${types[i]['type']['name']}' >
            ${types[i]['type']['name']}
        </button>`;
    }
    document.getElementById("pokemonTypes" + index).innerHTML = html;
}

function setBorderColor(id, types) {
    let element = document.getElementById(id);
    if (element != null) {
        document.getElementById(id).classList.add("border-" + types[0]['type']['name']);
    }
}

function setBackgroundColor(id, types) {
    let element = document.getElementById(id);
    if (element != null) {
        document.getElementById(id).classList.add("card-bg-" + types[0]['type']['name']);
    }
}

async function setPokemonBodyValues() {
    let informationContainer = document.getElementById('pokemonInfoContainer');
    informationContainer.innerHTML = getPokemonAttributeMenu();
    switch (selectedBodyType) {
        case 'abilities':
            informationContainer.innerHTML += await getAbilities(selectedPokemon);
            break;
        case 'stats':
            informationContainer.innerHTML += `<div class="chart-container">
            <canvas id="statGraph" style=></canvas>
            </div>`;
            let stats = await getStats(pokemonData);
            visualizeStats(stats);
            break;
        default:
            informationContainer.innerHTML += await getAbilities(selectedPokemon);
    }
}

async function setSelectedBodyType(typeName) {
    selectedBodyType = typeName;
    setPokemonBodyValues();
}


async function renderPokemonGrid() {
    for (let index = 0; index < pokemonData.length; index++) {
        let currentPokemonData = pokemonData[index];
        await renderPokemonGridItemLayout(index);
        await setPokemonHeadValues(index, currentPokemonData);
    }
    renderLoadMorePokemon();
}

function renderLoadMorePokemon(maxPokemonIdofGrid) {
    document.getElementById('postGrid').innerHTML = "<button class='btn btn-dark btn-lg load-more-btn' onclick='increasePokemonPool()'>Weitere Laden</button>";
    if (maxPokemonIdofGrid > 40) {
        document.getElementById("pokemon" + maxPokemonIdofGrid).scrollIntoView();
    }
}

async function renderSelectedPokemon() {
    emptySelectedPokemon();
    await renderSelectedPokemonLayout();
    await setPokemonAllValues();
}

async function renderNextPokemon() {
    if (selectedPokemon == null) {
        selectedPokemon = 0;
    }
    selectedPokemon++;
    await renderSelectedPokemon();
}

async function renderPreviousPokemon() {
    if (selectedPokemon == null || selectedPokemon == 0) {
        selectedPokemon = 1;
    }
    selectedPokemon--;
    await renderSelectedPokemon();
}

function renderSelectedPokemonLayout() {
    html = `
        <div id='pokemonElements' class='pokemon-elements animate w-100 overflow-y-scroll position-fixed' onclick="unsetCurrentPokemon()">
                <div id='currentSelectedPokemon' class="current-selected-pokemon">`+
                getSelectedPokemonHeaderLayout(selectedPokemon)
                + getSelectedPokemonBodyLayout()
                + `<nav class='change-pokemon-menu'>
                    <img src='./icons/next.png' class='next-icon flip-horizontally' onclick='renderPreviousPokemon()'>
                    <img src='./icons/next.png' class='next-icon' onclick='renderNextPokemon()'>
                    </nav>
                </div>
        </div>
        `;
    document.getElementById("selectedPokemon").innerHTML += html;
    stopEventPropagation("currentSelectedPokemon");
    removeAnimation('pokemonElements');
}

function stopEventPropagation(elementId){
    document.getElementById(elementId).addEventListener("click", stopEvent, false);
}

function stopEvent(event) {
    event.stopPropagation();
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

function renderResetPageButton() {
    document.getElementById("postGrid").innerHTML = "<button class='btn btn-dark btn-lg load-more-btn' onclick='reset()'>Zurück</button>";
}

function reset() {
    selectedPokemon = null;
    selectedBodyType = null;
    removeAllAlerts();
    pokemonData = [];
    init();
}

function emptySelectedPokemon() {
    document.getElementById("selectedPokemon").innerHTML = "";
}

function unsetCurrentPokemon() {
    selectedPokemon = null;
    emptySelectedPokemon();
}

function removeAllAlerts() {
    let elements = document.getElementsByClassName('alert');
    for (let index = 0; index < elements.length; index++) {
        const element = elements[index];
        element.remove();
    }
}

function removeAnimation(pokemonId) {
    setTimeout(function () {
        document.getElementById(pokemonId).classList.remove('animate');
    }, 1000);
}



