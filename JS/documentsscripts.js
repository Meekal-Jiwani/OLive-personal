// Load the profile image and fetch documents on page load
window.addEventListener("DOMContentLoaded", function() {
    const profileImage = document.getElementById("sidebar-profile-image");
    const storedImage = localStorage.getItem("profileImage");

    if (storedImage) {
        profileImage.src = storedImage;
    } else {
        profileImage.src = "../images/profile.png"; // Default image path
    }

    // Check dark mode preference
    const isDarkMode = localStorage.getItem("darkMode") === "enabled";
    if (isDarkMode) {
        document.body.classList.add("dark-theme");
    }

    // Fetch documents once on load
    fetchDocuments();
});

document.getElementById('links-container').addEventListener('click', function (e) {
    const deleteButton = e.target.closest('.delete-button');
    if (deleteButton) {
        const itemId = deleteButton.getAttribute('data-id');
        const itemType = deleteButton.getAttribute('data-type');
        const parentElement = deleteButton.closest('.entry');

        console.log(`Delete button clicked: ID=${itemId}, Type=${itemType}`);
        
        if (itemId && itemType) {
            deleteItem(itemId, parentElement, itemType);
        } else {
            console.error('Missing ID or type attributes:', deleteButton);
        }
    }
});


document.getElementById('documents-container').addEventListener('click', function (e) {
    const deleteButton = e.target.closest('.delete-button');
    if (deleteButton) {
        const itemId = deleteButton.getAttribute('data-id');
        const itemType = deleteButton.getAttribute('data-type');
        const parentElement = deleteButton.closest('.entry'); // The parent entry to be removed
        
        console.log(`Delete button clicked: ID=${itemId}, Type=${itemType}`);
        
        if (itemId && itemType) {
            deleteItem(itemId, parentElement, itemType);
        } else {
            console.error('Missing ID or type attributes:', deleteButton);
        }
    }
});


function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function addLink() {
    const title = document.getElementById('link-title').value.trim();
    const url = document.getElementById('link-url').value.trim();

    // Check if title or URL is missing
    if (!title || !url) {
        alert('Please enter both a title and a valid URL.');
        return;
    }

    // Validate URL format
    const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\/?].*)?$/;
    if (!urlPattern.test(url)) {
        alert('Please enter a valid link. Example: https://example.com');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('link', url);
    formData.append('type', 'link');

    fetch('../PHP/upload_documents.php', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log('Link added successfully:', data);

            if (data.success && data.id) {
                const linksContainer = document.getElementById('links-container');
                const linkEntry = document.createElement('div');
                linkEntry.className = 'entry';

                const deleteButton = document.createElement('button');
                deleteButton.textContent = '-';
                deleteButton.className = 'delete-button';
                deleteButton.setAttribute('data-id', data.id);
                deleteButton.setAttribute('data-type', 'link');

                linkEntry.appendChild(deleteButton);
                linkEntry.innerHTML += `<strong>${title}:</strong> <a href="${url}" target="_blank">${url}</a>`;
                linksContainer.appendChild(linkEntry);

                document.getElementById('link-title').value = '';
                document.getElementById('link-url').value = '';
                closeModal('link-modal');
            } else {
                alert('Error: Failed to upload link. User is not logged in.');
            }
        })
        .catch(error => {
            console.error('Error adding link:', error);
            alert('An error occurred while adding the link. Please try again.');
        });
}


