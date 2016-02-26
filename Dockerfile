# docker build -t hacka10/server .

FROM alpacadb/labellio-caffe-image

#RUN echo 8.8.8.8 > /etc/hosts; cat /etc/hosts
#RUN cat /etc/hosts

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get -y dist-upgrade

RUN apt-get -y install build-essential

RUN apt-get -y install software-properties-common
RUN apt-get -y install python-software-properties

RUN add-apt-repository -y ppa:chris-lea/node.js
RUN echo "deb http://archive.ubuntu.com/ubuntu precise universe" >> /etc/apt/sources.list
RUN apt-get -y update

RUN apt-get -y install git
RUN apt-get -y install curl

RUN apt-get -y install nodejs

# labellio_cli
RUN . /opt/caffe/caffe.bashrc
RUN sudo pip install -U labellio_cli

# redis-server
RUN apt-get -y install redis-server
RUN service redis-server start

# ssh準備
RUN mkdir /root/.ssh/

# private keyをコピー
ADD docker/id_rsa /root/.ssh/id_rsa

ADD docker/config /root/.ssh/config

# known_hosts設定
# Create known_hosts & Add bitbuckets key
RUN \
  touch /root/.ssh/known_hosts && \
  ssh-keyscan bitbucket.org >> /root/.ssh/known_hosts

RUN ssh-keygen -R 104.192.143.1

# NodeJS 準備
RUN mkdir -p /root/node-server/
RUN rm -rf /root/node-server/hacka10-server

RUN git clone git@bitbucket.org:meteorworks/gazou-server.git /root/node-server/hacka10-server

WORKDIR /root/node-server/hacka10-server/

RUN npm i
RUN npm i -g pm2
RUN pm2 start process.js

EXPOSE 80

# Define working directory.
#WORKDIR /data

# Define default command.
CMD ["bash"]

ENTRYPOINT /usr/bin/tail -f /dev/null
