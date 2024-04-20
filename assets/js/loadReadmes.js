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

    // Define the function to load a README file
    function loadReadmeFile(folder) {
        const baseReadmeUrl = 'https://api.github.com/repos/MichaelAkridge-NOAA/container-images/contents/images/';
        const url = `${baseReadmeUrl}${folder}/README.md`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    // If README doesn't exist, log and display a friendly message instead of throwing an error
                    console.log(`README.md for ${folder} not found: Server responded with status ${response.status}`);
                    document.getElementById('readmeContainer').innerHTML += `<p>README not available for ${folder}.</p>`;
                    return null; // Stop processing further
                }
                return response.json();
            })
            .then(data => {
                if (!data) return; // If there's no data, stop processing
                const content = atob(data.content); // Decode base64-encoded content
                const markdownHtml = marked(content);
                const container = document.createElement('div');
                container.innerHTML = `<h2>README: ${folder}</h2>${markdownHtml}`;
                document.getElementById('readmeContainer').appendChild(container);
            })
            .catch(error => {
                console.error('Error:', error);
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

