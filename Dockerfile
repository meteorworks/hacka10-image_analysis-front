# docker build -t hacka10/server .

FROM alpacadb/labellio-caffe-image

RUN apt-get -y update

RUN apt-get install -y python-software-properties

RUN apt-get -y upgrade

RUN apt-get -y install build-essential
RUN apt-get -y install git
RUN apt-get -y install curl

RUN add-apt-repository -y ppa:chris-lea/node.js
RUN echo "deb http://archive.ubuntu.com/ubuntu precise universe" >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y nodejs

# RUN apt-get -y install openssh-server
# RUN mkdir -p /var/run/sshd
# RUN useradd -d /home/k5m -m -s /bin/bash k5m
# RUN echo hogehoge:${your_pass} | chpasswd
# RUN echo 'hogepass ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# labellio_cli
RUN . /opt/caffe/caffe.bashrc
RUN sudo pip install -U labellio_cli

RUN apt-get -y install redis-server
RUN service redis-server start

#RUN curl -L git.io/nodebrew | perl - setup
#RUN echo 'export PATH=$HOME/.nodebrew/current/bin:$PATH' >> /root/.bashrc

#RUN . /root/.bashrc

#RUN echo 'nodebrew use default' >> /root/.bashrc


RUN mkdir -p /root/node-server/

#RUN nodebrew install-binary v4.3.1
#RUN nodebrew alias default v4.3.1
#RUN nodebrew use default

RUN cd node-server
RUN git clone git@bitbucket.org:meteorworks/gazou-server.git hacka10-server
RUN cd hacka10-server/
RUN npm i
RUN pm2 start process.js



EXPOSE 80

# Define working directory.
WORKDIR /data

# Define default command.
CMD ["bash"]
