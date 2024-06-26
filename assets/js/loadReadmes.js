document.addEventListener('DOMContentLoaded', function() {
    var repositoryUrl = 'https://michaelakridge-noaa.github.io/container-images'; // Hard-coded for testing
    fetch(`${repositoryUrl}/packages.json`)
    .then(response => response.json())
    .then(data => {
        const navList = document.getElementById('dropdownMenu'); // This ID should refer to the dropdown menu container

        data.forEach(pkg => {
            const parts = pkg.name.split('/'); // Splits the 'name' into parts
            const folderName = parts[parts.length - 1]; // Gets the last part which should be the folder name

            // Ensure to use backticks for template literals here as well
            const readmeUrl = `${repositoryUrl}/images/${folderName}`; // Correctly constructs the URL

            const listItem = document.createElement('li');
            listItem.className = 'dropdown-item'; // Class for dropdown items
            const link = document.createElement('a');
            link.href = readmeUrl;
            link.textContent = folderName; // Displays the folder name as the link text
            listItem.appendChild(link);
            navList.appendChild(listItem); // Appends the list item to the dropdown menu
        });
    })
    .catch(error => console.error('Failed to load packages:', error));
});

