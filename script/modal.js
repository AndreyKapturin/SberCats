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

// Внесение изменений о коте

function editCat(event, catID) {
    event.preventDefault()
    let form = new FormData(addEditCatForm)
    let newCat = Object.fromEntries(form)
    api.editCatByID(catID, newCat)
        .then(() => {
        refreshCatsAndContent();
        document.forms[0].reset()
        formContainer.classList.add("invisibility");
    });
}

refreshCatsAndContent()

// listeners

formCloser.addEventListener("click", () => {
    formContainer.classList.toggle("invisibility");
    addEditCatForm.removeEventListener("submit", editCat(event))
})


content.addEventListener("click", (event) => {
    if (event.target.localName === "button") {
        let catID = event.target.value;
        console.log(catID);
        switch(event.target.className) {
            case "cat-delete-btn":
                api.deleteCatByID(catID).then(res => {
                    refreshCatsAndContent()
                }).catch(e => console.error(e))
            break;
            case "cat-edit-btn":
                prefillForm(catID).then(() => {
                    formContainer.classList.remove("invisibility")
                    addEditCatForm.addEventListener("submit", editCat(event, catID), {once: true})
                })
        } 
    }
})
