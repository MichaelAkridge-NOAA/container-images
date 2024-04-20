document.addEventListener('DOMContentLoaded', function() {
    const folders = ['arcgis', 'coastwatch']; // List of folders that contain the README.md
    const baseRepoUrl = 'https://api.github.com/repos/MichaelAkridge-NOAA/container-images/contents/images/';

    folders.forEach(folder => {
        // Constructing the URL properly using the 'contents' endpoint
        const url = `${baseRepoUrl}${folder}/README.md`;

        fetch(url)
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
});

