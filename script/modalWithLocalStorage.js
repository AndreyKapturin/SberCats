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

refreshCatsAndContent()

// Обновление контента синхронно 

function refreshCatsAndContentSync() {
    content.innerHTML = ""
    const allCats = JSON.parse(localStorage.cats)
        return content.innerHTML = allCats.reduce((str, el) => {
            return str += createCatCard(el)
        }, "")
}

// Внесение изменений в LocalStorage

function editCatByIDSync(catID, newCat) {
    let allCats = JSON.parse(localStorage.cats)
    let newAllCats = allCats.map(el => el.id === catID ? el = {...newCat} : el)
    return localStorage.setItem("cats", JSON.stringify(newAllCats))
}

// Предзаполнение формы редактирования данными о коте

function prefillFormSync(catID) {
    const allCats = JSON.parse(localStorage.cats)
    const cat = allCats.find(el => el.id === catID)
        editCatForm.name.value = cat.name;
        editCatForm.image.value = cat.image;
        editCatForm.age.value = cat.age;
        editCatForm.rate.value = cat.rate;
        editCatForm.favorite.value = cat.favorite;
        cat.favorite ? editFormLike.classList.add("on") : editFormLike.classList.remove("on");
        editCatForm.description.value = cat.description;
}

// Отображение информации о коте

function showCatInfoSync(catID) {
    const allCats = JSON.parse(localStorage.cats)
    const cat = allCats.find(el => el.id === catID)
    document.querySelector(".catInfoName").textContent = cat.name
    document.querySelector(".catInfoAge").textContent = cat.age
    document.querySelector(".catInfoRate").innerHTML = starFill.repeat(cat.rate) + starNoFill.repeat(5-cat.rate)
    document.querySelector(".catInfoDescription").textContent = cat.description
    document.querySelector(".catImageBig").src = cat.image
}

// Получение нового ID

function getNewCatIDSync() {
    const allCats = JSON.parse(localStorage.cats)
    const allCatsIds = allCats.map(el => el.id)
    return Math.max(...allCatsIds) + 1
}

// Добавление кота в LocalStorage

function addCatSync(newCat) {
    const allCats = JSON.parse(localStorage.cats)
    allCats.push(newCat)
    return localStorage.setItem("cats", JSON.stringify(allCats))
}

// Удаление кота в LocalStorage

function deleteCatSync(catID) {
    const allCats = JSON.parse(localStorage.cats)
    const filterCats = allCats.filter(el => el.id != catID)
    return localStorage.setItem("cats", JSON.stringify(filterCats))
}

// listeners
// Слушатель кнопки закрытия в форме редактирования

editFormCloser.addEventListener("click", () => {
    editformContainer.classList.add("invisibility");
})

// Слушатель кнопки отправки в форме редактирования синхронно

editCatForm.addEventListener("submit", (event) => {
    event.preventDefault()
    let formData = new FormData(event.target)
    let newCat = { ...Object.fromEntries(formData), id: catID,
    favorite: editFormFavorite.value === "true" ? true : false }
    api.editCatByID(catID, newCat)
    editCatByIDSync(catID, newCat)
    refreshCatsAndContentSync()
    editformContainer.classList.add("invisibility");
    addFormLike.classList.remove("on")
    event.target.reset()
})

// Слушатель кнопки закрытия в окне информации о коте

aboutCatCloser.addEventListener("click", () =>{
    aboutCatModal.classList.add("invisibility")
})

// Слушатель кнопки добавления кота

addCatButton.addEventListener("click", () => {
    addCatFormContainer.classList.remove("invisibility");
})

// Слушатель кнопки отправки в форме добавления кота

addCatForm.addEventListener("submit", (event) => {
    event.preventDefault()
    let formData = new FormData(event.target)
    let newCat = { ...Object.fromEntries(formData), id: getNewCatIDSync(),
        favorite: addFormFavorite.value === "true" ? true : false }
    api.addCat(newCat)
    addCatSync(newCat)
    refreshCatsAndContentSync()
    addCatFormContainer.classList.add("invisibility")
    addCatForm.reset()
})

// Слушатель кнопки закрытия в добавления кота

addFormCloser.addEventListener("click", () =>{
    addCatFormContainer.classList.add("invisibility");
})

// Слушатель кнопок карточек котов

content.addEventListener("click", (event) => {
    if (event.target.localName === "button") {
        catID = Number(event.target.value);
        switch (event.target.className) {
            case "cat-delete-btn":
                api.deleteCatByID(catID)
                deleteCatSync(catID)
                refreshCatsAndContentSync()
                break;
            case "cat-edit-btn":
                prefillFormSync(catID)
                editformContainer.classList.remove("invisibility")
                break;
            case "cat-view-btn":
                showCatInfoSync(catID)
                aboutCatModal.classList.remove("invisibility")
                break;
            default:
                console.error("Котиков не будет!");
        }
    }
})

// Слушатель лайка в форме редактирования

editFormLike.addEventListener("click", () => {
    editFormFavorite.value = editFormFavorite.value === "true" ? "false" : "true"
    editFormLike.classList.toggle("on")
})

// Слушатель лайка в форме добавления

addFormLike.addEventListener("click", () => {
    addFormFavorite.value = addFormFavorite.value === "true" ? "false" : "true"
    addFormLike.classList.toggle("on")
})