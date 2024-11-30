document.addEventListener("DOMContentLoaded", function () {
    const institutionTab = document.getElementById("institution-tab");
    const scholarshipTab = document.getElementById("scholarship-tab");
    const searchSection = document.getElementById("search-section");
    const scholarshipsContainer = document.getElementById("scholarships-container");

    const resultsContainer = document.getElementById("results-container");
    const scholarshipResults = document.getElementById("scholarship-results");

    // Tab Switching
    window.switchTab = function (tabName) {
        if (tabName === "institution") {
            institutionTab.classList.add("active");
            scholarshipTab.classList.remove("active");
            searchSection.style.display = "block";
            scholarshipsContainer.style.display = "none";
            resultsContainer.style.display = "none";
        } else if (tabName === "scholarship") {
            scholarshipTab.classList.add("active");
            institutionTab.classList.remove("active");
            searchSection.style.display = "none";
            scholarshipsContainer.style.display = "block";
            scholarshipResults.style.display = "none";
        }
    };

    // Fetch results dynamically
    window.fetchResults = function (event, type) {
        event.preventDefault(); // Prevent default form submission

        const form = type === "institution" 
            ? document.getElementById("search-form") 
            : document.getElementById("scholarship-form");
        const formData = new FormData(form);

        fetch("search.php", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => displayResults(data, type))
            .catch((error) => console.error("Error fetching results:", error));
    };

    // Display results
    function displayResults(results, type) {
        const container = type === "institution" ? resultsContainer : scholarshipResults;
        container.innerHTML = ""; // Clear previous results

        if (results.length === 0) {
            container.innerHTML = "<p>Oops! It seems like you haven't entered any search input, or the scholarship you are looking for doesn't exist. Please try again.</p>";
        } else {
            results.forEach((result) => {
                const div = document.createElement("div");
                div.classList.add("result-table"); // Apply styling
                div.innerHTML = Object.entries(result)
                    .map(
                        ([key, value]) =>
                            `<p><strong>${key.replace(/_/g, " ").toUpperCase()}:</strong> ${value}</p>`
                    )
                    .join("");
                container.appendChild(div);
            });
        }

        container.style.display = "block"; // Show results container
    }
});
