const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

// Testes

document.addEventListener("DOMContentLoaded", function () {
    pokemonList.addEventListener("click", function (event) {
        let listItem = event.target.closest("li.pokemon");
        if (listItem) {
            const pokemonNumber = listItem.querySelector(".number").textContent.replace("#", ""); // Pegando o número do Pokémon
            window.location.href = `detalhes.html?pokemon=${pokemonNumber}`; // Redireciona para a página de detalhes
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonNumber = urlParams.get("pokemon");

    if (pokemonNumber) {
        // Buscando os dados da API
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById("poke-name").textContent = data.name.toUpperCase();
                document.getElementById("poke-img").src = data.sprites.front_default;
                document.getElementById("poke-number").textContent = `Número: #${data.id}`;
                document.getElementById("poke-type").textContent = "Tipo: " + data.types.map(type => type.type.name).join(", ");
            })
            .catch(error => console.error("Erro ao buscar Pokémon:", error));
    }
});