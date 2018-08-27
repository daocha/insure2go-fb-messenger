basename="$(dirname $0)"
cd $basename
source ./envvars.txt

local_folder=$SIFTCHATBOT_LOCAL_FOLDER
remote_folder=$SIFTCHATBOT_REMOTE_FOLDER
remote_server=$SIFTCHATBOT_REMOTE_SERVER
rsa_key=$SIFTCHATBOT_REMOTE_SERVER_RSA_KEY
app_name="siftchatbot"
app_image_name="$SIFTCHATBOT_APP_PREFIX/$app_name"

# build apps
echo "[Docker-compose buiding apps]"
docker-compose -f ./docker-compose-webhook.yml build

# dump all images
echo "[Dump all images to folder $local_folder]"
./docker-all-images.sh save $local_folder

# transfer all images to server
echo "[Transferring files to test server: $remote_server]"
scp -i $rsa_key $local_folder/$SIFTCHATBOT_APP_PREFIX/*.dim $remote_server:$remote_folder/$SIFTCHATBOT_APP_PREFIX/

# transfer scripts to server
scp -i $rsa_key ./docker-compose-webhook.yml $remote_server:$remote_folder/
scp -i $rsa_key ./envvars.txt $remote_server:$remote_folder/
scp -i $rsa_key ./docker-compose-webhook-startup.sh $remote_server:$remote_folder/
scp -i $rsa_key ./docker-all-images.sh $remote_server:$remote_folder/

# execute scripts on server
ssh -i $rsa_key $remote_server $remote_folder/docker-compose-webhook-startup.sh
