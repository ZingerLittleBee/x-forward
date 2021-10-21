docker rmi -f app
docker rm -f app
docker build --no-cache -t app -f deploy/dockerfile .
docker run --privileged=true -d --name app -p 9000:9000 -p 9001:22 app