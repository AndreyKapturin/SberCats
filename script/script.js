// Котики локально

const jedyCat = {
    id: 1,
    name: "Кот-джедай",
    favorite: true,
    rate: 5,
    age: 10,
    description: "Приверженец светлой стороны",
    image: "https://st.europaplus.ru/mf/p/236802/news/373/037400/content/4958e76b84a6ff53fbff9da9b922e260.jpg"
}

const kusCat = {
    id: 2,
    name: "Кусь",
    favorite: false,
    rate: 3,
    age: 6,
    description: "Кот, который делает кусь",
    image: "https://images.squarespace-cdn.com/content/v1/55ba71f7e4b00dce923b869f/1537373326578-TDLG0GNBULQ1K9H9JKKE/jcsvourw.jpeg?format=1000w"
}

const grumpyCat = {
    id: 3,
    name: "Соус Тардар",
    favorite: false,
    rate: 5,
    age: 7,
    description: "Сердитый кот",
    image: "https://n1s1.elle.ru/48/7b/36/487b36300c62c5f0cb905da52aa874b4/728x486_1_30b570c2f6c0da65bb56095068e05768@940x627_0xc0a839a4_18087198581488362059.jpeg"
}

//  Задание


const config = {
    baseUrl: "https://cats.petiteweb.dev/api/single/andreykapturin/"
}

class Api {
    constructor(config) {
        this.baseUrl = config.baseUrl;
    }

    getAllCats = () => {
        return fetch(`${this.baseUrl}show`)
            .then(res => res.ok ? res.json() : Promise.reject(res.status))
    }
    getCatByID = (id) => {
        return fetch(`${this.baseUrl}show/${id}`)
            .then(res => res.ok ? res.json() : Promise.reject(res.status))
    }
    getCatsIDs = () => {
        return fetch(`${this.baseUrl}ids`)
            .then(res => res.ok ? res.json() : Promise.reject(res.status))
    }
    addCat = (cat) => {
        return fetch(`${this.baseUrl}add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cat),
        }).then(res => res.ok ? res.json() : Promise.reject(res.status));
    }
    editCatByID = (id, newCat) => {
        return fetch(`${this.baseUrl}update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newCat),
        }).then(res => res.ok ? res.json() : Promise.reject(res.status));
    }
    deleteCatByID = (id) => {
        return fetch(`${this.baseUrl}delete/${id}`, {method: "DELETE",})
            .then(res => res.ok ? res.json() : Promise.reject(res.status));
    }
}


// Вызов и проверка работоспособности запросов


// const api = new Api (config)
// api
//     .getAllCats()
//     .then(res => console.log("Все все котики:",res))
//     .catch(e => console.error("Ошибка:", e));
    
// api
//     .getCatByID(1)
//     .then(res => console.log("Котик по ID:", res))
//     .catch(e => console.error("Ошибка:", e));

// api
//     .getCatsIDs()
//     .then(res => console.log("ID всех котиков:", res))
//     .catch(e => console.error("Ошибка:", e));

// api
//     .addCat(jedyCat)
//     .then(res => console.log(res.message))
//     .catch(e => console.error("Ошибка:", e));

// api
//     .editCatByID(1, {rate: 5})
//     .then(res => console.log(res.message))
//     .catch(e => console.error("Ошибка:", e));

// api
//     .deleteCatByID(1)
//     .then(res => console.log(res.message))
//     .catch(e => console.error("Ошибка:", e));