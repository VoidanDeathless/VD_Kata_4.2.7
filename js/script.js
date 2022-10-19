const app = document.querySelector('.app')
const form = app.querySelector('.app__form')
const searchInput = app.querySelector('.app__search')
const autocomplete = app.querySelector('.app__autocomplete-list')
const searchResult = app.querySelector('.app__search-result-list')

searchInput.addEventListener('input', () => {
    if (searchInput.value) {
        debouncedSearch(searchInput.value)
        return
    } 
    clearAutocomplete()
})

autocomplete.addEventListener('click', (event) => {
    if (event.target.className === 'autocomplete-button') addSearchResultItem(event.target.dataset)
})

searchResult.addEventListener('click', (event) => {
    if (event.target.className === 'remove-button') event.target.parentElement.remove()
})

function showAutocomplete(items) {
    if (!items.length) return

    clearAutocomplete()
    items.forEach((e) => autocomplete.appendChild(createAutocompleteItem(e)))
    form.classList.add('app__form--active')
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
    button = document.createElement('button')
    button.classList.add('autocomplete-button')
    button.textContent = dataset.name
    button.dataset.name = dataset.name
    button.dataset.owner = dataset.owner
    button.dataset.stars = dataset.stars
    item.appendChild(button)
    return item
}

function addSearchResultItem(dataset) {
    let item = document.createElement('li')
    item.classList.add('app__search-result-item')
    text = document.createElement('div')
    text.classList.add('app__search-result-text')
    text.innerHTML = `Name: ${dataset.name}<br>Owner: ${dataset.owner}<br>Stars: ${dataset.stars}`
    let remove = document.createElement('button')
    remove.classList.add('remove-button')
    remove.textContent = '❌'
    item.append(text, remove)
    searchResult.appendChild(item)
    searchInput.value = ''
    clearAutocomplete()
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