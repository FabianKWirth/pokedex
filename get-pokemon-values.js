async function getCurrentPokemonData(index, specificPokemonData) {
    let currentPokemonData = null;
    if (specificPokemonData == null) {
        currentPokemonData = pokemonData[index];
    } else {
        currentPokemonData = specificPokemonData;
    }
    return currentPokemonData;
}

async function getStats() {
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

async function getAbilityDescription(abilityId) {
    let abilityData = await getAbilityData(abilityId);
    //german and englisch texts are mixed up in array indexes
    let effectEntries = abilityData['effect_entries'];
    abilityDescription = await getAbilityDescriptionText(effectEntries, "en");
    return abilityDescription;
}

function getAbilityData(abilityId) {
    return abilityData[abilityId];
}

async function getAbilityDescriptionText(effectEntries, languageCode) {
    abilityDescription = "";
    for (let index = 0; index < effectEntries.length; index++) {
        const effectEntry = effectEntries[index];
        if (effectEntry['language']['name'] == languageCode) {
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