//voir le nouveau cour from scratch pour le update à 1h5
const fs = require("fs");
const PostModel = require("../models/post.model");
const {
  uploadImageProfilToS3,
  deleteImageProjetS3,
} = require("../utils/aws.storage");
const ObjectID = require("mongoose").Types.ObjectId;
//pour affiché les post du récent au plus ancien on fait un sort({createAt: -1})

//get all posted "/allposted"
module.exports.getAllPosts = async (req, res) => {
  const posts = await PostModel.find();
  if (!posts) {
    res.status(400).send("Aucune publication n'a été trouvé ");
  } else {
    res.status(200).json(posts);
  }
};

//post an post "contents/add"
module.exports.postNew = async (req, res) => {
  const { posterid, projet, content, lien, skills, img } = req.body;
  if (!posterid) {
    return res.status(200).json({ error: "Erreur: Utilisateur inconnu" });
  }

  if (!projet || !content || !lien || !skills)
    return res
      .status(200)
      .json({ error: "Erreur : Veuillez remplir les champs nécéssaires" });

  try {
    if (!ObjectID.isValid(posterid))
      return res
        .status(200)
        .json({ error: "Erreur : Id du poster est inconnu : " + posterid });

    const newPost = await PostModel.create({
      posterId: posterid,
      projet,
      content,
      lien,
      skills,
    });
    if (img) {
      return res.status(200).json({ id: newPost._id });
    } else {
      return res
        .status(200)
        .json({ message: "Nouveau projet ajouté avec succès" });
    }
  } catch (error) {
    if (error.keyValue.projet)
      return res
        .status(200)
        .json({ error: `Erreur : Le nom ${projet} exist déjà` });
    if (error.keyValue.lien)
      return res
        .status(200)
        .json({ error: "Erreur : Ce lien a déjà été utilisé" });
    if (error.keyValue.picture)
      return res.status(200).json({ error: "Erreur : Photo double" });
    if (error.keyValue.image)
      return res.status(200).json({ error: "Erreur : Image double" });
    res.status(400).json(error);
  }
};

//update post avec :id "contents/:id" - put
module.exports.updatePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(200).json({
      message: `Le id suivant pour la modification : ${req.params.id} n'existe pas `,
    });
  }
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) {
      return res.status(200).json({ message: "Le post n'existe pas" });
    } else {
      const { projet, content, lien } = req.body;
      if (!projet || !content || !lien) {
        return res
          .status(200)
          .json({ error: "Des champs vident ne peuvent pas être envoyé" });
      } else {
        const updatePost = await PostModel.findByIdAndUpdate(post, req.body, {
          new: true,
        });
        res.status(200).json({ message: "Mise à jour effectuée" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

//post to delete avec :id "contents/:id" - delete
module.exports.deletePost = async (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(200).json({
        message: `Erreur : Le id suivant : ${req.params.id} n'existe pas `,
      });
    } else {
      const post = await PostModel.findById(req.params.id);
      if (!post) {
        return res
          .status(200)
          .json({ message: "Erreur : Le post n'existe pas" });
      } else {
        if (post.image.includes("defaultprofil")) {
          //si img par défau
          await post.remove();
          return res.status(200).json({
            message: "Suppréssion du post avec image par défaut avec succès",
          });
        } else {
          //avec img sur aws
          await deleteImageProjetS3(req.params.id)
            .then(async () => {
              await post.remove();
              return res
                .status(200)
                .json({ message: "Suppréssion du post lié a s3 avec succès " });
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(200)
                .json({ error: "Erreur lors de la suppréssion chez aws s3" });
            });
        }
        // const defaultImage = "/uploads/posts/defaultprofil.png";
        // if (post.image !== defaultImage) {
        //   //si on entre ici on supprime l'image
        //   fs.unlink(post.image, (err) => {
        //     if (err)
        //       return res
        //         .status(400)
        //         .json({ error: "Erreur lors de la suppréssion de l'image" });
        //   });
        // }
        // await post.remove();
        // res.status(200).json({ message: `Le post a été supprimé avec succès` });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

module.exports.updateImg = async (req, res) => {
  const post = await PostModel.findById(req.params.id);
  if (!post) return res.status(200).json({ error: "Id inconnu" });
  if (!req.file) {
    return res.status(200).json({ error: "Aucun fichier sélèctionné" });
  } else {
    post.image = req.file.path;
    console.log(post.image);
    if (!post.image)
      return res.status(200).json({ message: "Chemin image post non trouvé" });
    await post.save().then(() => {
      // uploadImageToGCS();
      return res.status(200).json({ message: "Mise à jour effectuée" });
    });
  }
};

//add image Amazon S3 AWS
module.exports.addImgAws = async (req, res) => {
  // console.log(req.file);
  try {
    await uploadImageProfilToS3(req.file);
    res.status(200).send("ok aws");
  } catch (error) {
    // console.log("debut error to s3");
    // console.log(error);
    // console.log("fin error to s3");
    res.status(200).send("Not ok so erreur aws");
  }
};
