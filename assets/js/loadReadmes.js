fetch('packages.json')
  .then(response => response.json())
  .then(data => {
    const navList = document.getElementById('packageList'); // Ensure this ID matches with your HTML

    data.forEach(pkg => {
      const parts = pkg.name.split('/'); // Splits the 'name' into parts
      const folderName = parts[parts.length - 1]; // Gets the last part which should be the folder name
      const readmeUrl = `https://michaelakridge-noaa.github.io/images/${folderName}`; // Correctly constructs the URL

      const listItem = document.createElement('li');
      listItem.className = 'nav-item'; // Adds Bootstrap or your custom class for styling
      const link = document.createElement('a');
      link.href = readmeUrl;
      link.className = 'nav-link'; // Adds Bootstrap or your custom class for styling
      link.textContent = folderName; // Displays the folder name as the link text
      listItem.appendChild(link);
      navList.appendChild(listItem); // Appends the list item to the navigation list
    });
  })
  .catch(error => console.error('Failed to load packages:', error));

