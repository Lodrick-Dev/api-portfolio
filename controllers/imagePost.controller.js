const PostModel = require("../models/post.model");
const { uploadImgPostToS3 } = require("../utils/aws.storage");
module.exports.addImagePost = async (req, res) => {
  //   return res.status(200).send("blbabla");
  //traitement pour vérifié si les élément existent
  //   console.log(req.body);
  // const { name, id } = req.body;
  const { id } = req.body;
  //   return;
  let post;
  try {
    post = await PostModel.findById(req.body.id);
    if (!post) return res.status(200).json({ error: `${post._id} inconnu` });
    if (!req.file)
      return res
        .status(200)
        .json({ error: "Erreurrrr : Aucun fichier séléctionnée" });
  } catch (error) {
    return res.status(200).send(error);
  }

  //traitement pour s3 et envoyé le lien dans la data base
  //   return res.status(200).send("error ici");
  try {
    await uploadImgPostToS3(req.file, id);
    const nameImage = `https://toapilod.s3.eu-central-1.amazonaws.com/api-projet-${id}.jpg`;
    if (!post.image)
      return res
        .status(200)
        .json({ error: "Erreur : Chemin de sauvegarde introuvable" });

    // console.log(post);
    await PostModel.updateOne(
      { _id: post._id },
      { $set: { image: nameImage } }
    );
    return res
      .status(200)
      .json({ message: "Nouveau projet avec son image ajouté avec succès " });
  } catch (error) {
    console.log("===============Ici=====================");
    console.log(error);
    console.log("================Ici du fin ====================");
    return res.status(200).json({ error: "Erreurr : Not ok Erreur" });
  }
};
