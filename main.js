let currentPokemon = null;
let pokemons = [
    "bulbasaur",
    "charmander",
    "squirtle",
    "pikachu",
    "jigglypuff",
    "meowth",
    "psyduck",
    "geodude",
    "gengar",
    "kangaskhan",
    "mr-mime",
    "eevee",
    "ditto",
    "vaporeon",
    "jolteon",
    "flareon",
    "porygon",
    "dragonite",
    "mewtwo",
    "mew"
];

/*
  pokemons=[
    "makuhita",
    "hariyama",
    "squirtle"
  ];
*/

async function init() {
    if (currentPokemon == null) {
        await getPokemonOverview();
    } else {
        await renderCurrentPokemon();
    }
}

async function renderCurrentPokemon() {

}



async function getPokemonOverview() {
    emptyContainer();
    for (let index = 0; index < pokemons.length; index++) {
        await loadSimplePokemon(index);
    }
}

function emptyContainer(){
    document.getElementById("pokedex").innerHTML="";
}

function unsetCurrentPokemon(){
    currentPokemon = null;
}


async function loadSimplePokemon(index) {
    pokemonName = pokemons[index];
    //pokemonData = await getCurrentPokemonValues();
    try {
        let url = "https://pokeapi.co/api/v2/pokemon/" + pokemonName;
        let response = await fetch(url);
        let pokemonData = await response.json();
        console.log(pokemonData);

        renderSimplePokemonLayout(index);
        renderSimplePokemonValues(index, pokemonData);
    } catch(e) {
        console.error(e);
    }

}

function renderSimplePokemonValues(index, pokemonData) {
    let defaultImg = pokemonData["sprites"]["front_default"];
    document.getElementById("pokemonImg" + index).src = defaultImg;

    let name = pokemonData["name"];
    document.getElementById("pokemonName" + index).innerHTML = name;

    let types = pokemonData["types"];
    document.getElementById("pokemonTypes" + index).innerHTML = "";

    for (let i = 0; i < types.length; i++) {
        document.getElementById("pokemonTypes" + index).innerHTML += types[i]['type']['name'];
    }
}

function renderSimplePokemonLayout(index) {
    html = `
    <div id="pokemon${index}" class="pokemon">
        <div class='pokemon-header'>
            <div class='pokemon-header-menue'>
                <img class='icon invert' src='./icons/arrow-back.png' onclick="unsetCurrentPokemon();init();">
                <img class='icon invert' src='./icons/heart.png' onclick="unsetCurrentPokemon();init();">
            </div>
            <h2 id="pokemonName${index}" class="pokemon-name"></h2>
            <table class="pokemon-stats">
                <tr id="pokemonTypes${index}">                
                </tr>
            </table>
            <img id="pokemonImg${index}" class="pokemon-img">
        </div>
        
    </div>
`;

    document.getElementById("pokedex").innerHTML += html;
}
