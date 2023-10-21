const SkillModel = require("../models/skill.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getskills = async (req, res) => {
  const skills = await SkillModel.find();
  if (skills) res.status(200).json(skills);
  else return res.status(200).send("rien frère");
};
module.exports.postSkill = async (req, res) => {
  const { label, name } = req.body;

  if (!label || !name)
    return res
      .status(200)
      .json({ message: "Erreur : Veuillez remplir les champs nécéssaires" });

  try {
    const newlabel = label.toLowerCase();
    const newSkill = await SkillModel.create({
      label: newlabel,
      name,
    });
    //si on veut on renvoi newskill en json
    res.status(200).json({ message: "Nouvelle compétence ajoutée" });
  } catch (error) {
    const errorCatch = error.keyValue.name;
    if (error.keyValue.name)
      return res
        .status(200)
        .json({ error: `Erreur : Oups ${errorCatch} existe déjà ! ` });
    res.status(400).send(error);
  }
};

//update
module.exports.update = async (req, res) => {
  const { label, name } = req.body;

  if (!label || !name)
    return res
      .status(200)
      .json({ message: "Veuillez remplir les champs nécéssaires" });

  if (!ObjectID.isValid(req.params.id))
    return res.status(200).json({ message: "Compétence introuvable" });

  try {
    const skill = await SkillModel.findById(req.params.id);
    if (!skill)
      return res.status(200).json({ message: "Compétence n'existe pas" });
    else {
      const updateSkill = await SkillModel.findByIdAndUpdate(skill, req.body, {
        new: true,
      });
      res.status(200).json({ message: "Compétence a été modifiée" });
    }
  } catch (error) {
    console.log(error);
  }
};

//dekete
module.exports.delete = async (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id))
      return res.status(200).json({ error: "Erreur : Objet introuvable" });
    else {
      const skill = await SkillModel.findById(req.params.id);
      if (!skill)
        return res.status(200).json({ error: "Erreur : Objet inconnu" });
      else await skill.remove();
      res
        .status(200)
        .json({ message: "Compétence " + skill.name + " a été supprimée" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
