document.addEventListener('DOMContentLoaded', function() {
    const baseRepoUrl = 'https://api.github.com/repos/MichaelAkridge-NOAA/container-images/contents/images';

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

    function loadReadmeFile(folder) {
        const baseReadmeUrl = 'https://api.github.com/repos/MichaelAkridge-NOAA/container-images/contents/images/';
        const url = `${baseReadmeUrl}${folder}/README.md`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    console.log(`README.md for ${folder} not found: Server responded with status ${response.status}`);
                    document.getElementById('readmeContainer').innerHTML += `<p>README not available for ${folder}.</p>`;
                    return null;
                }
                return response.json();
            })
            .then(data => {
                if (!data) return;
                try {
                    const content = atob(data.content); // Decode base64-encoded content
                    const markdownHtml = marked.parse(content); // Using marked.parse() based on latest API
                    const container = document.createElement('div');
                    container.innerHTML = `<h2>README: ${folder}</h2>${markdownHtml}`;
                    document.getElementById('readmeContainer').appendChild(container);
                } catch (error) {
                    console.error('Error using marked:', error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

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

