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
        console.log(res);
        return content.innerHTML = res.reduce((str, el) => {
            return str += createCatCard(el)
        }, "")
    })
}

refreshCatsAndContent()

// Предзаполнение формы редактирования данными о коте

function prefillForm(catID) {
    return api.getCatByID(catID).then(res => {
        editCatForm.name.value = res.name;
        editCatForm.image.value = res.image;
        editCatForm.age.value = res.age;
        editCatForm.rate.value = res.rate;
        editCatForm.favorite.value = res.favorite;
        res.favorite ? editFormLike.classList.add("on") : editFormLike.classList.remove("on");
        editCatForm.description.value = res.description;
    })
}

// Отображение информации о коте

function showCatInfo(catID) {
    return api.getCatByID(catID)
    .then(cat => {
        document.querySelector(".catInfoName").textContent = cat.name
        document.querySelector(".catInfoAge").textContent = cat.age
        document.querySelector(".catInfoRate").innerHTML = starFill.repeat(cat.rate) + starNoFill.repeat(5-cat.rate)
        document.querySelector(".catInfoDescription").textContent = cat.description
        document.querySelector(".catImageBig").src = cat.image
    })
    
}

// Получение нового ID

function getNewCatID() {
    return api.getCatsIDs()
    .then(res => Math.max(...res) + 1)
}


// listeners
// Слушатель кнопки закрытия в форме редактирования

editFormCloser.addEventListener("click", () => {
    editformContainer.classList.add("invisibility");
})

// Слушатель кнопки отправки в форме редактирования

editCatForm.addEventListener("submit", (event) => {
    event.preventDefault()
    let formData = new FormData(event.target)
    let newCat = { ...Object.fromEntries(formData), id: catID }
    console.log(newCat);
    api.editCatByID(catID, newCat)
        .then(() => {
            refreshCatsAndContent()
            editformContainer.classList.add("invisibility");
            event.target.reset()
        })
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
    getNewCatID()
    .then(res => {
        let formData = new FormData(event.target)
        let newCat = { ...Object.fromEntries(formData), id: res }
        api.addCat(newCat)
        .then(() =>{
            refreshCatsAndContent()
            addCatFormContainer.classList.add("invisibility")
            addCatForm.reset()
        })
    })
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
                api.deleteCatByID(catID).then(() => {
                    refreshCatsAndContent()
                }).catch(e => console.error(e))
                break;
            case "cat-edit-btn":
                prefillForm(catID)
                .then(() => editformContainer.classList.remove("invisibility"))
                break;
            case "cat-view-btn":
                showCatInfo(catID)
                .then(() => aboutCatModal.classList.remove("invisibility"))
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