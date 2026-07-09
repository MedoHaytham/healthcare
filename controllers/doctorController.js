const handelarfactory=require("./handlerFactory");
const Doctor=require("../models/Doctors");

exports.getAllDoctors=handelarfactory.getAll(Doctor,["name","specialization","rating"]);
exports.getDoctor=handelarfactory.getOne(Doctor);
exports.addDoctor=handelarfactory.createOne(Doctor);
exports.updateDoctor=handelarfactory.updateOne(Doctor);
exports.deleteDoctor=handelarfactory.deleteOne(Doctor);