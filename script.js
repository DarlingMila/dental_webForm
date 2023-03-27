const body = document.querySelector(".body");
const serviceMain = document.querySelector(".serviceScreen__main");

const screens = document.querySelectorAll("[data-listname]");
const submitScreen = document.querySelector(".submitScreen");

const btnConfirm = document.querySelector(".btn_confirm");
const btnSubmit = document.querySelector(".btn_submit");
const btnReturn = document.querySelector(".btn_return");

const navigation = document.querySelector(".navigation__list");
const navigationItems = document.querySelectorAll(".navigation__item");


const bigArray = [
  "Препарування. Розкриття порожнини зуба.",
  "Кофердам",
  "Інструментальна та медична обробка системи кореневих каналів.",
  "Лікарський засіб. Встановлення тимчасової пломби.",
];

const smallArray = [
  ["девіталізуюча паста", "препарат на основі кальцію"],
  [],
  [],
  ["Деннин-паста", "Темполат", "Цеміон"],
];

/**
 * Массив с наполнением выпадающих списков
 * Первый пустой 
*/ 
const optionsArray = [
  "",
  "Лікування кореневих каналів в 2 етапи; 1й етап",
  "Второй вариант",
  "Третий вариант",
];

/**
 * Функция создает и возвращает новый элемент
 * @param {string} element имя тэга
 * @param {array} inputSpecials массив с атрибутами для инпутов: тип, общее имя, выбран ли
 * @param {string} text текст
 * @param {array} classArray массив с классами для элемента
 * @param {number} blockNumber номер блока
 * @returns созданный элемент
*/
function createNewItem(element, inputSpecials, text, classArray, blockNumber) {
  const item = document.createElement(element);

  /**
   * Проверка для добавлени текста в элемент
  */
  if (text !== null && element !== "input") item.textContent = text;

  /**
   * Проверка для изменения текста к input и label. Добавляет в конец номер блока - пример: _B1 
  */
  if (element === "input" || element === "label") text = `${text}_B${blockNumber}`;
  
  /**
   * Проверка для изменения общего имени у input и select. Добавляет в конец номер блока - пример: _B1 
  */
  let name = ""; // переменная необходимая для input и select
  if (element === "input" || element === "select" ) name = `${inputSpecials[1]}_B${blockNumber}`;


  /**
   * В зависимости от элемента информация добавляется в разные артибуты
  */
  switch (element) {
    case "input":
      item.type = inputSpecials[0];
      item.name = name;

      item.id = text;
      item.value = text;
      break;

    case "select":
      item.name = name;
      break;

    case "option":
      item.value = text;
      break;

    case "label":
      item.htmlFor = text;
      break;
  }

  /**
   * Проверка, переданы ли классы
   *    если да -> они назначаются элементу
  */
  if (classArray.length > 0) {
    classArray.forEach((cl) => {
      item.classList.add(cl);
    });
  }

  if (item.classList.contains("customInput")) {
    item.value = "";
    item.placeholder = "другое";
    item.autocomplete = "off";
  };

  return item;
}

/**
 * Функция создает новый блок с выпадающим списком для выбора услуги
 * @param {number} blockNumber номер блока
*/
function addSelectionToBlock (blockNumber) {

  const blockClass = `block_${blockNumber}`
  const block = createNewItem("div", null, null, ["block", blockClass]);
  serviceMain.appendChild(block);

  const select = createNewItem("select", [null, "service", false], null, ["serviceSelection"], blockNumber);
  select.addEventListener("change", (e) => checkValue(e));
  block.appendChild(select);

  const div = createNewItem("div", [], null, ["optionsList"]);
  block.appendChild(div);

  /**
   * Цикл проходит по каждому названию в массиве optionsArray и наполняет выпадающий список
   * Первый пустой - выполняет роль заглушки, ему присваевается текст "Услуга:"
  */
  optionsArray.forEach((optionText, i) => {
    const option = createNewItem("option", null, optionText, ["option"]);
    if (i === 0) option.textContent = "Услуга:";
    select.appendChild(option);
  })

}


