document.addEventListener('DOMContentLoaded', function() {
    const folders = ['arcgis', 'coastwatch']; // List your folders here
    const baseRepoUrl = 'https://api.github.com/repos/MichaelAkridge-NOAA/container-images/tree/main/images/';
    folders.forEach(folder => {
        fetch(`${baseRepoUrl}${folder}/README.md`)
            .then(response => response.json())
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
