function reset() {
    selectedPokemon = null;
    pokemonAmount = 40;
    maxPokemonIdofGrid = 0;
    selectedBodyType = null;
    removeAllAlerts();
    pokemonData = [];
    emptyGrid();
    init();
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

function removeAllAlerts() {
    let elements = document.getElementsByClassName('alert');
    for (let index = 0; index < elements.length; index++) {
        const element = elements[index];
        element.remove();
    }
}