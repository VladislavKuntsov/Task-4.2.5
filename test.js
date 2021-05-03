function addNode(tag, className, Node, atributs, data) { //Функция добавление нового узла в html
  let element = document.createElement(tag); 
  element.classList.add(className);
  Node.append(element);

  if(atributs) {
    const [name, value]  = atributs;
    element.setAttribute(name, value);
  }

  if(data) element.innerHTML = data.name[0].toUpperCase() + data.name.slice(1);

  return element;
} 

function removeChildren(element, selector) {  // Функция удаления всех дочерних элементов
  let children = element.querySelectorAll(selector)
  for(let item of children) {
    item.remove();
  }
}

function AddSearchResult(selectorName, Node, propertyValue, propertyName) { // Функция добавление результата запроса
  let element = document.createElement(selectorName);
  element.innerHTML = `${propertyName}: ${propertyValue}`;
  Node.append(element);
}

let container = addNode("div", "container", document.body);
let search = addNode("input", "search", container, ["type", "text"]);
let dropdownMenu = addNode("div", "dropdownMenu", container);
let informationBlock = addNode("div", "information", container);


function createDropdownMenu(data) {  // Создание выпадающего меню
  if(dropdownMenu.childNodes.length) removeChildren(dropdownMenu, "p");

  data.forEach((item)=> addNode("p", "dropdownMenu_name", dropdownMenu, undefined, item)) // создание выпадающего меню при вводе запроса
}

const debounce = (fn) => { // Просто debaunce 
  let timeout;

  return function () { 
    const fnCall = () => fn.apply(this, arguments);  
    clearTimeout(timeout);
      
    timeout = setTimeout(() => fnCall(), 500)
  }
};

search.addEventListener("keyup", debounce(onChange));

let queryResult = new Object; // хранение результата запроса

async function onChange(event) {  // GET запрос
  let value = event.target.value.trim();

  if (!value == '') {
    let data = await fetch(`https://api.github.com/search/repositories?q=${value}in:name&per_page=5&sort=stars`);
    queryResult = await data.json();

    createDropdownMenu(queryResult.items); 
  }
}

dropdownMenu.addEventListener("click", (event) => {  // Ловим клик на элементе выпадающего меню
  let valueClick = event.target.textContent;

  if(event.target.classList.contains("dropdownMenu_name")) {
    search.value = valueClick;
    removeChildren(dropdownMenu, "p");
    search.value = null;
    addRepositories(queryResult.items[0]); 
  }
})

function addRepositories(data) {   // Добавляем информацию по запросу на страницу
  if (informationBlock.childNodes.length == 3)  informationBlock.lastChild.remove(); //удаление переполняющего блока

  let information_request = addNode("div", "information_request", informationBlock);
  informationBlock.prepend(information_request);
  addNode("a", "close", information_request);

  AddSearchResult("p", information_request, data.name, "Name");
  AddSearchResult("p", information_request, data.owner.type, "Owner");
  AddSearchResult("p", information_request, data.stargazers_count, "Stars");
}

informationBlock.addEventListener("click", (event) => {
    if(event.target.classList.contains("close")) event.target.parentNode.remove(); 
})

