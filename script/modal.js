// constants

const content = document.querySelector("#content")
const formContainer = document.querySelector("#formContainer")
const addEditCatForm = document.querySelector("#addEditCatForm")
const formCloser = document.querySelector("#formCloser")
const formBtn = document.querySelector("#formBtn")

// functions
// Создание карточки с котом
function createCatCard (cat) {
    return `<div class = "catCard">
        <img class = "catImage" src = "${cat.image}">
        ${cat.name}
        <div class = "rate"><i class="fa-solid fa-star"></i></div>
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

function prefillForm(id) {
    return api.getCatByID(id).then(res => {
        addEditCatForm.name.value = res.name;
        addEditCatForm.image.value = res.image;
        addEditCatForm.age.value = res.age;
        addEditCatForm.rate.value = res.rate;
        addEditCatForm.favorite.value = res.favorite;
        addEditCatForm.description.value = res.description;
    })
}

refreshCatsAndContent()

// listeners

formCloser.addEventListener("click", () => formContainer.classList.toggle("active"))

content.addEventListener("click", (event) => {
    if (event.target.localName === "button") {
        switch(event.target.className) {
            case "cat-delete-btn":
                api.deleteCatByID(event.target.value).then(res => {
                    refreshCatsAndContent()
                }).catch(e => console.error(e))
            break;
            case "cat-edit-btn":
                prefillForm(event.target.value).then(res => {
                    formContainer.classList.toggle("active")
                })
        } 
    }
})
