
let testimonials = [];
let nextId = 1; 
let editingId = null; 

const testimonialForm = document.getElementById('testimonialForm');
const authorNameInput = document.getElementById('authorName');
const testimonialTextInput = document.getElementById('testimonialText');
const testimonialListDiv = document.getElementById('testimonialList');
const noTestimonialsMessageContainer = document.getElementById('noTestimonialsMessage');
const submitButton = testimonialForm.querySelector('button[type="submit"]'); 


function renderTestimonials() {
    const existingTestimonialCards = testimonialListDiv.querySelectorAll('.col[data-id]');
    existingTestimonialCards.forEach(card => {
        card.remove();
    });

    if (testimonials.length === 0) {
        noTestimonialsMessageContainer.style.display = 'block'; 
    } else {
        noTestimonialsMessageContainer.style.display = 'none'; 

        testimonials.forEach(testimonial => {
            const colDiv = document.createElement('div');
            colDiv.classList.add('col');
            colDiv.dataset.id = testimonial.id; 
            colDiv.innerHTML = `
                <div class="card h-100 testimonial-card">
                    <div class="card-body">
                        <p class="card-text">"${testimonial.text}"</p>
                        <h5 class="card-title text-muted">- ${testimonial.author}</h5>
                    </div>
                    <div class="card-footer text-end">
                        <button class="btn btn-sm btn-outline-primary me-2 edit-btn" data-id="${testimonial.id}" title="Edit Testimonial">
                            Edit
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${testimonial.id}" title="Delete Testimonial">
                            Delete
                        </button>
                    </div>
                </div>
            `;
            testimonialListDiv.appendChild(colDiv);
        });
    }
}

function addTestimonial(author, text) {
    const newTestimonial = {
        id: nextId++, 
        author: author,
        text: text
    };
    testimonials.push(newTestimonial);
    renderTestimonials(); 
}

// Function to update an existing testimonial
function updateTestimonial(id, newAuthor, newText) {
    const index = testimonials.findIndex(t => t.id === id);
    if (index !== -1) {
        testimonials[index].author = newAuthor;
        testimonials[index].text = newText;
    }
    renderTestimonials(); // Re-render to show the updated list
}

// Function to delete a testimonial
function deleteTestimonial(id) {
    testimonials = testimonials.filter(testimonial => testimonial.id !== id);
    renderTestimonials(); // Re-render to show the updated list
}

// Function to load a testimonial into the form for editing
function loadTestimonialForEdit(id) {
    const testimonialToEdit = testimonials.find(t => t.id === id);
    if (testimonialToEdit) {
        authorNameInput.value = testimonialToEdit.author;
        testimonialTextInput.value = testimonialToEdit.text;
        editingId = id; // Set the ID of the testimonial being edited
        submitButton.textContent = 'Update Testimonial'; // Change button text
        submitButton.classList.remove('btn-primary'); // Remove primary color
        submitButton.classList.add('btn-success'); // Add success color for update
    }
}

// Function to reset the form state
function resetForm() {
    authorNameInput.value = '';
    testimonialTextInput.value = '';
    editingId = null; // Clear editing state
    submitButton.textContent = 'Submit Testimonial'; // Reset button text
    submitButton.classList.remove('btn-success'); // Remove success color
    submitButton.classList.add('btn-primary'); // Reset to primary color
}

// --- Event Listeners ---

// Handle form submission (now handles both add and edit)
testimonialForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission (page reload)

    const author = authorNameInput.value.trim();
    const text = testimonialTextInput.value.trim();

    if (author && text) { // Ensure inputs are not empty
        if (editingId !== null) {
            // We are in edit mode
            updateTestimonial(editingId, author, text);
        } else {
            // We are in add mode
            addTestimonial(author, text);
        }
        resetForm(); // Clear the form fields and reset button after submission
    } else {
        alert('Please fill in both name and testimonial fields.');
    }
});

// Handle clicks on Delete and Edit buttons (Event Delegation)
testimonialListDiv.addEventListener('click', function(event) {
    const target = event.target;

    // Handle Delete button click
    if (target.classList.contains('delete-btn') || target.closest('.delete-btn')) {
        const btn = target.closest('.delete-btn');
        const idToDelete = parseInt(btn.dataset.id);
        if (confirm('Are you sure you want to delete this testimonial?')) {
            deleteTestimonial(idToDelete);
        }
    }
    // Handle Edit button click
    else if (target.classList.contains('edit-btn') || target.closest('.edit-btn')) {
        const btn = target.closest('.edit-btn');
        const idToEdit = parseInt(btn.dataset.id);
        loadTestimonialForEdit(idToEdit);
        // Optionally scroll to top of the form after clicking edit
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

document.addEventListener('DOMContentLoaded', renderTestimonials);