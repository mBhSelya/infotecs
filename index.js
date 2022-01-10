import { arr } from './constant.js';

const containerTable = document.querySelector('.table__body');
const buttonsHide = document.querySelectorAll('.table__button-hide');
const containerPages = document.querySelector('.pages');
const buttonsSort = document.querySelectorAll('.table__button-sort');
const popup = document.querySelector('.popup');
const inputFirstName = document.getElementById('#firstname');
const inputLastName = document.getElementById('#lastname');
const inputAbout = document.getElementById('#about');
const inputEyeColor = document.getElementById('#eye-color');
const popupButton = document.querySelector('.popup__button');
const buttonClose = document.querySelector('.popup__button-close');
let rowEdit;


function createRow(item) { //Функция создания строки, функция принимает элемент массива и индекс массива
    const row = document.createElement('tr');
    row.classList.add('table__row');
    row.innerHTML = `
                    <td class="table__column"><p class="table__text">${item.name.firstName}</p></td>
                    <td class="table__column"><p class="table__text">${item.name.lastName}</p></td>
                    <td class="table__column"><p class="table__text">${item.about}</p></td>
                    <td class="table__column"><p class="table__text" style="background-color: ${item.eyeColor};"></p></td>
                    `;
    return row;
}

function newArrForPage(index) {  // Создаем новые 10 строк
    let newArray = [];
    for (let i = (index * 10); i < (index * 10 + 10); i++) {
        newArray.push(arr[i]);
    } 
    return newArray;
}

function showPage(arr) {      // Функция формирования страницы данных из массива, принимает массив
    const prevPage = Array.from(document.querySelectorAll('.table__row')); 
    prevPage.forEach((item) => { // Определяем и удаляем со страницы старые строки
        item.remove();
    });
    for (let i = 0; i < arr.length; i++) { // Создаем новые 10 строк
        containerTable.append(createRow(arr[i]));
        containerTable.rows[i].addEventListener('click', () => { //Добавляем слушатель событий на каждую создаваемую строку
            popupOpen(i);
        })
    }
    buttonsHide.forEach((item, index) => {
        if (item.classList.contains('table__button-hide_hidden')) {
            textHide(index);
        }
    }) // проверяем была ли скрыта колонка, если да то снова ее скрываем 
}

function popupOpen(index) { // Открываем и добавляем данные строки в окно Редактирования данных
    rowEdit = containerTable.rows[Math.floor(index%10)]
    inputFirstName.value = rowEdit.cells[0].querySelector('.table__text').textContent;
    inputLastName.value = rowEdit.cells[1].querySelector('.table__text').textContent;
    inputAbout.value = rowEdit.cells[2].querySelector('.table__text').textContent;
    inputEyeColor.value = rowEdit.cells[3].querySelector('.table__text').style.backgroundColor;
    popup.classList.remove('popup_hidden');
}

function popupSave() {  // Редактируем данные в таблице и закрываем окно Редактирования
    rowEdit.cells[0].querySelector('.table__text').textContent = inputFirstName.value;
    rowEdit.cells[1].querySelector('.table__text').textContent = inputLastName.value;
    rowEdit.cells[2].querySelector('.table__text').textContent = inputAbout.value;
    rowEdit.cells[3].querySelector('.table__text').style.backgroundColor = inputEyeColor.value;
    popup.classList.add('popup_hidden');
}

popupButton.addEventListener('click', () => { // Добавляем слушатель событий кнопке Сохранить в окне Редактирования
    popupSave()
});

function createPageButton() { // Вычисляем кол-во страниц и создаем кнопки для них
    const countPage = Math.floor(arr.length/10);
    if (countPage > 1) {
        for (let i = 0; i < countPage; i++) {
            const button = document.createElement('button');
            button.classList.add('pages__button');
            button.innerHTML = `${i+1}`
            button.addEventListener('click', () => { // Добавляем слушатель событий на кнопки страниц, и передаем индекс страницы
                showPage(newArrForPage(i));
            })
            containerPages.append(button);
        }
    }
}

function sortedTable(colNum) {  // Функция сортировки данных в колонке, принимает индекс колонки
    const rowsArray = Array.from(containerTable.rows);
    function compare(rowA, rowB) {
        return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1
    }
    rowsArray.sort(compare);
    containerTable.append(...rowsArray)
    Array.from(containerTable.rows).forEach((item, index) => {
        item.addEventListener('click', () => {
            popupOpen(index);
        })
    })
}

function textHide(index) { // Функция скрытия колонки, принимает индекс колонки
    for (let i = 0; i < containerTable.rows.length; i++) {
        containerTable.rows[i].cells[index].querySelector('.table__text').classList.toggle('table__text_hidden');
    };
}

buttonsHide.forEach((item, index) => { // Добавляем слушатель событий на кнопки скрытия колонок
    item.addEventListener('click', () => {
        item.classList.toggle('table__button-hide_hidden');
        textHide(index);
    })
})

createPageButton(); // Создаем кнопки перехода по страницам
showPage(newArrForPage(1)); // Отображаем первую страницу

buttonsSort.forEach((item, index) => {  // Добавляем слушатель событий на кнопки сортировки
    item.addEventListener('click', () => {
        sortedTable(index);
    })
})

buttonClose.addEventListener('click', () => { // Добавляем слушатель закрытия окна редактирования
    popup.classList.add('popup_hidden');
})