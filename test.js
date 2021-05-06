let search = document.querySelector(".search");
let dropdownMenu = document.querySelector(".dropdownMenu");
let informationBlock = document.querySelector(".information");
let queryResult = new Object; // тут хранится результат запроса

function addNode(tag, className, node, data) { //Функция добавление нового узла в html
  let element = document.createElement(tag); 
  element.classList.add(className);
  node.append(element);

  if(data) Array.isArray(data) ? element.innerHTML = `${data[0]}: ${data[1]}` : element.innerHTML = data.name[0].toUpperCase() + data.name.slice(1);

  return element;
} 

function removeChildElements(element, selector) {  // Функция удаления всех дочерних элементов
  let children = element.querySelectorAll(selector)
  for(let item of children) {
    item.remove();
  }
}

function createDropdownMenu(data) {  // Создание выпадающего меню и добавление слушателя событий
  if(dropdownMenu.childNodes.length) removeChildElements(dropdownMenu, "p");

  data.forEach((item)=> {
   let p = addNode("p", "dropdownMenu_name", dropdownMenu, item);
    p.addEventListener("click" , (event) => {
      search.value = event.target.textContent;
      removeChildElements(dropdownMenu, "p");
      search.value = null;
      addRepositories(item);
    })
  })
}

const debounce = (fn) => { // Просто debaunce 
  let timeout;

  return function () { 
    const fnCall = () => fn.apply(this, arguments);  
    clearTimeout(timeout);
      
    timeout = setTimeout(() => fnCall(), 500)
  }
};

search.addEventListener("input", debounce(onChange));

async function onChange(event) {  // GET запрос
  let value = event.target.value.trim();
 
  if(value == "") removeChildElements(dropdownMenu, "p");

  if (!value == '') {
    let data = await fetch(`https://api.github.com/search/repositories?q=${value}in:name&per_page=5&sort=stars`);
    queryResult = await data.json();

    createDropdownMenu(queryResult.items); 
  }
}

function addRepositories(data) {   // Добавляем информацию по запросу на страницу
  if (informationBlock.childNodes.length == 3)  informationBlock.lastChild.remove(); //удаление переполняющего блока

  let information_request = addNode("div", "information_request", informationBlock);
  informationBlock.prepend(information_request);

  let close = addNode("a", "close", information_request, false);

  close.addEventListener("click", (event) => {
     event.target.parentNode.remove(); 
  })

  addNode("p", "name", information_request, ["Name", data.name]);
  addNode("p", "owner", information_request, ["Owner", data.owner.type]);
  addNode("p", "stars", information_request, ["Stars", data.stargazers_count]);
}

