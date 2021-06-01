// var to hold db connection
let db;
// event listener, est connection to IndexedDB called "pizza_hunt", set to V1
// indexedDB is a global variable, part of browser's window obj
// .open() takes 2 params, name of DB want to create/connect to and version
const request = indexedDB.open("pizza_hunt", 1);

// event emits if DB version changes
request.onupgradeneeded = function (event) {
  // save a reference to DB
  const db = event.target.result;
  // create obj store (table) called "new_pizza", set to have autoincrement primary key of sorts
  db.createObjectStore("new_pizza", { autoIncrement: true });
};

// upon successful connection to DB
request.onsuccess = function(event) {
  // when db is successfully created with obj store, save ref to db in global var
  db = event.target.result;

  // check if app is online, if yes run uploadPizza() to send all local db data to api
  if (navigator.onLine) {
    //   check if we're online every time app opens and upload remnant pizza data
    uploadPizza();
  }
};

request.onerror = function (event) {
  // log error
  console.log(event.target.errorCode);
};

// if we attempt to submit a new pizza and there's no internet
function saveRecord(record) {
  // open new transaction(temporary connection) with DB with read and write permissions
  const transaction = db.transaction(["new_pizza"], "readwrite");

  // access obj store for `new_pizza`
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  // add record to store with add method
  pizzaObjectStore.add(record);
}

// open new transaction, read data
function uploadPizza() {
  // open transaction on db
  const transaction = db.transaction(["new_pizza"], "readwrite");

  // access obj store for `new_pizza`
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  // get all records from store and set to a var
  const getAll = pizzaObjectStore.getAll();

  // upon successful .getAll()
  getAll.onsuccess = function () {
    // if there was data in indexedDb's store, send to api server
    if (getAll.result.length > 0) {
      fetch("/api/pizzas", {
        method: "POST",
        // getAll.result is an array of all data we retrieved from new_pizza obj store
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        }
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open one more transaction
          const transaction = db.transaction(["new_pizza"], "readwrite");
          // access new_pizza obj store
          const pizzaObjectStore = transaction.objectStore("new_pizza");
          // clear all items in store
          pizzaObjectStore.clear();

          alert("All saved pizza has been submitted!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

// listen for app coming back online
window.addEventListener("online", uploadPizza);
