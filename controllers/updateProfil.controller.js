const UserModel = require("../models/user.model");
const {
  uploadImageProfilToS3,
  deleteImageProfilS3,
} = require("../utils/aws.storage");

//add image Amazon S3 AWS
module.exports.addFirstImgAws = async (req, res) => {
  console.log(req.file);
  console.log("fin cosnole du image");
  console.log(req.body.user);
  const { id } = req.body;
  try {
    const user = await UserModel.findById(id);
    // console.log(userId);
    if (!id) return res.status(200).json({ error: `Id ${id} inconnu` });
    if (!req.file) {
      return res
        .status(200)
        .json({ error: "Erreur : Aucun fichier sélèctionné" });
    }
    // return res.status(200).send(`Trouvé : ${userId}`);
    try {
      await uploadImageProfilToS3(req.file, id);
      const imageUpload = `https://toapilod.s3.eu-central-1.amazonaws.com/api-profil-${id}.jpg`;
      if (!user.picture)
        return res
          .status(200)
          .json({ error: "Erreur : Chemin image introuvable" });
      // await user.save().then(() => {
      //   return res.status(200).send("Mongo et aws sont ok");
      // });
      //utilisé cette méthode pour update un champs spécifique, ici 'picture'
      await UserModel.updateOne(
        { _id: user._id },
        { $set: { picture: imageUpload } }
      );
      return res.status(200).json({ message: "Profil modifié avec succès" });
    } catch (error) {
      // console.log("debut error to s3");
      // console.log(error);
      return res
        .status(200)
        .json({ error: "Oups erreur lors du téléchargement au niveau de S3" });
    }
  } catch (error) {
    return res.status(200).json({ erreor: "Erreur : Id incorrect" });
  }
};

//delete image (objet) from s3 aws pour le profil not use
module.exports.deleteImgAws = async (req, res) => {
  const defautImg = "./uploads/profil/profil.png";
  const id = req.params.id;
  try {
    const select = await UserModel.findById(id);
    if (!select) return res.status(200).json({ message: "Image introuvable" });
    select.picture = defautImg;
    if (!select.picture)
      return res.status(200).send("Chemin dans la base de donnée introuvable");
    await select.save();
  } catch (error) {
    return res.status(400).send("Problème " + error);
  }
  // res.status(200).send(req.params);

  try {
    await deleteImageProfilS3(id);
    return res.status(200).send("Suppréssion réussie avec succès");
  } catch (error) {
    console.log(error);
    return res.status(200).send("Erreur de suppréssion" + error);
  }
};
