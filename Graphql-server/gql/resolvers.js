import {
  getAllUser,
  getUserById,
  deleteUserById,
  updateUserById,
  createUser,
} from "../controller/user.js";

import {
  addSubject,
  getAllSubject,
  deleteSubject,
  updateSubject,
} from "../controller/subject.js";

export const resolvers = {
  User: {
    id: (parent) => parent?._id,
  },

  Subject: {
    id: (parent) => parent?._id,
  },

  Query: {
    users: () => getAllUser(),
    userById: (_, args) => getUserById(_, args),
    subjects: () => getAllSubject(),
  },

  Mutation: {
    newUser: (_, args) => createUser(_, args),
    updateUser: (_, args) => updateUserById(_, args),
    deleteUser: (_, args) => deleteUserById(_, args),

    newSubject: (_, args) => addSubject(_, args),
    editSubject: (_, args) => updateSubject(_, args),
    deleteSubject: (_, args) => deleteSubject(_, args),
  },
};
