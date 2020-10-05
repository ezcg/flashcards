const AWS = require('aws-sdk');
const awsConfigs = require("../config/aws.config.js");
const fs = require('fs');

const s3 = new AWS.S3({
  accessKeyId: awsConfigs.ID,
  secretAccessKey: awsConfigs.SECRET
});

exports.uploadJson = (fileName) => {
  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync('/tmp/' + fileName);
    const params = {
      Bucket: awsConfigs.BUCKET_NAME,
      Key: 'json/' + fileName,
      Body: fileContent
    };
    s3.upload(params, function(err, data) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

exports.deleteJson = (fileName) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: awsConfigs.BUCKET_NAME,
      Key: 'json/' + fileName
    };
    s3.deleteObject(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(err);
      }
    });
  });
}

exports.saveDataToS3 = (data, fileName) => {
  return new Promise((resolve, reject) => {
    let json = JSON.stringify(data);
    fs.writeFile("/tmp/" + fileName, json, async function(err) {
      if(err) {
        reject({message: "Error writing " + fileName + " to local /tmp and did not push it to s3. " + err.message});
      } else {
        exports.uploadJson(fileName)
        .then(r => {
          resolve(true);
        }).catch(e => {
          reject({message: "Error writing " + fileName + " to s3. " + e.message});
        });
      }
    });
  });
}
