const AWS = require("aws-sdk");
const fs = require("fs");
const sharp = require("sharp");
require("dotenv").config({ path: "../config/.env" });

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

//pour upload first image profil
module.exports.uploadImageProfilToS3 = async (file, id) => {
  //redimensionné
  console.log("=====haha id==============================");
  console.log(id);
  console.log("=========hihi id===========================");
  const resizeImage = await sharp(file.buffer).resize(1080, 1080).toBuffer();
  //le nome de l'image a modifié(id user)
  const nameUploadImg = id.toString();
  const params = {
    Bucket: "toapilod",
    Key: `api-profil-${nameUploadImg}.jpg`,
    // Body: fs.createReadStream(file.path), //quand on stock dans le server on cherche dans path
    //Body: file.buffer, //no stock server dans on cherche dans le buffer
    Body: resizeImage, //pour envoyé l'image redimentionné
    ContentType: file.mimetype,
  };
  // console.log("début params ;;;");
  // console.log(params);
  // console.log("fin params ;;;");

  return await s3.upload(params).promise();
};

//delete un objet du bucket
module.exports.deleteImageProfilS3 = async (id) => {
  const params = {
    Bucket: "toapilod",
    Key: `api-profil-${id}.jpg`,
  };
  return await s3.deleteObject(params).promise();
};

//pour upload first image POSTS
module.exports.uploadImgPostToS3 = async (file, id) => {
  //redimensionné
  const resizeImgPost = await sharp(file.buffer).resize(1080, 1080).toBuffer();
  const idString = id.toString();
  const params = {
    Bucket: "toapilod",
    Key: `api-projet-${idString}.jpg`,
    Body: resizeImgPost,
    ContentType: file.mimetype,
  };
  return await s3.upload(params).promise();
};
//delete un objet du bucket pour le POST
module.exports.deleteImageProjetS3 = async (id) => {
  const params = {
    Bucket: "toapilod",
    Key: `api-projet-${id}.jpg`,
  };
  return await s3.deleteObject(params).promise();
};
