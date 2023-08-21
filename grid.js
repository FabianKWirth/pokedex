function startLoadingAnimation() {
    document.getElementById("loadingContainer").classList.remove('hide');
}

function endLoadingAnimation() {
    document.getElementById("loadingContainer").classList.add('hide');
}

function setLoadingText(text) {
    document.getElementById('loadingText').innerHTML = text;
}

function setPokemonGrid(currentGrid) {
    currentOutputGrid = currentGrid;
    let defaultGrid = document.getElementById('defaultGrid');
    let searchResultGrid = document.getElementById('searchResultGrid');
    if (currentOutputGrid == 'searchResultGrid') {
        defaultGrid.classList.add('hide');
        searchResultGrid.classList.remove('hide');
        renderGotoDefaultGridButton();
    } else if (currentOutputGrid == 'defaultGrid') {
        defaultGrid.classList.remove('hide');
        searchResultGrid.classList.add('hide');
        renderLoadMorePokemon();
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

async function getAbilities(pokemonId) {
    let currentPokemonAbilities = pokemonData[pokemonId]['abilities'];
    html = `<div class='abilities'><h3>Abilities</h3>
    <table class='abilities-table'><thead><th>Name</th><th>Description</th></thead>`;
    for (let index = 0; index < currentPokemonAbilities.length; index++) {
        html += await getSingleAbility(currentPokemonAbilities[index])


    }
    html += `</table></div>`;
    return html;
}

async function getSingleAbility(ability) {
    let abilityId = ability['ability']['id'];
    let abilityName = ability['ability']['name'];
    let abilityDescription = await getAbilityDescription(abilityId);
    return `<tr><td id='ability'>${abilityName.toUpperCase()}</td><td>${abilityDescription}</td></tr>`;
}

function emptySearchGrid() {
    document.getElementById('searchResultGrid').innerHTML = "";
}

async function renderPokemonSearchGrid(pokemonDataOfSearch) {
    for (let index = 0; index < pokemonDataOfSearch.length; index++) {
        let currentPokemonData = pokemonDataOfSearch[index];
        currentOutputGrid = 'searchResultGrid';
        pokemonIndex = pokemonDataOfSearch[index]['id'] - 1;
        await renderPokemonGridItemLayout(pokemonIndex);
        await setPokemonHeadValues(pokemonIndex, false, currentPokemonData);
    }
}

async function renderPokemonGrid() {
    for (let index = maxRenderedPokemonIndex; index < loadedPokemonDataOffset; index++) {
        let currentPokemonData = pokemonData[index];
        await renderPokemonGridItemLayout(index);
        await setPokemonHeadValues(index, currentPokemonData);
        maxRenderedPokemonIndex = index;
    }
    renderLoadMorePokemon();
    maxRenderedPokemonIndex++;
}

async function emptyGrid() {
    document.getElementById("defaultGrid").innerHTML = "";
    document.getElementById("searchResultGrid").innerHTML = "";
    maxRenderedPokemonIndex = 0;
}

function renderLoadMorePokemon() {
    document.getElementById('postGrid').innerHTML = "<button class='btn btn-dark btn-lg load-more-btn' onclick='increasePokemonPool()'>Weitere Laden</button>";
}

function renderGotoDefaultGridButton() {
    document.getElementById('postGrid').innerHTML = "<button class='btn btn-dark btn-lg load-more-btn' onclick='setPokemonGrid(\"defaultGrid\")'>zurück</button>";
}

async function renderPokemonGridItemLayout(index) {
    html = `
    <div name="pokemon${index}" class='pokemon-grid-item-container' onclick="selectPokemon(${index});">
        <div class="d-flex justify-content-between align-items-baseline w-75">
            <h2 name='pokemonName${index}' ></h2>
            <div name='pokemonId${index}' class='align-bottom'></div>
        </div>
        <div name='pokemonContent${index}' class='d-flex justify-content-between w-75' o>
            <div class='btn-group-vertical' name='pokemonTypes${index}' ></div>
            <img name='pokemonImg${index}' class='pokemon-img' >
        </div>
     </div>`;
    document.getElementById(currentOutputGrid).innerHTML += html;
}
