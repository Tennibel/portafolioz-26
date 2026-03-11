#!/bin/bash
set -e

# === CONFIGURAR ANTES DE USAR ===
SERVER="root@76.13.110.57"
REMOTE_DIR="/home/deploy/docker/portafolioz"
# ================================

echo "==> Building Docker image locally..."
docker build --platform linux/amd64 -t portafolioz:latest .

echo "==> Saving image..."
docker save portafolioz:latest | gzip > /tmp/portafolioz.tar.gz

echo "==> Uploading to server..."
rsync -avz --progress /tmp/portafolioz.tar.gz $SERVER:/tmp/

echo "==> Loading image on server..."
ssh $SERVER "docker load < /tmp/portafolioz.tar.gz && rm /tmp/portafolioz.tar.gz"

echo "==> Copying compose file..."
rsync -avz docker-compose.prod.yml $SERVER:$REMOTE_DIR/docker-compose.yml

echo "==> Restarting container..."
ssh $SERVER "cd $REMOTE_DIR && docker compose down && docker compose up -d"

echo "==> Cleaning up local temp file..."
rm /tmp/portafolioz.tar.gz

echo ""
echo "==> Deploy complete!"
echo "==> Check logs: ssh $SERVER 'docker logs portafolioz'"
