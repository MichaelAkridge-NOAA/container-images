document.addEventListener('DOMContentLoaded', function() {
    const baseRepoUrl = 'https://api.github.com/repos/MichaelAkridge-NOAA/container-images/contents/images';

    fetch(baseRepoUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch directories: Server responded with status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const folders = data.filter(item => item.type === 'dir').map(item => item.name);
            loadReadmeFiles(folders);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('readmeContainer').innerHTML += `<p>Error fetching directory list: ${error.message}</p>`;
        });
});

function loadReadmeFiles(folders) {
    const baseReadmeUrl = 'https://api.github.com/repos/MichaelAkridge-NOAA/container-images/contents/images/';

    folders.forEach(folder => {
        fetch(`${baseReadmeUrl}${folder}/README.md`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load README.md for ${folder}: Server responded with status ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const content = atob(data.content); // Decode base64-encoded content
                const container = document.createElement('div');
                container.innerHTML = `<h2>README: ${folder}</h2><pre>${content}</pre>`;
                document.getElementById('readmeContainer').appendChild(container);
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('readmeContainer').innerHTML += `<p>Error loading the README for ${folder}: ${error.message}</p>`;
            });
    });
}

