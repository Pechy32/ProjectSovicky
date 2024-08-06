class Kid {
    constructor(firstName, lastName, birthDate, residence, motherPhone, fatherPhone) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = new Date(birthDate);
        this.motherPhone = motherPhone;
        this.fatherPhone = fatherPhone;
        this.residence = residence;
    }

    getAge() {
        let now = new Date();
        let birthDate = this.birthDate;
        let ageInYears = now.getFullYear() - birthDate.getFullYear();
        let monthDiff = now.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
            ageInYears--;
            monthDiff += 12;
        }
        return { years: ageInYears, months: monthDiff };
    }

    displayAge() {
        const age = this.getAge();
        document.write(`${age.years} years ${age.months} months`);
    }
}

// Load collection from localStorage or create a new array if none is stored
let collection = JSON.parse(localStorage.getItem('collection')) || [];

// Convert data to instances of Kid
collection = collection.map(kidData => {
    return new Kid(kidData.firstName, kidData.lastName, new Date(kidData.birthDate), kidData.residence, kidData.motherPhone, kidData.fatherPhone);
});

// Function to save the collection to localStorage
function saveCollection() {
    localStorage.setItem('collection', JSON.stringify(collection));
}

// Function to create a sort button with an icon
function createSortButton(iconName) {
    const button = document.createElement("button");
    button.setAttribute("class", "sort-btn");
    button.innerHTML = `<i class="fas fa-sort-${iconName}"></i>`;
    return button;
}

// Function to create an HTML table from the kids collection
function createTable() {
    const table = document.createElement("table");
    const headerRow = table.insertRow();
    const headers = ["", "Jméno", "Příjmení", "Datum Narození", "Věk", "Bydliště", "Tel. Matka", "Tel. Otec", "Akce"];

    // Create table headers
    headers.forEach((headerText, index) => {
        const header = document.createElement("th");
        if (headerText === "Datum Narození" || headerText === "Věk") {
            const textNode = document.createTextNode(headerText);
            header.appendChild(textNode);
            const sortButton = createSortButton("down");
            header.appendChild(sortButton);

            sortButton.addEventListener("click", () => {
                if (index === 3) {
                    sortCollectionByBirthDate();
                } else if (index === 4) {
                    sortCollectionByAge();
                }
            });
        } else {
            const textNode = document.createTextNode(headerText);
            header.appendChild(textNode);
        }
        headerRow.appendChild(header);
    });

    // Populate table with data from the kids collection
    let counter = 1;
    collection.forEach(kid => {
        const row = table.insertRow();
        const data = [
            counter,
            kid.firstName,
            kid.lastName,
            `${kid.birthDate.getDate()}. ${kid.birthDate.getMonth() + 1}. ${kid.birthDate.getFullYear()}`,
            `${kid.getAge().years} years ${kid.getAge().months} months`,
            kid.residence,
            kid.motherPhone,
            kid.fatherPhone
        ];
        data.forEach(text => {
            const cell = row.insertCell();
            const textNode = document.createTextNode(text);
            cell.appendChild(textNode);
        });
        counter++;

        // Button to remove kid from collection
        const actionCell = row.insertCell();
        const removeButton = document.createElement("button");
        removeButton.setAttribute("id", "removeBTN");
        removeButton.textContent = "Odstranit";

        const editButton = document.createElement("button");
        editButton.setAttribute("id", "editBTN");
        editButton.textContent = "Editovat";

        removeButton.addEventListener("click", function () {
            removeKidButton(kid);
        });

        editButton.addEventListener("click", function () {
            editKidButton(kid);
        });

        actionCell.appendChild(removeButton);
        actionCell.appendChild(editButton);
    });

    // Replace collection content with the table
    const kidCollectionDiv = document.getElementById("kidCollection");
    kidCollectionDiv.innerHTML = "";
    kidCollectionDiv.appendChild(table);
}