/**
 * Функция в зависимости от выбора в выпадающих списках добавляет новый или убирвет последний
 * @param {object} e объект события
*/
function checkValue(e) {
  const child = e.target.parentElement;

  const parent = e.target.parentElement;
  const parentNumber = Number(parent.className.split("_")[1]);

  const option = child.querySelector("option:checked");
  const value = option.value;

  const numberOfChildren = serviceMain.childElementCount;

  /**
   * Добавляется новый выпадающий список, если в последнем существуещем списке выбран НЕ первый (с пустым value) элемент
  */
  if (Boolean(value) && parentNumber == numberOfChildren) addSelectionToBlock(parentNumber + 1);

  /**
   * Убирается последний спико, если в предпоследнем выбрали первый (с пустым value) элемент
  */
  if (!Boolean(value) && parentNumber == numberOfChildren - 1) serviceMain.lastElementChild.remove();

  showOptions(value, parentNumber);
}


/**
 * Функция наполняет блок необходимыми элементами
 * @param {string} serviceTitle название этапа
 * @param {array} steps массив со строками, перечисление подэтапов
 * @param {array} meds массив со строками, перечисление препаратов
 * @param {number} blockNumber номер блока
 */
function addToOptions(serviceTitle, steps, meds, blockNumber) {

  const block = serviceMain.querySelector(`.block_${blockNumber}`);
  const optionsList = block.querySelector(".optionsList");
  
  /**
   * Цикл проходит по каждому подэтапу и добавляет элементы в блок
  */
  steps.forEach((title, i) => {
    const bigItem = createNewItem("div", null, null, ["bigItem"]);
    optionsList.appendChild(bigItem);

    // внутрь bigItem
    const input = createNewItem(
      "input",
      ["checkbox", serviceTitle, null],
      title,
      ["checkbox"],
      blockNumber
    );
    if (i === 0) input.checked = true;
    bigItem.appendChild(input);

    const label = createNewItem("label", null, title, ["label"], blockNumber);
    bigItem.appendChild(label);

    /**
     * Проверка, ести ли к данному подэтапу медикаменты
     *    если да -> создается список, ниже цикл добавляет элементы в него
    */
    if (meds[i].length > 0) {
      const ul = createNewItem("ul", null, null, ["additionList"]);
      bigItem.appendChild(ul);

      meds[i].forEach((item, j) => {
        // внутрь ul
        const li = createNewItem("li", null, null, []);
        ul.appendChild(li);

        // внутрь li
        const input = createNewItem(
          "input",
          ["radio", title, null],
          item,
          [],
          blockNumber
        );
        if (j === 0) input.checked = true;
        li.appendChild(input);

        const label = createNewItem(
          "label",
          null,
          item,
          ["label"],
          blockNumber
        );
        li.appendChild(label);
      });

      // Добавление элемента для ручного ввода медикамента
      const li = createNewItem("li", null, null, []);
      ul.appendChild(li);

      const input = createNewItem(
        "input",
        ["radio", title, null],
        "customRadio",
        [],
        blockNumber
      );
      li.appendChild(input);

      const customInput = createNewItem(
        "input",
        ["text", title, null],
        "customInput",
        ["customInput"],
        blockNumber
      );
      li.appendChild(customInput);
      customInput.addEventListener("click", (e) => setChecked(e));
    }
  });
}

/**
 * Функция проставляет checked рядом с полем, куда можно вписать медикамент самостоятельно
 * @param {object} e объект события
 */
function setChecked(e) {
  const element = e.target;
  const radioBtn = element.previousElementSibling;
  radioBtn["checked"] = true;
  element.addEventListener("input", (e) => (radioBtn.value = e.target.value));
}


/**
 * Функция отправляет название и загружает необходимые данные на страницу
 * @param {string} title название услуги
 * @param {number} blockNumber номер блока
*/
function showOptions(title, blockNumber) {

  body.classList.add("loading");
  btnConfirm.classList.add("hide");

  const block = serviceMain.querySelector(`.block_${blockNumber}`);
  const optionsList = block.querySelector(".optionsList");
 
  /**
   * Цикл для очисти содержимого списка. Необходим при смене услуги
  */
  while (optionsList.firstElementChild) {
    optionsList.firstElementChild.remove();
  }


  try {
    if (title === "Лікування кореневих каналів в 2 етапи; 1й етап") {
      addToOptions(title, bigArray, smallArray, blockNumber);
    }

  } catch (err) {
    console.log("что-то не так");
    console.log(err);

  } finally {
    btnConfirm.classList.remove("hide");
    body.classList.remove("loading");
  }
}

