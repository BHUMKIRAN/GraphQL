import Subject from "../models/subject.js";

export const addSubject = async (_, args) => {
  const subject = await Subject.findOne({ name: args.name });
  if (subject) {
    throw new Error("subject already exist");
  }
  const created = await Subject.create(args);
  return created;
};

export const deleteSubject = async (_, args) => {
  const deletedSubject = await Subject.findByIdAndDelete(args.id);

  if (!deletedSubject) {
    throw new Error("Subject not found");
  }

  return deletedSubject;
};

export const updateSubject = async (_, args) => {
  const { id, ...data } = args;

  const updateSubject = await Subject.findByIdAndUpdate(id, data, {
    new: true,
  }); //with new:true it return updated data
  return updateSubject;
};

export const getAllSubject = async () => {
  const subjects = await Subject.find();
  return subjects;
};
