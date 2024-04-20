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
    function loadReadmeFiles(folders) {
        const baseReadmeUrl = 'https://api.github.com/repos/MichaelAkridge-NOAA/container-images/contents/images/';

        folders.forEach(folder => {
            const url = `${baseReadmeUrl}${folder}/README.md`;
            console.log("Fetching URL:", url); // Debugging URL

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to load README.md for ${folder}: Server responded with status ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (typeof marked !== 'function') {
                        console.error('marked library is not loaded or unavailable.');
                        return;
                    }
                    const content = atob(data.content); // Decode base64-encoded content
                    const markdownHtml = marked(content);
                    const container = document.createElement('div');
                    container.innerHTML = `<h2>README: ${folder}</h2>${markdownHtml}`;
                    document.getElementById('readmeContainer').appendChild(container);
                })
                .catch(error => {
                    console.error('Error:', error);
                    document.getElementById('readmeContainer').innerHTML += `<p>Error loading the README for ${folder}: ${error.message}</p>`;
                });
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
