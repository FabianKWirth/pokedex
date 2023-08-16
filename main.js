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

async function increasePokemonPool() {
    pokemonAmount = pokemonAmount + 40;
    await renderPokemonGrid();
}

function removeAnimation(pokemonId) {
    setTimeout(function () {
        document.getElementById(pokemonId).classList.remove('animate');
    }, 1000);
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





