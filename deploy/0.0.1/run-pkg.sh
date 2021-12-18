# cd packages/app && yarn pkg
# mv pkg/* ../../deploy/0.0.1/
# cd ../../
docker-compose -f deploy/0.0.1/docker-compose-pkg.yml up -d --build