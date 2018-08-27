# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

FROM node:8.11.3-alpine

LABEL sift.insure "Ray LI <ray@dcha.xyz>"

# Reset npm logging to default level.
ENV NPM_CONFIG_LOGLEVEL warn

COPY ./chatbox /app/chatbox

WORKDIR /app/chatbox

# Need to install extra dependencies for native modules.
RUN deluser --remove-home node && \
    addgroup -g 1000 app && \
    adduser -u 1000 -G app -s /bin/sh -D app && \
    npm install --production && \
    npm cache clean --force && \
    rm -rf /home/app/.config /home/app/.node-gyp /home/app/.npm

# Run as the composer user ID.
USER app

# Run supervisor to start the application.
CMD [ "node", "/app/chatbox/app.js" ]

# Expose port 1337
EXPOSE 1337
