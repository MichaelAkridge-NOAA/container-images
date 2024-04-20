document.addEventListener('DOMContentLoaded', function() {
    const folders = ['arcgis', 'coastwatch']; // List your folders here
    const baseRepoUrl = 'https://api.github.com/repos/MichaelAkridge-NOAA/container-images/contents/images/';

    folders.forEach(folder => {
        fetch(`${baseRepoUrl}${folder}/README.md`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load resource: The server responded with a status of ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                if (data.content) {
                    const content = atob(data.content); // Decode base64-encoded content
                    const container = document.createElement('div');
                    container.innerHTML = `<h2>README: ${folder}</h2><pre>${content}</pre>`;
                    document.getElementById('readmeContainer').appendChild(container);
                }
            })
            .catch(error => {
                console.error('Error loading the README:', error);
                const errorContainer = document.createElement('div');
                errorContainer.innerHTML = `<h2>Error loading README for ${folder}</h2><p>${error.message}</p>`;
                document.getElementById('readmeContainer').appendChild(errorContainer);
            });
    });
});

