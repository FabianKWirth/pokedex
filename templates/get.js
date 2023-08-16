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