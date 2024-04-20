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
        const url = `https://api.github.com/repos/MichaelAkridge-NOAA/container-images/contents/images/${folder}/README.md`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const content = atob(data.content);
                const markdownHtml = marked(content);
                document.getElementById('readmeContainer').innerHTML = `<h2>README: ${folder}</h2>${markdownHtml}`;
            });
    }
});
