# Play X Play Server

## Running server locally for development
1) Install node
2) Clone the project

In the project directory: 
3) npm install
4) npm start

## Managing the EC2 Free Tier play-x-play-server

NOTE: We use PM2 (https://www.npmjs.com/package/pm2) to manage the server.  PM2 runs at boot and is configured to
auto-start the server.

todo: test this with a reboot test 


### Logging in to the server 
```bash
ssh -i desmond.pem ubuntu@ec2-35-166-35-105.us-west-2.compute.amazonaws.com
```

Once logged in...

### Starting the play-x-play-server instance
todo:


 
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
```bash
ssh -i desmond.pem ubuntu@ec2-35-166-35-105.us-west-2.compute.amazonaws.com
```


Once logged-in...

### Install Node
```bash
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
```

### Install play-x-play server
```bash
git clone https://github.com/desmond-grey/play-x-play-server.git
cd play-x-play-server
npm install
npm start       # temp just to see if the server is installed.  We'll actually use pm2 to manage the server

# curl the server's public IP address from a different machine to see if it's running.  curl ec2-35-166-35-105.us-west-2.compute.amazonaws.com:3000/health

# stop the server (cntrl-c)
```

### Install pm2 and start server using it
```bash
sudo npm install pm2 -g
sudo pm2 startup                # pm2 will auto-start at boot
sudo pm2 start ./bin/www        # todo: would be better to use "npm start" which is configured to call ./bin/www
```



## Curl Examples
Change the IP address in the examples below to that of your server:

```shell script
# checking health
curl 172.16.0.16:3000/health
curl ec2-35-166-35-105.us-west-2.compute.amazonaws.com:3000/health



# starting a game
curl -d '{ "tableId": "prototype_controller", "players": ["rojo", "azul"]}' -H "Content-Type: application/json" -X POST 172.16.0.16:3000/ping-pong/game

# scoring a point
curl \
  -d '{"eventType": "POINT_SCORED_AT_TABLE_POSITION", "tableId": "prototype_controller", "tablePosition": 2}' \
  -H "Content-Type: application/json" \
  -X POST \
  172.16.0.16:3000/ping-pong/tables/proto/events
```
