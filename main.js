let selectedPokemon = 17;
let pokemonAmount=20;


async function init() {
    if (selectedPokemon == null) {
        await renderPokemonGrid();
    } else {
        await renderPokemonGrid();
        await renderSelectedPokemon();
    }
}

async function renderPokemonGrid() {
    emptyGrid();
    for (let index = 0; index < pokemonAmount; index++) {
        let pokemonData=await getPokemonData(index);
        await renderPokemonGridItemLayout(index);
        await loadPokemonHeadValues(index,pokemonData);
    }
}

async function renderSelectedPokemon() {
    emptySelectedPokemon();
    renderSelectedPokemonLayout();
    await loadPokemonAllValues(selectedPokemon);
    //firstType=
}

async function loadPokemonAllValues(selectedPokemon){
    let pokemonData= await getPokemonData(index);
    await loadPokemonHeadValues(selectedPokemon,pokemonData);
    await loadPokemonBodyValues(selectedPokemon,pokemonData);

}

function renderSelectedPokemonLayout(){
    html=`
    <div class="w-25">`+
        getSelectedPokemonHeaderLayout(selectedPokemon)
        +getSelectedPokemonBodyLayout(selectedPokemon)
    +`</div>`;
    document.getElementById("selectedPokemon").innerHTML += html;
}

function renderPokemonGridItemLayout(index) {
    html=`<div id="pokemon${index}" class="pokemon-grid-container">`;
    html+=
    `<div class='d-flex justify-content-between align-items-baseline w-75'>
        <h2 id='pokemonName${index}'></h2>
        <div id='pokemonId${index}' class='align-bottom'></div>
    </div>`;
    html+=
    `<div id='pokemonContent${index}' class='d-flex justify-content-between w-75'>
        <div class='btn-group-vertical'id='pokemonTypes${index}'></div>
        <img id='pokemonImg${index}' class='pokemon-img'>
    </div>`;   
    
    document.getElementById("pokedexGrid").innerHTML += html;
}


async function loadPokemonHeadValues(index,pokemonData) {
    if(pokemonData[0]){
        const currentPokemonData=pokemonData[1];
    let defaultImg = currentPokemonData["sprites"]["front_default"];
    document.getElementById("pokemonImg" + index).src = defaultImg;

    let name = currentPokemonData["name"];
    document.getElementById("pokemonName" + index).innerHTML = name;

    let id = index+1;
    document.getElementById("pokemonId" + index).innerHTML = '#'+id;

    let types = currentPokemonData["types"];
    document.getElementById("pokemonTypes" + index).innerHTML = "";
    for (let i = 0; i < types.length; i++) {
        document.getElementById("pokemonTypes" + index).innerHTML += 
        `<button class='btn type-button d-inline-block ${types[i]['type']['name']}' disabeld>${types[i]['type']['name']}</button>`;
    }
    }
}

async function getPokemonData(index) {
    pokemonId=index+1;//pokemonId startet bei 1; index bei 0; 
    try {
        let url = "https://pokeapi.co/api/v2/pokemon/" + pokemonId;
        let response = await fetch(url);
        let pokemonData = await response.json();
        return ['true',pokemonData];
    } catch (e) {
        return ['false',e];
    }

}

function emptyGrid() {
    document.getElementById("pokedexGrid").innerHTML = "";
}

function emptySelectedPokemon(){
    document.getElementById("selectedPokemon").innerHTML = "";
}

function unsetCurrentPokemon() {
    currentPokemon = null;
}


function getSelectedPokemonBodyLayout(index) {
    html = `<div class='pokemon-info-container'>Test</div>`;
    return html;
}

function getSelectedPokemonHeaderLayout() {
    index=selectedPokemon;
    html = `
    <div class='pokemon-header'>
        <div class='pokemon-header-menu'>
            <img class='icon invert' src='./icons/arrow-back.png' onclick="unsetCurrentPokemon();init();">
            <img class='icon invert' src='./icons/heart.png' onclick="unsetCurrentPokemon();init();">
        </div>
        <div class='d-flex justify-content-between align-items-baseline'>
        <h1 id='pokemonName${index}'></h1>
        <div id='pokemonId${index}' class='align-bottom'></div>
        </div>
        <div id="pokemonTypes${index}" class="pokemon-types">
        </div>
        <img id="pokemonImg${index}" class="pokemon-img-200">
    </div>`
    return html;
}

