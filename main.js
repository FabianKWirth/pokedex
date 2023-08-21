let selectedPokemon = null;
let selectedBodyType = null;
let maxRenderedPokemonIndex = 0;
currentOutputGrid = 'defaultGrid'; //alternativ is searchResultGrid



async function init() {
    await loadPokemons();
    await renderPokemonGrid();
}

async function increasePokemonPool() {
    //same function content as init but for functional reasons separated since further changes may cause this function 
    await loadPokemons();
    await renderPokemonGrid();
}

function startLoadingAnimation() {
    document.getElementById("loadingContainer").classList.remove('hide');
}

function endLoadingAnimation() {
    document.getElementById("loadingContainer").classList.add('hide');
}

function setLoadingText(text) {
    document.getElementById('loadingText').innerHTML = text;
}

async function searchPokemon() {
    startLoadingAnimation();
    let searchInput = await getSearchInput();
    if (searchInput != null) {
        let pokemonDataOfSearch = await getPokemonsOfSearch(searchInput);
        if (pokemonDataOfSearch.length != 0) {
            setPokemonGrid('searchResultGrid');
            emptySearchGrid();
            await renderPokemonSearchGrid(pokemonDataOfSearch);
        }
    }
    endLoadingAnimation();
}

async function getSearchInput() {
    let searchInput = document.getElementById('searchInput').value.toLowerCase();

    if (searchInput == "") {
        alert("Please insert a search term");
        return null;
    } else {
        return searchInput;
    }


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

async function getSelectedPokemonBodyLayout() {
    html = `<div class='pokemon-info-container' id='pokemonInfoContainer'></div>`;
    return html;
}

async function getSelectedPokemonHeaderLayout() {
    index = selectedPokemon;

    let likedPokemonImgHtml = getLikedPokemonImgHtml(selectedPokemon);
    html = `
    <div class='pokemon-header' id='selectedPokemonHeader'>
        <div class='pokemon-header-menu w-75'>
            <img class='icon' src='./icons/arrow-back.png' onclick="unsetCurrentPokemon()">
            ${likedPokemonImgHtml}
        </div>
        <div class='d-flex justify-content-between align-items-baseline w-75'>
        <h2 name='pokemonName${index}'></h2>
        <div name='pokemonId${index}' class='pokemon-id align-bottom'></div>
        </div>
        <div name="selectedPokemonTypes${index}" class="pokemon-types d-flex justify-content-start w-75">
        </div>
        <img name="selectedPokemonImg${index}" class="pokemon-img-200">
    </div>`
    return html;
}

function getLikedPokemonImgHtml(selectedPokemon) {
    let img = `<img class='icon' id='heart${selectedPokemon}' name='heartEmpty' onclick='updateIcon(${selectedPokemon})' src='./icons/heart.png'>`;

    if (likedPokemons.includes(selectedPokemon)) {
        img = `<img class='icon' id='heart${selectedPokemon}' name='heartFilled' onclick='updateIcon(${selectedPokemon})' src='./icons/heart-filled.png'>`;
    }
    return img;
}

function getPokemonAttributeMenu() {
    let html = `
    <div class="btn-group pokemon-attribute-menu" role="group">
        <button type="button menu-button" class="btn btn-secondary" onclick='setSelectedBodyType(\"abilities\")'>Abilities</button>
        <button type="button menu-button" class="btn btn-secondary" onclick='setSelectedBodyType(\"stats\")'>Stats</button>
    </div>`;
    return html;
}

async function setPokemonAllValues() {
    setPokemonHeadValues(selectedPokemon, true);
    await setPokemonBodyValues();
}

async function setPokemonHeadValues(index, isSelectedPokemon = false, specificPokemonData) {
    let currentPokemonData = await getCurrentPokemonData(index, specificPokemonData);

    if (isSelectedPokemon == true) {
        setSelectedPokemonImg(index, currentPokemonData);
        setBackgroundColor("selectedPokemonHeader", currentPokemonData["types"]);
    } else {
        setSrcOfElementsByName('pokemonImg' + index, currentPokemonData["sprites"]["front_default"]);
        setBorderColor("pokemon" + index, currentPokemonData["types"]);
    }
    setName(index, currentPokemonData["name"]);
    setId(index);
    setTypes(index, currentPokemonData["types"]);
}

function setSelectedPokemonImg(index, currentPokemonData) {
    let answer = currentPokemonData["sprites"]["other"]["home"]["front_default"];
    if (answer != null) {
        setSrcOfElementsByName('selectedPokemonImg' + index, currentPokemonData["sprites"]["other"]["home"]["front_default"]);
    } else {
        setSrcOfElementsByName('selectedPokemonImg' + index, currentPokemonData["sprites"]["front_default"]);
    }

}

function setInnerHtmlofElementsByName(name, value) {
    elements = document.getElementsByName(name);
    for (let index = 0; index < elements.length; index++) {
        element = elements[index];
        element.innerHTML = value;
    }
}

function setSrcOfElementsByName(name, value) {

    let srcReturnValue = value;
    if (srcReturnValue == null) {
        value = './icons/not-found.png';
    }
    elements = document.getElementsByName(name);
    for (let index = 0; index < elements.length; index++) {
        element = elements[index];
        element.src = value;
    }
}

function setName(index, name) {
    name = name.charAt(0).toUpperCase() + name.slice(1);//Sets first letter to upper-case
    setInnerHtmlofElementsByName("pokemonName" + index, name);
}

function setId(index) {
    id = index + 1;
    elements = document.getElementsByName("pokemonId" + index).innerHTML;
    setInnerHtmlofElementsByName("pokemonId" + index, '#' + id);
}

function setTypes(index, types) {
    let html = "";
    for (let i = 0; i < types.length; i++) {
        html +=
            `<button class='btn d-inline-block ${types[i]['type']['name']}' >
            ${types[i]['type']['name']}
        </button>`;
    }

    setInnerHtmlofElementsByName("pokemonTypes" + index, html);
}

function setBorderColor(id, types) {
    elements = document.getElementsByName(id);
    for (let index = 0; index < elements.length; index++) {
        elements[index].classList.add("border-" + types[0]['type']['name'])
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
            let stats = await getStats();
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
    if (!pokemonData[selectedPokemon]) {
        await increasePokemonPool();
    }
    await renderSelectedPokemon();

}

async function renderPreviousPokemon() {
    if (selectedPokemon == null || selectedPokemon == 0) {
        selectedPokemon = 1;
    }
    selectedPokemon--;
    await renderSelectedPokemon();
}

async function renderSelectedPokemonLayout() {
    html = `
        <div id='pokemonElements' class='pokemon-elements animate w-100 overflow-y-scroll position-fixed' onclick='unsetCurrentPokemon()'>
            <div id='currentSelectedPokemon' class='current-selected-pokemon'>`+
        await getSelectedPokemonHeaderLayout(selectedPokemon)
        + await getSelectedPokemonBodyLayout();
    if (currentOutputGrid == 'defaultGrid') {
        html +=
            `<nav class='change-pokemon-menu' id='changePokemonMenu'>
                    <img src='./icons/next.png' class='next-icon flip-horizontally' onclick='renderPreviousPokemon()'>
                    <img src='./icons/next.png' class='next-icon' onclick='renderNextPokemon()'>
                </nav>`;
    }
    html += `
            </div>
        </div>`;
    document.getElementById("selectedPokemon").innerHTML += html;
    stopEventPropagation("currentSelectedPokemon");
    removeAnimation('pokemonElements');
}

function stopEventPropagation(elementId) {
    document.getElementById(elementId).addEventListener("click", stopEvent, false);
}

function stopEvent(event) {
    event.stopPropagation();
}

function emptySelectedPokemon() {
    document.getElementById("selectedPokemon").innerHTML = "";
}

function unsetCurrentPokemon() {
    selectedPokemon = null;
    emptySelectedPokemon();
}

function removeAnimation(pokemonId) {
    setTimeout(function () {
        selectedPokemonElement = document.getElementById(pokemonId);
        if (selectedPokemonElement != null) {
            selectedPokemonElement.classList.remove('animate');
        }
    }, 1000);
}

function setLikedPokemonIcon() {
    for (let index = 0; index < likedPokemons.length; index++) {
        pokemonId = likedPokemons[index];
        iconId = "heart" + pokemonId;
        setPokemonLiked(pokemonId, iconId);
    }
}

function setPokemonLiked(pokemonId, iconId) {
    likedPokemons.push(pokemonId);
    document.getElementById(iconId).src = '/icons/heart-filled.png';
    document.getElementById(iconId).name = 'heartFilled';
    saveLikedPokemons();
}

function unsetPokemonLiked(pokemonId, iconId) {
    index = likedPokemons.indexOf(pokemonId);
    likedPokemons.splice(index, 1);
    document.getElementById(iconId).src = '/icons/heart.png';
    document.getElementById(iconId).name = 'heartEmpty';
    saveLikedPokemons();
}

function updateIcon(pokemonId) {
    let iconId = "heart" + pokemonId;
    if (document.getElementById(iconId).name == 'heartFilled') {
        unsetPokemonLiked(pokemonId, iconId);
    } else {
        setPokemonLiked(pokemonId, iconId);
    }
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





