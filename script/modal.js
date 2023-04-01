// constants

const content = document.querySelector("#content")
const editformContainer = document.querySelector("#editFormContainer")
const editCatForm = document.querySelector("#editCatForm")
const formCloser = document.querySelector("#formCloser")
const aboutCatModal = document.querySelector(".aboutCatModal")
const aboutCatCloser = document.querySelector("#aboutCatCloser")
const addCatButton = document.querySelector("#addCatButton")
const addCatFormContainer = document.querySelector("#addCatFormContainer")
const addCatForm = document.querySelector("#addCatForm")
const addFormCloser = document.querySelector("#addFormCloser")

let catID

// functions

// Создание карточки с котом
function createCatCard(cat) {
    return `<div class = "catCard">
        <img class = "catImage" src = ${cat.image === null ? defaultCatImage : cat.image}>
        ${cat.name}
        <div class = "rate">${cat.rate}</i></div>
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
        return content.innerHTML = res.reduce((str, el) => {
            return str += createCatCard(el)
        }, "")
    })
}

// Предзаполнение формы данными о коте

function prefillForm(catID) {
    return api.getCatByID(catID).then(res => {
        editCatForm.name.value = res.name;
        editCatForm.image.value = res.image;
        editCatForm.age.value = res.age;
        editCatForm.rate.value = res.rate;
        editCatForm.favorite.value = res.favorite;
        editCatForm.description.value = res.description;
    })
}

// Отображение информации о коте

function showCatInfo(catID) {
    return api.getCatByID(catID)
    .then(cat => {
        document.querySelector(".catInfoName").textContent = cat.name
        document.querySelector(".catInfoAge").textContent = cat.age
        document.querySelector(".catInfoRate").textContent = cat.rate
        document.querySelector(".catInfoDescription").textContent = cat.description
        document.querySelector(".catImageBig").src = cat.image
    })
    
}

// Получение нового ID

function getNewCatID() {
    return api.getCatsIDs()
    .then(res => Math.max(...res) + 1)
}

refreshCatsAndContent()

// listeners

formCloser.addEventListener("click", () => {
    editformContainer.classList.toggle("invisibility");
})

editCatForm.addEventListener("submit", (event) => {
    event.preventDefault()
    let formData = new FormData(event.target)
    let newCat = { ...Object.fromEntries(formData), id: catID }
    api.editCatByID(catID, newCat)
        .then(() => {
            refreshCatsAndContent()
            editformContainer.classList.add("invisibility");
        })
})

aboutCatCloser.addEventListener("click", () =>{
    aboutCatModal.classList.add("invisibility")
})

addCatButton.addEventListener("click", () => {
    addCatFormContainer.classList.remove("invisibility");
})

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

addFormCloser.addEventListener("click", () =>{
    addCatFormContainer.classList.add("invisibility");
})


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
        }
    }
})

