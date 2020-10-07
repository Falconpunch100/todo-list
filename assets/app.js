var apiKey = "nA4NOLidlYZ3ujbitzCi3bzAXw_gmKLj4ORiLL0iX18"
var baseURL = "https://api.unsplash.com/search/photos?client_id=nA4NOLidlYZ3ujbitzCi3bzAXw_gmKLj4ORiLL0iX18&per_page=20&query="
var backgroundTheme = "";
var imageForm = document.getElementById("imageForm")
var imageSearch = document.getElementById("imageSearch")
var form = document.getElementById("form")
var todo = document.getElementById("todo")
var whiteboard = document.getElementById("whiteboard-list")
var background = document.getElementById("background")
var colorFilter = document.querySelectorAll("input[type = radio]")
var searchResults = document.getElementById("searchResults")
var deleteImages = document.getElementById("deleteImages")
var clearList = document.getElementById("clearList")
var allTodos = []

form.addEventListener("submit", function (event) {
    event.preventDefault()
    var text = todo.value
    var todoObject = { name: text, completed: false, priority: 'medium' }
    allTodos.push(todoObject)
    saveData()
    renderTodos()
});

clearList.addEventListener("click", function () {
    whiteboard.innerHTML = "";
    allTodos.length = 0;
    saveData()
});

deleteImages.addEventListener("click", clearSearchResults);

imageForm.addEventListener("submit", async function (event) {
    event.preventDefault()
    var text = imageSearch.value
    var color = "";
    colorFilter.forEach(element => {
        if (element.checked === true) {
            color = element.value;
        }
    });
    var data = await searchPhotos(text, color)
    showPicResults(data.results)
    //saveData()
});

function renderTodos() {
    whiteboard.innerHTML = ""
    for (let i = 0; i < allTodos.length; i++) {
        const element = allTodos[i];
        var listItems = document.createElement("li")
        listItems.classList.add("items")
        if (element.completed === true) {
            listItems.classList.add("offTheList")
        }
        listItems.textContent = element.name
        whiteboard.appendChild(listItems)
        element.liReference = listItems
    }
    var itemArray = document.getElementsByClassName("items")
    for (let i = 0; i < itemArray.length; i++) {
        const element = itemArray[i];
        element.addEventListener("click", function (event) {
            event.target.classList.toggle("offTheList")
            allTodos.forEach(todo => {
                if (todo.liReference === element) {
                    todo.completed = !todo.completed
                    saveData()
                }
            });
        });
    }
}

async function searchPhotos(searchQuery, color) {
    if (color === "") {
        var response = await fetch(baseURL + searchQuery);
        var data = await response.json()
    }
    else {
        var response = await fetch(baseURL + searchQuery + "&color=" + color);
        var data = await response.json()
    }
    return data;
}

function showPicResults(pics) {
    clearSearchResults()
    for (var i = 0; i < pics.length; i++) {
        var element = pics[i];
        searchResults.innerHTML += displayPic(element)
    }
    var figureArray = document.getElementsByClassName("grid-item")
    for (var i = 0; i < figureArray.length; i++) {
        var element = figureArray[i];
        element.addEventListener("click", function (event) {
            var photo = event.target.parentNode.dataset.regular;
            background.style.backgroundImage = `url("${photo}")`
            saveBG()
        });
    }
}

function displayPic(pic) {
    return `
    <figure class="grid-item" data-regular="${pic.urls.regular}">
    <img src="${pic.urls.thumb}"></img>
    <figcaption>${pic.alt_description}</figcaption>
    </figure>
    `
}

function clearSearchResults() {
    searchResults.innerHTML = ""
}

function saveData() {
    var stringTodos = JSON.stringify(allTodos)
    localStorage.setItem("stringTodos", stringTodos)

}

function saveBG() {
    var currentIMG = document.querySelector("header").style.backgroundImage
    localStorage.setItem("bgimage", currentIMG)
    console.log(currentIMG)
}

function loadData() {
    var loading = localStorage.getItem("stringTodos")
    var array = JSON.parse(loading)
    console.log(array)
    allTodos = array;
    renderTodos()
    var selectedBGImage = localStorage.getItem("bgimage")
    background.style.backgroundImage = selectedBGImage;
}
loadData()