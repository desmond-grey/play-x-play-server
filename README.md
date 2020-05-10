# Play X Play Server

## API

## Curl Examples
Change the IP address in the examples below to that of your server:

```shell script

# checking health
curl 172.16.0.16:3000/api/health
curl ec2-35-166-35-105.us-west-2.compute.amazonaws.com:3000/api/health

# starting a game
curl -d '{ "tableId": "prototype_controller", "players": ["rojo", "azul"]}' -H "Content-Type: application/json" -X POST localhost:3000/api/ping-pong/games
curl -d '{ "tableId": "prototype_controller", "players": ["rojo", "azul"]}' -H "Content-Type: application/json" -X POST 172.16.0.16:3000/api/ping-pong/games
curl -d '{ "tableId": "prototype_controller", "players": ["rojo", "azul"]}' -H "Content-Type: application/json" -X POST ec2-35-166-35-105.us-west-2.compute.amazonaws.com:3000/api/ping-pong/games

# getting gameSate by tableId
curl -i localhost:3000/api/ping-pong/tables/prototype_controller/game
curl -i 172.16.0.16:3000/api/ping-pong/tables/prototype_controller/game
curl -i ec2-35-166-35-105.us-west-2.compute.amazonaws.com:3000/api/ping-pong/tables/prototype_controller/game

# scoring a point on a table by table-position
curl \
  -d '{"eventType": "POINT_SCORED_ON_TABLE", "tablePosition": 2}' \
  -H "Content-Type: application/json" \
  -X POST \
  172.16.0.16:3000/api/ping-pong/tables/prototype_controller/events

# scoring a point for a player
curl \
  -d '{"eventType": "POINT_SCORED_BY_PLAYER", "playerId": "azul"}' \
  -H "Content-Type: application/json" \
  -X POST \
  172.16.0.16:3000/api/ping-pong/tables/proto/events
```


## Running server locally for development
1) Install node
2) Clone the project

In the project directory: 
3) npm install
4) npm start


## Managing the public play-x-play-server
The server:
* runs on a free-tier AWS EC2 instance
* runs Ubuntu 18.04.3 LTS as the OS
* runs Node 13.10
* uses PM2 to manage server (https://www.npmjs.com/package/pm2)

NOTE: PM2 runs at boot and is configured to auto-start the express js server.


### Logging in to the server 
Password authentication is disabled.  You'll need to generate a key-pair that has access to the server.  Talk to an
existing admin for access.

```shell script
# once you have a associated with the server and download, an ssh command looks like this:
# (command below assumes you run from within the play-x-play-server dir and that play-x-play dir is a sibling of that dir)
ssh -i ../play-x-play/desmond.pem ubuntu@ec2-35-166-35-105.us-west-2.compute.amazonaws.com
```

Once logged in...

### deploying a new build
```shell script
cd ./play-x-play-server
git pull
npm install
sudo pm2 restart www 

```

### Managing the play-x-play-server instance
```shell script
sudo pm2 list               # list all the PM2 managed apps, which in our case is just our ExpressJS app named "www"
sudo pm2 describe www       # more details
sudo pm2 stop www
sudo pm2 restart www
sudo pm2 delete www         # remove from PM2 management
sudo pm2 start ./bin/www
sudo pm2 monit              # monitor logs, custom metrics, application information  
```


## Setting up a Free Tier AWS Server

### Create and configure an EC2 Instance

* Create an EC2 Instance
* Use the Free-Tier instance size
* Choose Ubuntu Server AMI
* Generate a PEM
* Launch AMI
* In the Security Group associated with the server, allow inbound traffic on http (80), https (443) and custom port 3000

### Login to the EC2 Instance
NOTE: Ensure your pem file (created above) is chmod 400 on your local system (ssh will refuse to us it if its not).

Login using PEM created during EC2 instantiation:
```shell script
ssh -i desmond.pem ubuntu@ec2-35-166-35-105.us-west-2.compute.amazonaws.com
```

Once logged-in...

### Install Node
```shell script
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
```

### Install play-x-play server
```shell script
git clone https://github.com/desmond-grey/play-x-play-server.git
cd play-x-play-server
npm install
npm start       # temp just to see if the server is installed.  We'll actually use pm2 to manage the server

# curl the server's public IP address from a different machine to see if it's running.  curl ec2-35-166-35-105.us-west-2.compute.amazonaws.com:3000/health

# stop the server (cntrl-c)
```

### Install pm2 and start server using it

Note: I installed pm2 with sudo.  I tried it without (per the docs) but had permission problems.  Looks like this means
all subsequent pm2 commands also require sudo.

```shell script
sudo npm install pm2 -g
sudo pm2 startup                # pm2 will auto-start at boot
sudo pm2 start ./bin/www        # todo: would be better to use "npm start" which is configured to call ./bin/www
sudo pm2 save                   # ./bin/www will now be started during pm2 startup (at boot)
```