#!/bin/bash

set -e

# check if we are root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  exit 1
fi

# Unfortunately, nodejs is installed in different places, need to find it
NODE=`which nodejs`
LOCAL=false

if [[ "${NODE}" =~ "/usr/local" ]]; then
	LOCAL=true
fi

# install archey
if [[ ${LOCAL} ]]; then
	su - pi -c "npm install -g archeyjs"
else
	npm install -g archeyjs
fi

# setup the service
ARCHEYJS_FILE="archeyjs.service"

if [[ ! -f "${ARCHEYJS_FILE}" ]]; then
	rm ${ARCHEYJS_FILE}
fi

ARCHEYJS=`which archeyjs`

SERVICE="\
[Service] \n                              \
ExecStart=${ARCHEYJS} \n     \
Restart=always \n                        \
StandardOutput=syslog\n                \
StandardError=syslog\n                \
SyslogIdentifier=archeyjs\n              \
User=pi\n                            \
Group=pi\n \
Environment=NODE_ENV=production\n \
\n \
[Install]\n \
WantedBy=multi-user.target\n"

# The -e makes echo respect the \n properly
echo -e ${SERVICE} > ${ARCHEYJS_FILE}

# copy
if [ ! -f "/etc/systemd/system/archeyjs.service" ]; then
  cp archeyjs.service /etc/systemd/system/
else
  echo "archeyjs already set up"
fi

# update and start
systemctl enable archeyjs
service archeyjs start
service archeyjs status
