const BASE_URL =
  "https://jointest-202a5-default-rtdb.europe-west1.firebasedatabase.app/";

function onloadFunc() {
  console.log("test");
  initContacts();
  loadData(""); // JSON name
  postData("/name", { titel: "test" }); // new ID auto-generated
  deleteData("/name/- url to delete object");
  putData("/name", { titel: "test" }); // update object with ID
}

async function loadData(path = "") {
  let response = await fetch(`${BASE_URL}${path}.json`);
  return await response.json();
}

async function postData(path = "", data = {}) {
  let response = await fetch(`${BASE_URL}${path}.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
}

async function deleteData(path = "") {
  let response = await fetch(`${BASE_URL}${path}.json`, { method: "DELETE" });
  return await response.json();
}

async function putData(path = "", data = {}) {
  let response = await fetch(`${BASE_URL}${path}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
}

function initUsers() {
  let users = [
    { id: 0, Name: "Guest", Email: "", Password: "", Emblem: "G" },
    {
      id: 1,
      Name: "Andrea Bauer",
      Email: "andrea6315@yahoo.com",
      Password: "1234",
      Emblem: "AB",
    },
    {
      id: 2,
      Name: "Peter Ludwig",
      Email: "p_Ludwig23@google.com",
      Password: "1234",
      Emblem: "PL",
    },
    {
      id: 3,
      Name: "Alfred Mueller",
      Email: "mueller_Alf92@gmail.com",
      Password: "1234",
      Emblem: "AM",
    },
  ];
  users.forEach((user) => postData("users", user));
}

function initContacts() {
  let contacts = [
    {
      id: 1,
      name: "Ackermann Carl Anton",
      email: "carl_ackermann@gmx.de",
      phone: "015498753529",
      emblem: "AC",
      color: "#FF7A00",
    },
    {
      id: 2,
      name: "Ahlers Johann August",
      email: "johann8989@gmx.de",
      phone: "016998639293",
      emblem: "AJ",
      color: "#FF4646",
    },
    {
      id: 3,
      name: "Beckmann Antje",
      email: "beckmann.antje@yahoo.com",
      phone: "018569875352",
      emblem: "BA",
      color: "#FFA35E",
    },
    {
      id: 4,
      name: "Mueller Susanne",
      email: "sussi_mueller@gmx.de",
      phone: "014569986987",
      emblem: "MS",
      color: "#C3FF2B",
    },
    {
      id: 5,
      name: "Wolfhope Theodor",
      email: "theoHope1834@gmx.de",
      phone: "014768932145",
      emblem: "WT",
      color: "#FF7A00",
    },
  ];
  contacts.forEach((contact) => postData("contacts", contact));
}
