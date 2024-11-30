// Fetch categories from the server
async function fetchCategories() {
    try {
        const response = await fetch("../PHP/preferences.php");
        if (!response.ok) throw new Error("Failed to fetch categories");

        const categories = await response.json();
        populateCategories(categories.map((c) => c.name)); // Use the "name" field from the JSON response
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

// Populate categories dynamically based on row pattern
function populateCategories(categories) {
    const container = document.getElementById("categories");

    let rowPattern = [1, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 1]; // The pattern to follow
    let currentPatternIndex = 0; // Start with the first row pattern
    let currentRowCount = 0; // Track how many categories are added to the current row

    // Create the first row
    let currentRow = document.createElement("div");
    currentRow.className = "row";
    container.appendChild(currentRow);

    categories.forEach((category, index) => {
        // Create the category button
        const categoryElement = document.createElement("div");
        categoryElement.className = "category";
        categoryElement.textContent = category;

        // Append category to the current row
        currentRow.appendChild(categoryElement);
        currentRowCount++;

        // Check if the current row is complete based on the pattern
        if (currentRowCount === rowPattern[currentPatternIndex]) {
            currentRowCount = 0; // Reset count for the next row
            currentPatternIndex = (currentPatternIndex + 1) % rowPattern.length; // Move to the next row pattern

            // Create a new row if there are more categories
            if (index < categories.length - 1) {
                currentRow = document.createElement("div");
                currentRow.className = "row";
                container.appendChild(currentRow);
            }
        }
    });

    // Add click functionality to toggle the "selected" state
    document.querySelectorAll(".category").forEach((element) => {
        element.addEventListener("click", () => {
            element.classList.toggle("selected");
        });
    });
}

// Launch Button Click
document.getElementById("launch-button").addEventListener("click", () => {
    // Redirect to feed page
    window.location.href = "../HTML/feed.html";
});

// Fetch and populate categories on page load
fetchCategories();
