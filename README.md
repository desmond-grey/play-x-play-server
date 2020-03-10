# Play X Play Server

## Running server locally for development
1) Install node
2) Clone the project

In the project directory: 
3) npm install
4) npm start


## Curl Examples
Change the IP address in the examples below to that of your server:

```shell script
# checking health
curl 172.16.0.16:3000/health

# starting a game
curl -d '{ "tableId": "prototype_controller", "players": ["rojo", "azul"]}' -H "Content-Type: application/json" -X POST 172.16.0.16:3000/ping-pong/game

# scoring a point
curl \
  -d '{"eventType": "POINT_SCORED_AT_TABLE_POSITION", "tableId": "prototype_controller", "tablePosition": 2}' \
  -H "Content-Type: application/json" \
  -X POST \
  172.16.0.16:3000/ping-pong/tables/proto/events
```
