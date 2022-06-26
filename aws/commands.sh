#!/bin/bash

# Installing CodeDeploy Agent
sudo yum update
sudo yum install ruby

# Download the agent (replace the region)
wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto
sudo service codedeploy-agent status