// ? JSON SERVER
const CONTACTS_API = "http://localhost:8000/contacts";
// ? buttons
let addContactBtn = document.querySelector("#addContact-btn");
//? inputs
let nameInp = document.querySelector("#nameInp");
let secondNameInp = document.querySelector("#secondNameInp");
let numberInp = document.querySelector("#numberInp");

//! add contact btn start ---------------------------------------------------------------
async function addContact() {
  if (
    !nameInp.value.trim() ||
    !secondNameInp.value.trim() ||
    !numberInp.value.trim()
  ) {
    alert("Some inputs are empty!");
    return;
  }
  let contactObj = {
    name: nameInp.value,
    secondName: secondNameInp.value,
    number: numberInp.value,
  };

  fetch(CONTACTS_API, {
    method: "POST",
    body: JSON.stringify(contactObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  alert("Контакт успешно добавлен!");

  nameInp.value = "";
  secondNameInp.value = "";
  numberInp.value = "";

  render();
}
addContactBtn.addEventListener("click", addContact);
//! add contact btn end -----------------------------------------------------------------

//? read start --------------------------------------------------------------------------
async function render() {
  let contactsList = document.querySelector(".contact-list");
  contactsList.innerHTML = "";
  let res = await fetch(CONTACTS_API);
  let data = await res.json();

  data.forEach(item => {
    contactsList.innerHTML += `
        <li style="padding-right: 50px;">
                <p>Имя: ${item.name}</p>
                <p>Фамилия: ${item.secondName}</p>
                <p>Номер телефона: ${item.number}</p>
                ${`<button href="#" class="btn-delete" id="${item.id}">DELETE</button>
                <button href="#" class="btn-edit"id="${item.id}">EDIT</button>`}
        </li>
        `;
  });

  if (data.length === 0) return;
  addDeleteEvent();
  addEditEvent();
}
render();
//? read start end-----------------------------------------------------------------------
//! delete button start -----------------------------------------------------------------
async function deleteContact(e) {
  let contactId = e.target.id;

  await fetch(`${CONTACTS_API}/${contactId}`, {
    method: "DELETE",
  });
  render();
}

function addDeleteEvent() {
  let deleteContactBtn = document.querySelectorAll(".btn-delete");
  deleteContactBtn.forEach(item => {
    item.addEventListener("click", deleteContact);
  });
}
// ! delete button end ------------------------------------------------------------------

// update btn start ---------------------------------------------------------------------
let saveChangesBtn = document.querySelector("#saveChangesBtn");

function checkCreateAndSaveBtn() {
  if (saveChangesBtn.id) {
    addContactBtn.setAttribute("style", "display: none;");
    saveChangesBtn.setAttribute("style", "display: block;");
  } else {
    addContactBtn.setAttribute("style", "display: block;");
    saveChangesBtn.setAttribute("style", "display: none;");
  }
}

async function addContactDataToForm(e) {
  let contactId = e.target.id;
  let res = await fetch(`${CONTACTS_API}/${contactId}`);
  let contactObj = await res.json();

  nameInp.value = contactObj.name;
  secondNameInp.value = contactObj.secondName;
  numberInp.value = contactObj.number;

  saveChangesBtn.setAttribute("id", contactObj.id);

  checkCreateAndSaveBtn();
}

function addEditEvent() {
  let btnEditContact = document.querySelectorAll(".btn-edit");
  btnEditContact.forEach(item => {
    item.addEventListener("click", addContactDataToForm);
  });
}

async function saveChanges(e) {
  let updatedContactObj = {
    name: nameInp.value,
    secondName: secondNameInp.value,
    number: numberInp.value,
    id: e.target.id,
  };

  await fetch(`${CONTACTS_API}/${e.target.id}`, {
    method: "PUT",
    body: JSON.stringify(updatedContactObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  alert("Успешно изменено!");

  nameInp.value = "";
  secondNameInp.value = "";
  numberInp.value = "";

  saveChangesBtn.removeAttribute("id");

  checkCreateAndSaveBtn();

  render();
}

saveChangesBtn.addEventListener("click", saveChanges);
// update btn end ---------------------------------------------------------------------
