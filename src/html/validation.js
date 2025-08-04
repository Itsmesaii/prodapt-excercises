
let customers = [];
let nextCustomerId = 1; 

const supportForm = document.getElementById('supportForm');
const customerDataBody = document.getElementById('customerData'); 
const resultsTableDiv = document.getElementById('resultsTable');


function saveCustomers() {
    localStorage.setItem('corporateSupportCustomers', JSON.stringify(customers));
    localStorage.setItem('nextCustomerId', nextCustomerId);
}

function loadCustomers() {
    const storedCustomers = localStorage.getItem('corporateSupportCustomers');
    const storedNextId = localStorage.getItem('nextCustomerId');

    if (storedCustomers) {
        customers = JSON.parse(storedCustomers);
        if (customers.length > 0) {
            const maxId = Math.max(...customers.map(c => c.id || 0)); 
            nextCustomerId = maxId + 1;
        } else {
            nextCustomerId = storedNextId ? parseInt(storedNextId) : 1;
        }
    }
}


function renderCustomers() {
    customerDataBody.innerHTML = '';

    if (customers.length === 0) {
        resultsTableDiv.style.display = 'none'; 
    } else {
        resultsTableDiv.style.display = 'block'; 

        customers.forEach(customer => {
            const newRow = customerDataBody.insertRow();
            newRow.innerHTML = `
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.contact}</td>
                <td>${customer.accountType}</td>
                `;
        });
    }
}


supportForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

    let isValid = true;
    
    const nameInput = document.getElementById('customerName');
    const emailInput = document.getElementById('customerEmail');
    const contactInput = document.getElementById('customerContact');
    const accountSelect = document.getElementById('accountType');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const contact = contactInput.value.trim();
    const accountType = accountSelect.value;

    if (name === '') {
        document.getElementById('nameError').textContent = 'Please enter your name.';
        isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
        document.getElementById('nameError').textContent = 'Please enter only alphabets.';
        isValid = false;
    }

    if (email === '') {
        document.getElementById('emailError').textContent = 'Please enter your email address.';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address.';
        isValid = false;
    }

    if (contact === '') {
        document.getElementById('contactError').textContent = 'Please enter your contact number.';
        isValid = false;
    } else if (!/^[789]\d{9}$/.test(contact)) {
        document.getElementById('contactError').textContent = 'Please enter a valid 10-digit number starting with 7, 8, or 9.';
        isValid = false;
    }

    if (accountType === '') {
        document.getElementById('accountError').textContent = 'Please select an account type.';
        isValid = false;
    }

    if (isValid) {
        const customer = {
            id: nextCustomerId++, 
            name: name,
            email: email,
            contact: contact,
            accountType: accountType
        };
        customers.push(customer);        
        saveCustomers();
        renderCustomers();
        supportForm.reset();
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    loadCustomers(); 
    renderCustomers(); 
});