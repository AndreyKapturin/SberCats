// constants

const content = document.querySelector("#content")
const editformContainer = document.querySelector("#editFormContainer")
const editCatForm = document.querySelector("#editCatForm")
const editFormCloser = document.querySelector("#editFormCloser")
const aboutCatModal = document.querySelector("#aboutCatModal")
const aboutCatCloser = document.querySelector("#aboutCatCloser")
const addCatButton = document.querySelector("#addCatButton")
const addCatFormContainer = document.querySelector("#addCatFormContainer")
const addCatForm = document.querySelector("#addCatForm")
const addFormCloser = document.querySelector("#addFormCloser")
const starNoFill = '<img class="rateStar" src="images/rateStarNoFill.png" alt="star">'
const starFill = '<img class="rateStar" src="images/rateStarFill.png" alt="">'
const editFormLike = document.querySelector("#editFormContainer .like")
const editFormFavorite = document.querySelector("#editFormContainer #favorite")
const addFormLike = document.querySelector("#addCatFormContainer .like")
const addFormFavorite = document.querySelector("#addCatFormContainer #favorite")
const localStorage = window.localStorage
let catID


// api.getAllCats()
// .then(res => localStorage.setItem("cats", JSON.stringify(res)))
console.log(localStorage);


// functions

// Создание карточки с котом
function createCatCard(cat) {
    return `<div class = "catCard">
        <img class = "catImage" src = ${cat.image}>
        <div class = "wrap">
        ${cat.name}
        <div class = "like ${cat.favorite ? "on" : null}"></div>
        </div>
        <div class = "rate">${starFill.repeat(cat.rate) + starNoFill.repeat(5-cat.rate)}</div>
        <div class = "action-btn">
            <button class = "cat-view-btn" value = "${cat.id}">Посмотреть</button>
            <button class = "cat-edit-btn" value = "${cat.id}">Изменить</button>
            <button class = "cat-delete-btn" value = "${cat.id}">Удалить</button>
        </div>
    </div>`
}

// Обновление контента

function refreshCatsAndContent() {
    content.innerHTML = ""
    api.getAllCats().then(res => {
        localStorage.setItem("cats", JSON.stringify(res))
        return content.innerHTML = res.reduce((str, el) => {
            return str += createCatCard(el)
        }, "")
    })
}

// Отображение информации о коте

function showCatInfoSync(catID) {
    return api.getCatByID(catID)
    .then(cat => {
        document.querySelector(".catInfoName").textContent = cat.name
        document.querySelector(".catInfoAge").textContent = cat.age
        document.querySelector(".catInfoRate").innerHTML = starFill.repeat(cat.rate) + starNoFill.repeat(5-cat.rate)
        document.querySelector(".catInfoDescription").textContent = cat.description
        document.querySelector(".catImageBig").src = cat.image
    })
    
}

refreshCatsAndContent()

const cats = JSON.parse(localStorage.cats)

console.log(cats);