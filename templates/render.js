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
        await setPokemonHeadValues(index, pokemonData);
    }
    renderLoadMorePokemon(maxPokemonIdofGrid);
    maxPokemonIdofGrid = pokemonAmount;
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
        <div id='pokemonElements' class='pokemon-elements animate w-100' onclick="unsetCurrentPokemon()">
            <div id='currentSelectedPokemon' class="current-selected-pokemon">`+
        getSelectedPokemonHeaderLayout(selectedPokemon)
        + getSelectedPokemonBodyLayout()
        + `<nav class='change-pokemon-menu'>
                    <img src='./icons/next.png' class='next-icon flip-horizontally' onclick='renderPreviousPokemon()'>
                    <img src='./icons/next.png' class='next-icon' onclick='renderNextPokemon()'>
                </nav>
            </div>
        </div>`;
    document.getElementById("selectedPokemon").innerHTML += html;
    stopEventPropagation("currentSelectedPokemon");
    removeAnimation('pokemonElements');
}

function stopEventPropagation(){
    document.getElementById("currentSelectedPokemon").addEventListener("click", stopEvent, false);
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