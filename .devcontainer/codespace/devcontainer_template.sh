#!/bin/bash

# Construct the message
message="{
  \"name\": \"$1\",
  \"workspaceFolder\": \"/home/jovyan\",
  \"image\": \"ghcr.io/nmfs-opensci/container-images/$1:latest\",

  // Ports to be forwarded from the container to the host
  \"forwardPorts\": [8889],
  \"portsAttributes\": {
    \"8889\": {
      \"label\": \"Jupyter Lab\",
      \"onAutoForward\": \"notify\"
    }
  },
  
  // Create a README that is automatically opened in preview mode
  // the echo bit is to fix pwd in bash terminal in RStudio
  \"postCreateCommand\": \"echo '[![](https://img.shields.io/badge/Open%20Jupyter%20Lab-37a779?style=for-the-badge)](https://'\${CODESPACE_NAME}'-8889.app.github.dev)' > README.md && echo 'PWD=/home/jovyan\ncd \${PWD}' >> ~/.bash_login\",

  // Start Jupyter Lab
  \"postStartCommand\": \"jupyter lab --ip=0.0.0.0 --port=8889 --allow-root --no-browser --notebook-dir=/home/jovyan --NotebookApp.token='' --NotebookApp.password=''\",
}"

echo "$message" > ./.devcontainer/$1/devcontainer.json