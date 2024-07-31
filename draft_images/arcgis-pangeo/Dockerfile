FROM pangeo/base-image:2023.01.13
# pangeo base will look for environment.yml and apt.txt and install

# Install Node.js and npm
USER root
RUN apt-get update && apt-get install -y nodejs npm

# Check installations
RUN node -v && npm -v

# activate notebook env that pangeo base creates
RUN conda init zsh && conda init bash

USER ${NB_USER}

# Check if jupyter lab is available
RUN jupyter lab --version

# Install Jupyter Lab extensions separately for debugging
RUN jupyter labextension install @jupyter-widgets/jupyterlab-manager@2
RUN jupyter labextension install arcgis-map-ipywidget@2.0.0

WORKDIR ${HOME}