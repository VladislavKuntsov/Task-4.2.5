const divContainer = document.createElement("div"); //создание контейнера
divContainer.classList.add("container")
document.body.append(divContainer);

const inputSearch = document.createElement("input");  // создание поля ввода запроса
inputSearch.classList.add("search");
inputSearch.setAttribute("type", "text");
inputSearch.setAttribute("placeholder", "Введите репозиторий");
divContainer.append(inputSearch);

const dropdownMenu = document.createElement("div");  // Создание выпадающего меню репозиторией
dropdownMenu.classList.add("dropdownMenu");
divContainer.append(dropdownMenu);

const informSearch = document.createElement("div"); // Создание результатов запроса
informSearch.classList.add("information");
divContainer.append(informSearch);

let queryResult = new Object; // переменная, хранящая все репозитории запроса

const debounce = (fn) => {
  let timeout;

  return function () {
      const fnCall = () => fn.apply(this, arguments);  //вызываем функцию и передаем аргументы
      clearTimeout(timeout);
      
      timeout = setTimeout(() => fnCall(), 500)
  }
};

onChange = debounce(onChange)

inputSearch.addEventListener("keyup", onChange);

async function onChange(event) {  // GET запрос на Githab.
  value = event.target.value.trim();

  if (!value == "") {
    let url = `https://api.github.com/search/repositories?q=${value}in:name&per_page=5&sort=stars`;
    let data = await fetch(url)
    queryResult = await data.json();

    createDropdownMenu(queryResult.items); 
  }
  

}

function createDropdownMenu(data) {  // Создание выпадающего меню
  if(dropdownMenu.querySelector("p")) {
    let p = dropdownMenu.querySelectorAll("p");
    for(let item of p) {
      item.remove()
    }
  }

  data.forEach((item)=> {
    const p = document.createElement("p");
    p.classList.add("dropdownMenu_name");
    p.innerHTML = item.name[0].toUpperCase() + item.name.slice(1);
    dropdownMenu.append(p);
  })
  dropdownMenu.style.display = "block";
}

function HidingDropdownMenu () {   //Скрытие выпадающего меню
  let p = dropdownMenu.querySelectorAll("p");
    for(let item of p) {
      item.remove();
    }
}

dropdownMenu.addEventListener("click", (event) => {  // Ловим клик на элементе выпадающего меню
  valueClick = event.target.textContent;

  if(event.target.classList.contains("dropdownMenu_name")) {

  inputSearch.value = valueClick;

  HidingDropdownMenu ();

  addRepositories(queryResult.items[0]);  // создание информационного блока

  inputSearch.value = null;
  }
})

function addRepositories(data) {   // Добавляем информацию по запросу на страницу
  if (informSearch.childNodes.length == 3) {
    informSearch.lastChild.remove();
  }

  // создание информации по запросу

    let divInformation = document.createElement("div");
    divInformation.classList.add("information_request");

    let btnClose = document.createElement("a");
    btnClose.classList.add("close");
    divInformation.append(btnClose);

    let p1 = document.createElement("p");
    p1.innerHTML = `Name: ${data.name}`;
    divInformation.append(p1);

    let p2 = document.createElement("p");
    p2.innerHTML = `Owner: ${data.owner.type}`;
    divInformation.append(p2); 
   
    let p3 = document.createElement("p");
    p3.innerHTML = `Stars: ${data.stargazers_count}`;
    divInformation.append(p3);
  
    informSearch.prepend(divInformation)

}
 
informSearch.addEventListener("click", (event) => {
    if(event.target.classList.contains("close")) {
      event.target.parentNode.remove();
    }
})