// Function to validate the add kid form
function validateForm() {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const birthDate = document.getElementById("birthDate").value;
    const motherPhone = document.getElementById("motherPhone").value;
    const fatherPhone = document.getElementById("fatherPhone").value;

    if (firstName === '' || lastName === '' || birthDate === '') {
        alert('Vyplňte povinná pole (jméno, příjmení, datum narození).');
        return false; // Form is not valid
    }

    if ((motherPhone !== "" && isNaN(motherPhone)) || (fatherPhone !== "" && isNaN(fatherPhone))) {
        alert('Zadejte validní telefonní číslo (9 čísel bez mezer).');
        return false;
    }

    if ((motherPhone !== "" && motherPhone.length !== 9) || (fatherPhone !== "" && fatherPhone.length !== 9)) {
        alert('Zadejte validní telefonní číslo (9 čísel bez mezer.');
        return false;
    }

    return true; // Form is valid
}

// Function to add a kid to the collection
function addKid(event) {
    event.preventDefault(); // Prevent form submission

    if (!validateForm()) {
        return; // If form is not valid, exit the function
    }

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const birthDate = document.getElementById("birthDate").value;
    const motherPhone = document.getElementById("motherPhone").value;
    const fatherPhone = document.getElementById("fatherPhone").value;
    const residence = document.getElementById("residence").value;

    const newKid = new Kid(firstName, lastName, birthDate, residence, formatPhoneNumber(motherPhone), formatPhoneNumber(fatherPhone));

    collection.push(newKid);

    saveCollection();
    createTable();

    document.getElementById("kidForm").reset();
}

// Function to remove a kid from the collection using the button in the table row
function removeKidButton(kid) {
    const confirmation = confirm(`Opravdu chcete odstranit záznam ${kid.firstName} ${kid.lastName}?`);

    if (confirmation) {
        const index = collection.findIndex(item => {
            return item.firstName === kid.firstName &&
                item.lastName === kid.lastName &&
                item.birthDate.getTime() === kid.birthDate.getTime();
        });

        if (index !== -1) {
            collection.splice(index, 1);
            saveCollection();
            createTable();
        }
    }
}

// Function to format phone number
function formatPhoneNumber(phone) {
    let formattedPhone = "";
    const space = " ";
    const firstPart = phone.slice(0, 3);
    const secondPart = phone.slice(3, 6);
    const thirdPart = phone.slice(6, 9);
    formattedPhone = firstPart + space + secondPart + space + thirdPart;
    return formattedPhone;
}

// Function to sort collection by age in descending order
function sortCollectionByAge() {
    collection.sort((a, b) => {
        return b.getAge().years - a.getAge().years || b.getAge().months - a.getAge().months;
    });
    createTable();
}

// Function to sort collection by Birth Date in ascending order
function sortCollectionByBirthDate() {
    collection.sort((a, b) => {
        return a.birthDate.getMonth() - b.birthDate.getMonth() || a.birthDate.getFullYear() - b.birthDate.getFullYear();
    });
    createTable();
}

// Function to edit a kid's information
function editKidButton(kid) {
    const firstName = prompt("Zadejte nové jméno:", kid.firstName);
    const lastName = prompt("Zadejte nové přijíjmení:", kid.lastName);
    const birthDate = prompt("Zadejte nové datum narození (YYYY-MM-DD):", kid.birthDate.toISOString().substring(0, 10));
    const residence = prompt("Zadejte nové bydliště:", kid.residence);
    const motherPhone = prompt("Zadejte nový tel. kontakt matky:", kid.motherPhone.replace(/\s+/g, ''));
    const fatherPhone = prompt("Zadejte nový tel. kontakt otce:", kid.fatherPhone.replace(/\s+/g, ''));

    if (firstName && lastName && birthDate && residence) {
        kid.firstName = firstName;
        kid.lastName = lastName;
        kid.birthDate = new Date(birthDate);
        kid.residence = residence;
        kid.motherPhone = formatPhoneNumber(motherPhone);
        kid.fatherPhone = formatPhoneNumber(fatherPhone);

        saveCollection();
        createTable();
    } else {
        alert("Pro editaci záznamu je potřeba zadat všechna data.");
    }
}

// Attach event for form submission
document.getElementById("kidForm").addEventListener("submit", addKid);

window.onload = function () {
    createTable();
}