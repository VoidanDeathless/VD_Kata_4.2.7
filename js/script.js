const app = document.querySelector('.app')
const form = app.querySelector('.app__form')
const searchInput = app.querySelector('.app__search')
const autocomplete = app.querySelector('.app__autocomplete-list')
const searchResult = app.querySelector('.app__search-result-list')

searchInput.addEventListener('input', () => {
    if (searchInput.value) {
        debouncedSearch(searchInput.value)
    } else {
        clearAutocomplete()
    }
})

autocomplete.addEventListener('click', (event) => {
    if (event.target.className === 'app__autocomplete-item') {
        addSearchResultItem(event.target.dataset)
        searchInput.value = ''
        clearAutocomplete()
    }
})

searchResult.addEventListener('click', (event) => {
    if (event.target.className === 'app__search-result-remove') event.target.parentElement.remove()
})

function showAutocomplete(items) {
    if (items.length) {
        clearAutocomplete()
        items.forEach((e) => autocomplete.appendChild(createAutocompleteItem(e)))
        form.classList.add('app__form--active')
    }
}

function clearAutocomplete() {
    while (autocomplete.firstChild) {
        autocomplete.removeChild(autocomplete.firstChild)
        form.classList.remove('app__form--active')
    }
}

function createAutocompleteItem(dataset) {
    let item = document.createElement('li')
    item.classList.add('app__autocomplete-item')
    item.textContent = dataset.name
    item.dataset.name = dataset.name
    item.dataset.owner = dataset.owner
    item.dataset.stars = dataset.stars
    return item
}

function addSearchResultItem(dataset) {
    let item = document.createElement('li')
    item.classList.add('app__search-result-item')
    item.innerHTML = `Name: ${dataset.name}<br>Owner: ${dataset.owner}<br>Stars: ${dataset.stars}`
    let remove = document.createElement('span')
    remove.classList.add('app__search-result-remove')
    remove.textContent = '❌'
    item.appendChild(remove)
    searchResult.appendChild(item)
}

function search(value) {
    fetch(`https://api.github.com/search/repositories?q=${value}&per_page=5`)
    .then(res => res.json())
    .then(res => res.items.map((e) => ({name: e.name, owner: e.owner.login, stars: e.stargazers_count})))
    .then(items => showAutocomplete(items))
}

// the rate limit allows you to make up to 10 requests per minute
const debouncedSearch = debounce(search, 6000)

function debounce(callback, debounceTime) {
    let timeout
    return function() {
        clearTimeout(timeout)
        timeout = setTimeout(() => callback.apply(this, arguments), debounceTime)
    }
}