/**
 * Функция собирает и возвращает массив с объектами, где каждый объект это выбранные позиции по услуге
 * @returns массив с объектами
 */
function getSelectedPositions() {

  let obj = {};

  const blocks = serviceMain.querySelectorAll(".block");
  
  /**
   * Цикл проходит по каждому блоку и собирает по нему объект из выбранных позиций
   */
  blocks.forEach((block, blockNumber) => {
  
    const serviceSelection = block.querySelector(".serviceSelection");
    const service = serviceSelection.value;

    if (service == "") return; // если не будет выбрана услуга, то она не запишется в массив
    obj[blockNumber] = {};
    obj[blockNumber]["service"] = service;

    const optionsList = block.querySelector(".optionsList");
    const steps = optionsList.querySelectorAll("input[type=checkbox]:checked");

    /**
     * Цикл проходит по каждому из подэтапов и добавляет в объект, если есть медикаменты, их также добавляет в объект
     */
    steps.forEach((step, i) => {
      const name = `step_${i}`;
      obj[blockNumber][name] = {};
      obj[blockNumber][name]["stepTitle"] = step.value.split("_")[0];

      const bigItem = step.parentElement;
      const meds = bigItem.querySelector("input[type=radio]:checked");

      if (meds) {
        const medsValue = meds.value.split("_B")[0];
        if (medsValue !== "customRadio") obj[blockNumber][name]["stepMeds"] = medsValue;
      } 
    });

  })

  return obj;
}

/**
 * Функция добавляет в блок информацию о выбранных позициях
 */
function showSelectedPositions() {
  let allServicesArray = [];

  const data = getSelectedPositions();
  // Монстр в data:
  // data: {
  //   0: {
  //     'service': 'Название услуги',
  //     'step_0': {
  //       'stepTitle': 'Название этапа',
  //       'stepMeds': 'Медикаменты для этапа',
  //     },
  //       'step_1': {
  //       'stepTitle': 'Название этапа',
  //     }
  //   },
  //   1: {}
  // }

  submitScreen.classList.remove("hide");


  const modalBody = submitScreen.querySelector(".submitScreen__main");

  /**
   * Цикл очистки тела блока
   */
  while (modalBody.firstElementChild) {
    modalBody.firstElementChild.remove();
  }

  const serviceMainHeader = createNewItem(
    "h3",
    null,
    "Выбранные позиции:",
    ["submitScreen__header"]
  );
  modalBody.appendChild(serviceMainHeader);

  /**
   * Цикл проходит по объекту data, по цифровым ключам
   */
  for (let dataIndex in data) {
    const ul = createNewItem("ul", null, null, ["submitScreen__list"]);
    let count = 1; // для нумерации спика подэтапов

    /**
     * Цикл проходит по объекту data внутри каждого цифрового ключа, где лежат 'service' и все 'step_ '
     */
    for (let step in data[dataIndex]) {

      /**
       * Проверка, если ключ 'service'
       *    если да -> добавляется название услуги
       */
      if (step == "service") {
        const header = createNewItem("h3", null, data[dataIndex]["service"], [
          "submitScreen__header",
          "submitScreen__header_service",
        ]);

        modalBody.appendChild(header);

        allServicesArray.push(data[dataIndex]["service"]);

        /**
         * Проверка, ести ли в объекте еще ключи, т.е. есть ли там 'step_ '
         *    если да -> добавляется созданные выше список ul
         *    (создается он выше, чтобы к нему был доступ из блока else)
         *    (добавляется здесь, чтобы быть после заголовка и чтобы не задваивался)
         */
        if (Object.keys(data[dataIndex]).length > 1) modalBody.appendChild(ul);

      } else {
        const li = createNewItem("li", [], [], ["submitScreen__item"]);
        ul.appendChild(li);

        const h4 = createNewItem(
          "h4",
          [],
          `${count}. ${data[dataIndex][step]["stepTitle"]}`,
          ["submitScreen__title"]
        );
        li.appendChild(h4);

        /**
         * Проверка, ести в данном этапе медикаменты
         *    если да -> они добавляются ниже
         */
        if (data[dataIndex][step]["stepMeds"]) {
          const span = createNewItem(
            "span",
            [],
            data[dataIndex][step]["stepMeds"],
            ["submitScreen__span"]
          );
          li.appendChild(span);
        }

        count++;
      }
    }
  }

  const textForWarning = getTextWarning(allServicesArray);

  /**
   * Проверка, что сообщение не пустое
   *   если да -> создается блок предупреждения, и цикл наполняет предложениями
   */
  if (textForWarning !== "") {

    const message = textForWarning.split("NEWLINE");

    const warning = createNewItem(
      "div",
      null,
      null,
      ["submitScreen__warningMessage"]
    );
    modalBody.appendChild(warning);

    message.forEach((item) => {
      const span = createNewItem(
      "span",
      null,
      null,
      ["submitScreen__warningLine"]
      );
      span.innerHTML = item;
      warning.appendChild(span);
    })
  }
}

