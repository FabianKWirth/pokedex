async function setPokemonAllValues() {
    let pokemonData = await getPokemonData(selectedPokemon);
    await setPokemonHeadValues(selectedPokemon, pokemonData, true);
    await setPokemonBodyValues(pokemonData);
}

async function setSearchResults() {
    let index = 0;
    let searchInput = document.getElementById("searchInput").value.toLowerCase();
    let pokemonData = await getPokemonData(index, searchInput);
    if (searchInput != null && searchInput != "") {
        if (pokemonData[0] == 'true') {
            maxPokemonIdofGrid = pokemonData[1].length;
            let index = pokemonData[1]['id'] - 1;
            if (index != selectedPokemon) {
                emptyGrid();
                await renderPokemonGridItemLayout(index);
                await setPokemonHeadValues(index, pokemonData);
            }
        } else {
            renderNothingFoundMessage(searchInput);
        }
    } else {
        renderNothingFoundMessage(searchInput);
    }
    renderResetPageButton();
}

async function setPokemonHeadValues(index, pokemonData, isSelectedPokemon = false) {
    if (pokemonData[0]) {
        const currentPokemonData = pokemonData[1];
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

async function setPokemonBodyValues(pokemonData) {
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

async function setSelectedBodyType(typeName) {
    let pokemonData = await getPokemonData(selectedPokemon);
    selectedBodyType = typeName;
    setPokemonBodyValues(pokemonData);
}