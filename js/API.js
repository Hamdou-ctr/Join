function onloadFunc() {
    console.log('test');
    initContacts();
  
    //loadData("");  // name des JSONS einfügen um das JSON zu laden
    //postData("/name", {titel: "test"}); //neue ID wird automatisch generiert
    //deleteData("/name/- url angeben um Objekt zu löschen")
    //putData("/name", {titel: "test"}); //verändert das Objekt in einer ID
  }
  
  const BASE_URL = 'https://join-210-default-rtdb.europe-west1.firebasedatabase.app/';
  
  async function loadData(path = '') {
    let response = await fetch(BASE_URL + path + '.json');
    return (responseToJson = await response.json());
  }
  
  async function postData(path = '', data = {}) {
    const id = data.id;
    let response = await fetch(BASE_URL + path + '.json', {
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return (responseToJson = await response.json());
  }
  
  async function deleteData(path = '') {
    let response = await fetch(BASE_URL + path + '.json', {
      method: 'DELETE',
    });
    return (responseToJson = await response.json());
  }
  
  async function putData(path = '', data = {}) {
    let response = await fetch(BASE_URL + path + '.json', {
      method: 'PUT',
      header: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return (responseToJson = await response.json());
  }
  
  function initUsers() {
    postData('users', id, {
      "id": 0,
      "Name": "Guest",
      "Email": "",
      "Password": "",
      "Emblem": "G"
    });
    postData('users', id, {
      "id": 1,
      "Name": "Andrea Bauer",
      "Email": "andrea6315@yahoo.com",
      "Password": "1234",
      "Emblem": "AB"
    });
    postData('users', id, {
      "id": 2,
      "Name": "Peter Ludwig",
      "Email": "p_Ludwig23@google.com",
      "Password": "1234",
      "Emblem": "PL"
    });
    postData('users', id, {
      "id": 3,
      "Name": "Alfred Mueller",
      "Email": "mueller_Alf92@gmail.com",
      "Password": "1234",
      "Emblem": "AM"
    });
  
  }
  
  function initContacts() {
    postData('contacts', {
      id: 1,
      name: 'Ackermann Carl Anton',
      email: 'carl_ackermann@gmx.de',
      phone: '015498753529',
      emblem: 'AC',
      color: '#FF7A00',
    });
  
    postData('contacts',
      {
        id: 2,
        name: 'Ahlers Johann August',
        email: 'johann8989@gmx.de',
        phone: '016998639293',
        emblem: 'AJ',
        color: '#FF4646',
      });
    postData('contacts',
      {
        id: 3,
        name: 'Beckmann Antje',
        email: 'beckmann.antje@yahoo.com',
        phone: '018569875352',
        emblem: 'BA',
        color: '#FFA35E',
      });
    postData('contacts',
      {
        id: 4,
        name: 'Mueller Susanne',
        email: 'sussi_mueller@gmx.de',
        phone: '014569986987',
        emblem: 'MS',
        color: '#C3FF2B',
      });
    postData('contacts',
      {
        id: 5,
        name: 'Wolfhope Theodor',
        email: 'theoHope1834@gmx.de',
        phone: '014768932145',
        emblem: 'WT',
        color: '#FF7A00',
      });
  }