import User from "../models/users.js";
import bcrypt from "bcrypt";

export const getAllUser = async () => await User.find().populate("subjects");
export const createUser = async (_, args) => {
  const checkUser = await User.findOne({ email: args.email });
  const hashedPassword = await bcrypt.hash(args.password, 10);

  args.password = hashedPassword;

  if (checkUser) {
    throw new Error("user already exists");
  }
  const created = await User.create(args);
  const res = await User.findById(created._id).populate("subjects");
  return res;
};
export const getUserById = async (_, args) => {
  if (!args.id) throw new Error("id is required");
  const res = await User.findById(args.id).populate("subjects");
  return res;
};
export const deleteUserById = async (_, args) => {
  if (!args.id) throw new Error("id is required");

  const res = await User.findByIdAndDelete(args.id);
  if (!res) throw new Error("user not found");
  return res;
};

export const updateUserById = async (_, args) => {
  const { id, ...data } = args;
  if (!id) throw new Error("id is required");
  if (Object.keys(data).length === 0) throw new Error("No fields to update");

  if (typeof data.password === "string" && data.password.trim() === "") {
    delete data.password;
  }

  if (typeof data.password === "string") {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const res = await User.findByIdAndUpdate(id, data, {
    new: true,
  }).populate("subjects");
  if (!res) throw new Error("user not found");

  return res;
};
