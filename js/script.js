document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const searchInput = document.getElementById('search-input');
    let data; // Declare data globally

    // Fetch data from the Random User Generator API
    fetch('https://randomuser.me/api/?results=12&nat=us') // Set the nationality to 'us' for the English alphabet
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(apiData => {
            data = apiData; // Assign apiData to the global variable
            // Create and append gallery items
            data.results.forEach(user => {
                const cardHTML = `
                    <div class="card">
                        <div class="card-img-container">
                            <img class="card-img" src="${user.picture.large}" alt="profile picture">
                        </div>
                        <div class="card-info-container">
                            <h3 class="card-name cap">${user.name.first} ${user.name.last}</h3>
                            <p class="card-text">${user.email}</p>
                            <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
                        </div>
                    </div>
                `;
                gallery.insertAdjacentHTML('beforeend', cardHTML);

                // Add event listener for each card to open modal
                const card = gallery.lastElementChild;
                card.addEventListener('click', () => openModal(user));
            });
        })
        .catch(error => console.error('Error fetching data:', error));

    // Function to open the modal with user details
    function openModal(user) {
        // Create and append modal
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        const modal = document.createElement('div');
        modal.className = 'modal';

        // Create close button
        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.id = 'modal-close-btn';
        closeButton.className = 'modal-close-btn';
        closeButton.innerHTML = '<strong>X</strong>';
        closeButton.addEventListener('click', closeModal);

        // Generate HTML for modal details
        const modalInfoHTML = `
            <div class="modal-info-container">
                <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                <h3 class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="modal-text">${user.email}</p>
                <p class="modal-text cap">${user.location.city}</p>
                <p class="modal-text">${user.cell}</p>
                <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
                <p class="modal-text">Birthday: ${user.dob.date.substring(0, 10)}</p>
            </div>
        `;
        // Append modal details HTML to the modal
        modal.insertAdjacentHTML('beforeend', modalInfoHTML);

        // Append close button and modal to the modal container
        modal.appendChild(closeButton);
        modalContainer.appendChild(modal);

        // Append modal container to the body
        document.body.appendChild(modalContainer);

        // Add event listeners for modal navigation buttons
        const modalPrevBtn = document.createElement('button');
        modalPrevBtn.type = 'button';
        modalPrevBtn.id = 'modal-prev';
        modalPrevBtn.className = 'modal-prev btn';
        modalPrevBtn.textContent = 'Prev';
        modalPrevBtn.addEventListener('click', () => navigateModal(-1));

        const modalNextBtn = document.createElement('button');
        modalNextBtn.type = 'button';
        modalNextBtn.id = 'modal-next';
        modalNextBtn.className = 'modal-next btn';
        modalNextBtn.textContent = 'Next';
        modalNextBtn.addEventListener('click', () => navigateModal(1));

        const modalBtnContainer = document.createElement('div');
        modalBtnContainer.className = 'modal-btn-container';
        modalBtnContainer.appendChild(modalPrevBtn);
        modalBtnContainer.appendChild(modalNextBtn);
        modal.appendChild(modalBtnContainer);
    }

    // Function to close the modal
    function closeModal() {
        const modalContainer = document.querySelector('.modal-container');
        document.body.removeChild(modalContainer);
    }

    // Function to navigate through the modal
    function navigateModal(direction) {
        const cards = document.querySelectorAll('.card');
        const modalContainer = document.querySelector('.modal-container');
        const currentCard = modalContainer.querySelector('.modal-name').textContent.toLowerCase();

        let currentIndex;
        cards.forEach((card, index) => {
            const name = card.querySelector('.card-name').textContent.toLowerCase();
            if (name === currentCard) {
                currentIndex = index;
            }
        });

        const newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < cards.length) {
            closeModal();
            openModal(data.results[newIndex]);
        }
    }

    // Create and append the search form HTML
    const searchFormHTML = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
    `;
    gallery.insertAdjacentHTML('beforebegin', searchFormHTML);

    // Function to filter the directory by name
    function searchFilter() {
        const searchTerm = searchInput.value.toLowerCase();
        const cards = document.querySelectorAll('.card');

        cards.forEach(card => {
            const name = card.querySelector('.card-name').textContent.toLowerCase();
            const display = name.includes(searchTerm) ? 'flex' : 'none';
            card.style.display = display;
        });

        // Update the search bar to show the search names
        const visibleCards = Array.from(cards).filter(card => card.style.display !== 'none');
        const searchNames = visibleCards.map(card => card.querySelector('.card-name').textContent.toLowerCase());
        
        if (searchNames.length > 0) {
            searchInput.placeholder = `Search: ${searchNames.join(', ')}`;
        } else {
            searchInput.placeholder = 'Search...';
        }
    }

    // Event listener for the search form
    searchInput.addEventListener('input', searchFilter);

});
