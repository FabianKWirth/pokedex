let selectedPokemon = null;
let pokemonAmount = 40;
let maxPokemonIdofGrid = 0;
let selectedBodyType = null;

async function init() {
    await renderPokemonGrid();
    if (selectedPokemon != null) {
        await renderSelectedPokemon();
    }
}

async function loadSearchResults() {
    let index = 0;
    let searchInput = document.getElementById("searchInput").value.toLowerCase();
    let pokemonData = await getPokemonData(index, searchInput);
    if (searchInput != null && searchInput != "") {
        if (pokemonData[0] == 'true') {
            maxPokemonIdofGrid = pokemonData[1].length;
            let index=pokemonData[1]['id']-1;
            if(index!=selectedPokemon){
                emptyGrid();
                await renderPokemonGridItemLayout(index);
                await loadPokemonHeadValues(index, pokemonData);
            }
        } else {
            renderNothingFoundMessage(searchInput);
        }
    } else {
        renderNothingFoundMessage(searchInput);
    }

    document.getElementById("postGrid").innerHTML = "<button class='btn btn-dark btn-lg load-more-btn' onclick='reset()'>Zurück</button>";
}

function reset() {
    selectedPokemon = null;
    pokemonAmount = 40;
    maxPokemonIdofGrid = 0;
    selectedBodyType = null;
    removeAllAlerts();
    pokemonData=[];
    emptyGrid();
    init();
}

function removeAllAlerts() {
    let elements = document.getElementsByClassName('alert');
    for (let index = 0; index < elements.length; index++) {
        const element = elements[index];
        element.remove();
    }
}

function renderNothingFoundMessage(searchInput) {
    emptyGrid();
    let outputField = document.getElementById("pokedexGrid");
    if (searchInput == null || searchInput == "") {
        outputField.innerHTML = `<div class='alert alert-warning'>Fehler: Es wurde ein kein Begriff als Suchbegriff übergeben</div>`;
    } else {
        outputField.innerHTML = `<div class='alert alert-warning'>Sorry, wir konnten kein Pokemon Namens "${searchInput}" finden</div>`;
    }

}

async function renderPokemonGrid() {
    for (let index = maxPokemonIdofGrid; index < pokemonAmount; index++) {
        let pokemonData = await getPokemonData(index);
        await renderPokemonGridItemLayout(index);
        await loadPokemonHeadValues(index, pokemonData);
    }
    renderLoadMorePokemon(maxPokemonIdofGrid);
    maxPokemonIdofGrid = pokemonAmount;
}

function renderLoadMorePokemon(maxPokemonIdofGrid) {
    document.getElementById('postGrid').innerHTML = "<button class='btn btn-dark btn-lg load-more-btn' onclick='increasePokemonPool()'>Weitere Laden</button>";
    document.getElementById("pokemon" + maxPokemonIdofGrid).scrollIntoView();
}

async function renderSelectedPokemon() {
    emptySelectedPokemon();
    await renderSelectedPokemonLayout();
    await loadPokemonAllValues();
}

async function loadPokemonAllValues() {
    let pokemonData = await getPokemonData(selectedPokemon);
    await loadPokemonHeadValues(selectedPokemon, pokemonData, true);
    await loadPokemonBodyValues(pokemonData);
}

async function increasePokemonPool() {
    pokemonAmount = pokemonAmount + 40;
    await renderPokemonGrid();
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
        <div class='pokemon-elements animate w-100'>
            <div id='currentSelectedPokemon' class="current-selected-pokemon">`+
            getSelectedPokemonHeaderLayout(selectedPokemon)
            + getSelectedPokemonBodyLayout()
            + `
            <nav class='change-pokemon-menu'><img src='./icons/next.png' class='next-icon flip-horizontally' onclick='renderPreviousPokemon()'>
            <img src='./icons/next.png' class='next-icon' onclick='renderNextPokemon()'></nav>
            </div>
        </div>`;
    document.getElementById("selectedPokemon").innerHTML += html;

    removeAnimation('currentSelectedPokemon');

}


function removeAnimation(pokemonId) {
    setTimeout(function () {
        document.getElementById(pokemonId).classList.remove('animate');
    }, 1000);
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

async function selectPokemon(index) {
    selectedPokemon = index;
    await renderSelectedPokemon();
}

async function loadPokemonHeadValues(index, pokemonData, forSelectedPokemon = false) {
    if (pokemonData[0]) {
        const currentPokemonData = pokemonData[1];

        let defaultImg = "";
        let types = currentPokemonData["types"];

        if (forSelectedPokemon == true) {
            setBackgroundColor("selectedPokemonHeader", types);
            defaultImg = currentPokemonData["sprites"]["other"]["home"]["front_default"];
        } else {
            defaultImg = currentPokemonData["sprites"]["front_default"];
        }

        document.getElementById("pokemonImg" + index).src = defaultImg;

        let name = currentPokemonData["name"];
        name= name.charAt(0).toUpperCase() + name.slice(1);//Sets first letter to upper-case
        document.getElementById("pokemonName" + index).innerHTML = name;


        let id = index + 1;
        document.getElementById("pokemonId" + index).innerHTML = '#' + id;


        document.getElementById("pokemonTypes" + index).innerHTML = "";

        setBorderColor("pokemon" + index, types);

        for (let i = 0; i < types.length; i++) {
            document.getElementById("pokemonTypes" + index).innerHTML +=
                `<button class='btn d-inline-block ${types[i]['type']['name']}' >${types[i]['type']['name']}</button>`;
        }
    }
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

async function loadPokemonBodyValues(pokemonData) {
    let informationContainer = document.getElementById('pokemonInfoContainer');
    informationContainer.innerHTML = getPokemonAttributeMenu();
    switch (selectedBodyType) {
        case 'abilities':
            informationContainer.innerHTML += await getAbilities(pokemonData);
            break;
        case 'stats':
            informationContainer.innerHTML += `<div class="chart-container">
            <canvas id="statGraph" style=></canvas>
            </div>`;
            let stats = await getStats(pokemonData);
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
        let abilityName = ability['name'].toUpperCase();
        html += `<tr><td id='ability'>${abilityName}</td><td>${abilityDescription}</td></tr>`;

    }
    html += `</table></div>`;
    return html;
}

async function getStats(pokemonData) {
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

async function getPokemonData(index, searchInput = null) {
    let url = "";
    if (searchInput == "") {
        return [false, "Empty String as Input given"];
    } else if (searchInput == null) {
        pokemonId = index + 1;//pokemonId startet bei 1; index bei 0; 
        url = "https://pokeapi.co/api/v2/pokemon/" + pokemonId;
    } else {
        url = "https://pokeapi.co/api/v2/pokemon/" + searchInput;
    }

    try {
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
        return [true, abilityData];
    } catch (e) {
        return [false, e];
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
            <img class='icon' src='./icons/arrow-back.png' onclick="unsetCurrentPokemon();">
            <img class='icon' src='./icons/heart.png' onclick="">
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

