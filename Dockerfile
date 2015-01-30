FROM node

MAINTAINER Shaunak Kashyap <ycombinator@gmail.com>

RUN apt-get update && \
    apt-get install -qq node && \
    useradd -m -s /bin/bash rho

USER rho
ENV HOME /home/rho
ENV SHELL /bin/bash
ENV USER rho

RUN npm install -g cloudpipe-runner

WORKDIR /home/rho
CMD ["cloudpipe-node-runner"]
