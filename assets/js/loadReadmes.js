document.addEventListener('DOMContentLoaded', function() {
    const folders = ['arcgis', 'coastwatch']; // List your folders here
    // Correct the base URL to point to the API 'contents' endpoint
    const baseRepoUrl = 'https://api.github.com/repos/MichaelAkridge-NOAA/container-images/contents/images/';

    folders.forEach(folder => {
        // Correctly fetch the README.md file from each folder
        fetch(`${baseRepoUrl}${folder}/README.md`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.content) {
                    const content = atob(data.content); // Decode base64
                    const container = document.createElement('div');
                    container.innerHTML = `<h2>${folder}</h2><pre>${content}</pre>`;
                    document.getElementById('readmeContainer').appendChild(container);
                }
            })
            .catch(error => console.error('Error loading the README:', error));
    });
});

