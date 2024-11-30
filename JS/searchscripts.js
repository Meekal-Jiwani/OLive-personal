document.addEventListener("DOMContentLoaded", function () {
    const institutionTab = document.getElementById("institution-tab");
    const scholarshipTab = document.getElementById("scholarship-tab");
    const searchSection = document.getElementById("search-section");
    const scholarshipsContainer = document.getElementById("scholarships-container");

    const resultsContainer = document.getElementById("results-container");
    const scholarshipResults = document.getElementById("scholarship-results");

    const searchInstitutionButton = document.getElementById("search-institution-button");
    const searchScholarshipButton = document.getElementById("search-scholarship-button");

    // Ensure initial visibility
    searchSection.style.display = "block";
    scholarshipsContainer.style.display = "none";

    // Function to handle tab switching
    function switchTab(tabName) {
        if (tabName === "institution") {
            institutionTab.classList.add("active");
            scholarshipTab.classList.remove("active");
            searchSection.style.display = "block";
            scholarshipsContainer.style.display = "none";
        } else if (tabName === "scholarship") {
            scholarshipTab.classList.add("active");
            institutionTab.classList.remove("active");
            searchSection.style.display = "none";
            scholarshipsContainer.style.display = "block";
        }
    }

    // Add event listeners for tabs
    institutionTab.addEventListener("click", () => switchTab("institution"));
    scholarshipTab.addEventListener("click", () => switchTab("scholarship"));

    // Show results after clicking the institution search button
    searchInstitutionButton.addEventListener("click", function () {
        resultsContainer.style.display = "block";
    });

    // Show results after clicking the scholarship search button
    searchScholarshipButton.addEventListener("click", function () {
        scholarshipResults.style.display = "block";
    });

    window.fetchResults = function (event, type) {
        event.preventDefault(); // Prevent default form submission
    
        const form = type === "institution" 
            ? document.getElementById("search-form") 
            : document.getElementById("scholarship-form");
        const formData = new FormData(form);
    
        fetch("../PHP/search.php", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched Results:", data); // Debugging log
                displayResults(data, type);
            })
            .catch((error) => console.error("Error fetching results:", error));
    };
    
    // Display results in the appropriate container
    function displayResults(results, type) {
        const container = type === "institution" ? resultsContainer : scholarshipResults;
        container.innerHTML = ""; // Clear previous results
    
        if (results.length === 0) {
            container.innerHTML = `<p>No results found for your search. Please try again with different keywords.</p>`;
        } else {
            // Create a table for the results
            const table = document.createElement("table");
            table.classList.add(type === "institution" ? "result-table" : "scholarship-table");
    
            // Create table headers dynamically based on the first result keys
            const headers = Object.keys(results[0]);
            const thead = document.createElement("thead");
            const headerRow = document.createElement("tr");
            headers.forEach((header) => {
                const th = document.createElement("th");
                th.textContent = header.replace(/_/g, " ").toUpperCase(); // Format headers
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);
    
            // Populate table rows with result data
            const tbody = document.createElement("tbody");
            results.forEach((result) => {
                const row = document.createElement("tr");
                headers.forEach((key) => {
                    const cell = document.createElement("td");
                    // If the value is a URL, create a link
                    if (key === "website_url") {
                        const link = document.createElement("a");
                        link.href = `http://${result[key]}`;
                        link.textContent = result[key];
                        link.target = "_blank";
                        cell.appendChild(link);
                    } else {
                        cell.textContent = result[key];
                    }
                    row.appendChild(cell);
                });
                tbody.appendChild(row);
            });
            table.appendChild(tbody);
    
            container.appendChild(table); // Add the table to the container
        }
    
        container.style.display = "block"; // Show results container
    }
      

});




document.addEventListener("DOMContentLoaded", function() {
    const isDarkMode = localStorage.getItem("darkMode") === "enabled";
    if (isDarkMode) {
        document.body.classList.add("dark-theme");
    }
});
