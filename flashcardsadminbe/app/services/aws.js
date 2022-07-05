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

exports.uploadDb = function (path, fileName) {
  return new Promise(async (resolve, reject) => {
    try {
      const fileContent = fs.readFileSync(path + fileName);
      const params = {
        Bucket: awsConfigs.DBBACKUP_BUCKET_NAME,
        Key: fileName,
        Body: fileContent
      }
      let r = await s3.upload(params).promise();
      resolve(r)
    } catch (e) {
      reject(e)
    }
  })
}

exports.downloadDb = function (localPath, fileName) {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: awsConfigs.DBBACKUP_BUCKET_NAME,
        Key: fileName
      }
      let r = await s3.getObject(params, (err, data) => {
        if (err && err.code === 'NoSuchKey') {
          return resolve(false)
        }
        if (data && data.Body) {
          fs.writeFileSync(localPath + fileName, data.Body.toString());
          console.log(`${localPath + fileName} has been created!`);
        }
      }).promise()
      resolve(r)
    } catch (e) {
      reject(e)
    }
  })
}
