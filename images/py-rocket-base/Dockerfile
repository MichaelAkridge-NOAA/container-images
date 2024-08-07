# tidyverse + texlive rocker with RStudio
# adding this line to test action workflow
# test 2
# test 3
# Is designed to have a conda environment called notebook like
# the pangeo images. The jupyterhub modules are in this environment.
FROM rocker/verse:4.4
LABEL org.opencontainers.image.maintainers="eli.holmes@noaa.gov"
LABEL org.opencontainers.image.author="eli.holmes@noaa.gov"
LABEL org.opencontainers.image.source=https://github.com/nmfs-opensci/container-images/py-rocket-base
LABEL org.opencontainers.image.description="Tidyverse based R image with Python"
LABEL org.opencontainers.image.licenses=Apache2.0

ENV CONDA_ENV=notebook \
    DEBIAN_FRONTEND=noninteractive \
    NB_USER=rstudio \
    SHELL=/bin/bash \
    # Setup locale to be UTF-8, avoiding gnarly hard to debug encoding errors
    LANG=C.UTF-8  \
    LC_ALL=C.UTF-8 \
    CONDA_DIR=/srv/conda

# All env vars that reference other env vars need to be in their own ENV block
# Path to the python environment where the jupyter notebook packages are installed
ENV NB_PYTHON_PREFIX=${CONDA_DIR}/envs/${CONDA_ENV} \
    # Home directory of our non-root user
    HOME=/home/jovyan

USER root

## Change the home directory to /home/jovyan for the rstudio user
## So that /home/jovyan is consistently the user directory in JupyterHubs
## Note the home directory will be wiped out in a JupyterHub but
## needs to be created in the image in case it is used outside a JHub
RUN usermod -aG sudo ${NB_USER} && chown -R ${NB_USER}:${NB_USER} /srv
RUN mkdir /home/jovyan \
    && usermod -d /home/jovyan rstudio \
    && chown -R "${DEFAULT_USER}:${DEFAULT_USER}" "/home/jovyan" \
    && cp -r /home/rstudio /home/jovyan

# Add both our notebook env as well as default conda installation to $PATH
# Thus, when we start a `python` process (for kernels, or notebooks, etc),
# it loads the python in the notebook conda environment, as that comes
# first here.
ENV PATH=${NB_PYTHON_PREFIX}/bin:${CONDA_DIR}/bin:${PATH}

# Ask dask to read config from ${CONDA_DIR}/etc rather than
# the default of /etc, since the non-root jovyan user can write
# to ${CONDA_DIR}/etc but not to /etc
ENV DASK_ROOT_CONFIG=${CONDA_DIR}/etc

## Ensure that RStudio uses the conda notebook env for Python and modules
RUN echo "PATH=${PATH}" >>"${R_HOME}/etc/Renviron.site"

## Ensure that user library exists
RUN echo "dir.create(Sys.getenv('R_LIBS_USER'), recursive = TRUE, showWarnings = FALSE)" >> "${R_HOME}/etc/Rprofile.site"

# bin to PATH earlier ($NB_PYTHON_PREFIX/bin)
RUN echo ". ${CONDA_DIR}/etc/profile.d/conda.sh ; conda activate ${CONDA_ENV}" > /etc/profile.d/init_conda.sh

USER ${NB_USER}

COPY --chown=rstudio:rstudio . /tmp/build

WORKDIR /tmp/build

# Install latest mambaforge in ${CONDA_DIR}
RUN echo "Installing Mambaforge..." \
    && URL="https://github.com/conda-forge/miniforge/releases/latest/download/Mambaforge-Linux-x86_64.sh" \
    && wget --quiet ${URL} -O installer.sh \
    && /bin/bash installer.sh -u -b -p ${CONDA_DIR} \
    && rm installer.sh \
    && ${CONDA_DIR}/bin/mamba clean -afy \
    # After installing the packages, we cleanup some unnecessary files
    # to try reduce image size - see https://jcristharif.com/conda-docker-tips.html
    && find ${CONDA_DIR} -follow -type f -name '*.a' -delete \
    && find ${CONDA_DIR} -follow -type f -name '*.pyc' -delete

RUN echo "Checking for 'conda-linux-64.lock' or 'environment.yml'..." \
        ; if test -f "conda-linux-64.lock" ; then \
        ${CONDA_DIR}/bin/mamba create --name ${CONDA_ENV} --file conda-linux-64.lock \
        ; elif test -f "environment.yml" ; then \
        ${CONDA_DIR}/bin/mamba env create --name ${CONDA_ENV} -f environment.yml  \
        ; else echo "No conda-linux-64.lock or environment.yml! *creating default env*" ; \
        ${CONDA_DIR}/bin/mamba create --name ${CONDA_ENV} pangeo-notebook \
        ; fi \
        && ${CONDA_DIR}/bin/mamba clean -yaf \
        && find ${CONDA_DIR} -follow -type f -name '*.a' -delete \
        && find ${CONDA_DIR} -follow -type f -name '*.pyc' -delete \
        && find ${CONDA_DIR} -follow -type f -name '*.js.map' -delete \
        ; if [ -d ${NB_PYTHON_PREFIX}/lib/python*/site-packages/bokeh/server/static ]; then \
        find ${NB_PYTHON_PREFIX}/lib/python*/site-packages/bokeh/server/static -follow -type f -name '*.js' ! -name '*.min.js' -delete \
        ; fi

# RUN pip install jupyter-rsession-proxy

# some git preferences
RUN git config --global pull.rebase false && \
    git config --global credential.helper store


WORKDIR ${HOME}

EXPOSE 8888

CMD ["jupyter", "lab", "--ip=0.0.0.0", "--port=8888", "--allow-root", "--no-browser"]
