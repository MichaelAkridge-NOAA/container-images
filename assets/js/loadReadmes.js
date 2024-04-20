document.addEventListener('DOMContentLoaded', function() {
    const baseRepoUrl = 'https://api.github.com/repos/MichaelAkridge-NOAA/container-images/contents/images';

    // Define the function to create navigation links
    function createNavLinks(folders) {
        const nav = document.getElementById('folderNav');
        folders.forEach(folder => {
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = folder;
            link.onclick = () => loadReadmeFile(folder);
            nav.appendChild(link);
        });
    }

    // Define the function to load README files
function loadReadmeFile(folder) {
    const url = `https://api.github.com/repos/MichaelAkridge-NOAA/container-images/contents/images/${folder}/README.md`;
    console.log("Attempting to fetch README from:", url);  // Log the URL to check correctness
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load README.md for ${folder}: Server responded with status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (typeof marked !== 'function') {
                console.error('marked is not loaded correctly');
            } else {
                const content = atob(data.content);
                const markdownHtml = marked(content);
                document.getElementById('readmeContainer').innerHTML = `<h2>README: ${folder}</h2>${markdownHtml}`;
            }
        })
        .catch(error => {
            console.error('Error loading README:', error);
            document.getElementById('readmeContainer').innerHTML += `<p>Error loading the README for ${folder}: ${error.message}</p>`;
        });
}


    // Fetch all folders and then initialize nav links
    fetch(baseRepoUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch directories: Server responded with status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const folders = data.filter(item => item.type === 'dir').map(item => item.name);
            createNavLinks(folders);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('readmeContainer').innerHTML = `<p>Error fetching directory list: ${error.message}</p>`;
        });
});

