
let data;
const url = 'https://api.pexels.com/v1/search?query=';
let imagesUrl;

const svg = '<svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"> <title>Placeholder</title> <rect width="100%" height="100%" fill="#55595c" /><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>';

//funzione che recupera le foto dall'API
async function getData(url, param) {
    let arr = param.toLowerCase().split(' ');
    param = arr.join('%20');
    const link = url + param;
    await fetch(link, {
        headers: { 'Authorization': 'bQCIoZdWTG1l6oHF1gX5RcnCaQxV7AU7EUU2z3qIe0Hqwc5jFKlWIxx9' }
    }).then(response => response.json()).then((result) => {
        data = result.photos;
        if (data.length > 0) {
            imagesUrl = [];
            imagesUrl = data.map((item) => {
                return item.url;
            });
            imagesUrl.forEach((item) => console.log(item));
        }
    }).catch((err) => { alert("Si è verificato il seguente errore: " + err); });
}

//riporta le card alla situazione iniziale
function resetCards() {
    let cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
        let img = card.getElementsByTagName('img')[0];
        if (img != null) {
            img.remove();
            let inner = svg + card.innerHTML;
            card.innerHTML = inner;
        }
    });
    addListener();
}

//visualizza le card
function displyCards() {
    resetCards();
    if (data.length > 0) {
        let cards = document.querySelectorAll('.card');
        data.forEach((element, index) => {
            if (cards[index] !== undefined) {
                createImage(cards[index], index);
            }
        });
    }
}

//visualizza immagini di spiagge
async function displayBeachImages() {
    await getData(url, 'beach');
    displyCards();
}

//visualizza paesaggi naturali
async function displayNatureImages() {
    await getData(url, 'nature');
    displyCards();
}

//crea l'immagine da inserire nelle card
function createImage(card, index) {
    if (card.getElementsByTagName('svg').length > 0) {
        card.getElementsByTagName('svg')[0].remove();
    } else {
        card.getElementsByTagName('img')[0].remove();
    }
    let img = document.createElement('img');
    img.classList.add('bd-placeholder-img', 'card-img-top');
    img.setAttribute('width', '100%');
    img.setAttribute('height', '225');
    img.setAttribute('src', data[index].src.tiny);
    card.prepend(img);
    card.getElementsByTagName('small')[0].innerText = data[index].id;
}

//nasconde una card
function hideImage(event) {
    let card = event.target.parentElement.parentElement.parentElement.parentElement;
    card.classList.add('opacity-0');
}

//ricerca immagini utilizzando una chiave inserita dall'utente
async function searchImagesByCat() {
    let input = document.getElementsByTagName('input')[0];
    if (input.value !== '') {
        let value = input.value.toLowerCase();
        await getData(url, value);
        displyCards();
        input.value = '';
    }
}

//ricerca immagini utilizzando una chiave inserita dall'utente
function searchImagesByAuth() {
    let input = document.getElementsByTagName('input')[2];
    if (input.value !== '') {
        let value = input.value.toLowerCase();
        data = data.filter((item) => item.photographer.toLowerCase() === value);
        displyCards();
        input.value = '';
    }
}

//funzione che crea un carosello alla fine della pagina
//il carosello mostra immagini di macchine
async function createCarousel() {
    await getData(url, 'car');
    let carouselInner = document.querySelector('.carousel-inner');
    data.forEach((item, i) => {
        let carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (i === 0) {
            carouselItem.classList.add('active');
        }
        let img = document.createElement('img');
        img.classList.add('d-block', 'w-100');
        img.setAttribute('src', data[i].src.tiny);
        carouselItem.prepend(img);
        carouselInner.append(carouselItem);
    });
}

//mostra un'immagine nel modal
function showModalImage(event) {
    let modalBody = document.querySelector('.modal-body');
    if (modalBody.children.length > 0) {
        for (let child of modalBody.children) {
            child.remove();
        }
    }
    let card = event.target.parentElement.parentElement.parentElement.parentElement;
    let element = card.firstElementChild;
    if (element.tagName === 'IMG') {
        let newElement = element.cloneNode(true);
        modalBody.append(newElement);
    } else {
        let p = document.createElement('p');
        p.innerText = "No image to show";
        modalBody.append(p);
    }
}

//registra tutti i listener
function addListener() {
    let firstButton = document.getElementById('firstButton');
    let secondButton = document.getElementById('secondButton');
    firstButton.addEventListener('click', displayBeachImages);
    secondButton.addEventListener('click', displayNatureImages);
    let hideButtons = document.querySelectorAll('button');
    hideButtons.forEach(element => {
        if (element.innerText === 'Hide') {
            element.addEventListener('click', hideImage);
        }
        if (element.innerText === 'View') {
            element.setAttribute('data-bs-toggle', 'modal');
            element.setAttribute('data-bs-target', '.modal-image');
            element.addEventListener('click', showModalImage);
        }
    });
    let searchButton1 = document.getElementsByTagName('input')[1];
    searchButton1.addEventListener('click', searchImagesByCat);
    let searchButton2 = document.getElementsByTagName('input')[3];
    searchButton2.addEventListener('click', searchImagesByAuth);
}

//al caricamento della pagina...
window.addEventListener('load', async () => {
    addListener();
    await createCarousel();
});