/**
 * Функция подсчитывает количество повторяемых услуг и возвращает сообщение
 * @param {array} allServicesArray массив из строк с названием всех выбранных услуг
 * @returns {string} строку сообщения или пустую строку, если не было повторений
 */
function getTextWarning(allServicesArray) {
  let array = [];
  let message = "";

  const unique = new Set(allServicesArray); // создает новый сет с уникальными названиями

  /**
   * Цикл проходит по каждому уникальному названию
   */
  unique.forEach((title) => {
    const amount = allServicesArray.filter((item) => item === title).length;

    /**
     * Проверка: если количетсво повторений больше 1
     *    если да -> название и количество добавляются в массив
     */
    if (amount > 1) array.push([title, amount]);
  });

  const length = array.length;

  /**
   * Проверка, что в массиве есть значение
   *    если да -> цикл внутри добавляет данные в сообщение
   */
  if (length > 0) {
    message = "Внимание!";

    // NEWLINE - слово для разбивки потом на строки
    for (let i = 0; i < length; i++) {
      message += `NEWLINE— <span class="spanBold">"${array[i][0]}"</span> повторяется <span class="spanBold">${array[i][1]}</span> раз(а);`;
    }
  }

  return message;
}

/**
 * Функция возврата на блок с выбором -> просто прячет блок вывода информации
 */
function returnToSelection() {
  submitScreen.classList.add("hide");
}

/**
 * Функция отправки результатов. Скрывает блок с выводом информации и чистит блок с выбором
 */
function submitResult() {
  submitScreen.classList.add("hide");

  /**
   * Цикл очистки от выпадающих списков
   */
  while (serviceMain.firstElementChild) {
    serviceMain.firstElementChild.remove();
  }

  addSelectionToBlock(1);
  btnConfirm.classList.add("hide");

  alert("Данные были отправлены");
}


/**
 * Функция открывает выбранный лист и скрывает предыдущий
 * @param {object} e объек события
 */
function changeList(e) {

  const selectedItem = e.target;

  const tag = selectedItem.tagName;
  let listName = "";

  /**
   * Проверка, выбран ли был элемент из списка с тегом li
   *    если да -> лист переключится
   */
  if (tag === "LI") {
    /**
     * Проверка, открыт ли блок с подтверждением данных до отправки
     *    если да -> не произойдет переключение листа и появится alert
     */
    if (!submitScreen.classList.contains("hide"))
      return alert("Подтвердите отправку данных или вернитесь назад.");

    listName = selectedItem.dataset.value;

    /**
     * Цикл проходит по всем наименованиям в навигации, проверка находит элемент, который созержит navigation__item_active на данный момент и убирает его. Ниже класс navigation__item_active добавляется к выбранному элементу
     */
    navigationItems.forEach((item) => {
      if (item.classList.contains("navigation__item_active"))
        item.classList.remove("navigation__item_active");
    })

    selectedItem.classList.add("navigation__item_active");

    /**
     * Цикл проходит по каждому блоку. Проверка находит лист, который соответствует выбранному наименованию и убирает класс hide, к другим добавляет.
     */
    screens.forEach((screen) => {
      if (screen.dataset.listname === listName) {
        screen.classList.remove("hide");
      } else {
        screen.classList.add("hide");
      }
    })
  }
}


btnConfirm.addEventListener("click", showSelectedPositions);
btnReturn.addEventListener("click", returnToSelection);
btnSubmit.addEventListener("click", submitResult);

navigation.addEventListener("click", (e) => changeList(e));

/**
 * Вызов функции для отображения первого выпадающего списка
 */
addSelectionToBlock(1);