function addDocument() {
    const title = document.getElementById('document-title').value;
    const fileInput = document.getElementById('document-file');
    const file = fileInput.files[0];
    const userId = 1; // Replace this with the actual user ID dynamically if needed

    if (title && file) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('file', file);
        formData.append('user_id', userId);
        formData.append('type', 'document');

        fetch('../PHP/upload_documents.php', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                console.log('Upload successful:', data);

                if (data.success && data.id) {
                    const documentsContainer = document.getElementById('documents-container');

                    const documentEntry = document.createElement('div');
                    documentEntry.className = 'entry';

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = '-';
                    deleteButton.className = 'delete-button';
                    deleteButton.onclick = function () {
                        deleteItem(data.id, documentEntry, 'document');
                    };

                    documentEntry.appendChild(deleteButton);

                    const newDocument = document.createElement('p');
                    const downloadLink = document.createElement('a');
                    downloadLink.href = data.file_path; 
                    downloadLink.download = file.name;
                    downloadLink.textContent = file.name;
                    newDocument.innerHTML = `<strong>${title}:</strong> `;
                    newDocument.appendChild(downloadLink);
                    documentEntry.appendChild(newDocument);

                    documentsContainer.appendChild(documentEntry);

                    document.getElementById('document-title').value = '';
                    fileInput.value = '';
                    closeModal('document-modal');
                } else {
                    alert('Error: Failed to upload document. User is not logged in.');
                }
            })
            .catch(error => {
                console.error('Error uploading document:', error);
                alert('Error uploading document: ' + error.message);
            });
    } else {
        alert('Please enter a title and select a document.');
    }
}




window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
};

function fetchDocuments() {
    const userId = 1; // Replace with dynamic user ID logic if needed

    fetch(`../PHP/get_documents.php?user_id=${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log('Fetched documents:', data.data); // Debug log
                updateUIWithDocuments(data.data); // Update UI with fetched data
            } else {
                console.error('Error fetching documents:', data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching documents:', error);
        });
}



async function getUserId() {
    const response = await fetch('../PHP/get_user_id.php');
    const data = await response.json();
    if (data && data.user_id) {
        return data.user_id;
    } else {
        console.error('Failed to retrieve user ID from backend');
        return null;
    }
}

function updateUIWithDocuments(data) {
    const linksContainer = document.getElementById('links-container');
    const documentsContainer = document.getElementById('documents-container');
    linksContainer.innerHTML = ''; 
    documentsContainer.innerHTML = ''; 

    if (!data || data.length === 0) {
        console.log('No documents or links to display.');
        return;
    }

    data.forEach(item => {
        const entry = document.createElement('div');
        entry.className = 'entry';

        if (item.type === 'link') {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '-';
            deleteButton.className = 'delete-button';
            deleteButton.setAttribute('data-id', item.document_id); // Ensure this matches the database
            deleteButton.setAttribute('data-type', 'link');

            const linkText = document.createElement('p');
            linkText.innerHTML = `<strong>${item.title}:</strong> <a href="${item.relevant_links}" target="_blank">${item.relevant_links}</a>`;

            entry.appendChild(deleteButton);
            entry.appendChild(linkText);
            linksContainer.appendChild(entry);
        } else if (item.type === 'document') {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '-';
            deleteButton.className = 'delete-button';
            deleteButton.setAttribute('data-id', item.document_id); // Ensure this matches the database
            deleteButton.setAttribute('data-type', 'document');

            const documentText = document.createElement('p');
            const downloadLink = document.createElement('a');
            downloadLink.href = item.file_path;
            downloadLink.download = item.file_name;
            downloadLink.textContent = item.file_name;

            documentText.innerHTML = `<strong>${item.title}:</strong> `;
            documentText.appendChild(downloadLink);

            entry.appendChild(deleteButton);
            entry.appendChild(documentText);
            documentsContainer.appendChild(entry);
        }
    });
}



function createDeleteButton(itemId, itemType) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '−'; 
    deleteButton.className = 'delete-button';
    deleteButton.setAttribute('data-id', itemId);
    deleteButton.setAttribute('data-type', itemType);
    return deleteButton;
}
function deleteItem(itemId, element, itemType) {
    console.log(`deleteItem called with ID=${itemId}, Type=${itemType}`);
    if (!itemId || !itemType) {
        console.error('Invalid itemId or itemType passed to deleteItem');
        return;
    }

    fetch('../PHP/delete_item.php', {
        method: 'POST',
        body: JSON.stringify({ id: itemId, type: itemType }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log(`Delete response:`, data);
            if (data.success) {
                element.remove();
                alert(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} deleted successfully`);
            } else {
                alert(`Failed to delete the ${itemType}: ${data.message}`);
            }
        })
        .catch(error => {
            console.error(`Error deleting the ${itemType}:`, error);
            alert('An unexpected error occurred. Please check the console for details.');
        });
}
