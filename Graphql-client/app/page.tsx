"use client"
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_USERS,
  GET_SUBJECTS,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
  ADD_SUBJECT,
  DELETE_SUBJECT,
} from "@/components/graphql/gqlQuery";

// ====================== Types ======================
type Subject = {
  id: string;
  name: string;
};

type UserRow = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  subjects?: Subject[] | null;
};

type UserFormState = {
  id: string;
  name: string;
  email: string;
  password: string;
  image: string;
  subjects: string[]; // Stores IDs of selected subjects
};

const getErrorMessage = (err: unknown) =>
  err instanceof Error ? err.message : String(err);



export default function UserSubjectManagement() {
  // ====================== Queries ======================
  /**
   * useQuery returns an OBJECT { data, loading, error, refetch }
   * Renaming is used (e.g., data: userData) to distinguish between the two fetches.
   */
  const {
    data: userData,
    loading: loadingUsers,
    error: userError,
    refetch: refetchUsers,
  } = useQuery<{ users: UserRow[] }>(GET_USERS);

  const {
    data: subjectData,
    loading: loadingSubjects,
    error: subjectError,
    refetch: refetchSubjects,
  } = useQuery<{ subjects: Subject[] }>(GET_SUBJECTS);

  // ====================== Mutations ======================
  /**
   * useMutation returns an ARRAY [mutateFunction]
   * The first element is the function we call to trigger the API.
   */
  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);
  const [addSubject] = useMutation(ADD_SUBJECT);
  const [deleteSubject] = useMutation(DELETE_SUBJECT);

  // ====================== State ======================
  const initialUserForm: UserFormState = {
    id: "",
    name: "",
    email: "",
    password: "",
    image: "",
    subjects: [],
  };

  const [userForm, setUserForm] = useState<UserFormState>(initialUserForm);
  const [subjectForm, setSubjectForm] = useState({ name: "" });

  // ====================== Handlers ======================

  // Handles text input changes for the User form
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handles the multi-select dropdown for subjects
  const handleSubjectsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Array.from turns the selected HTMLOptions into a clean array of IDs
    const values = Array.from(e.target.selectedOptions, (option) => option.value);
    setUserForm((prev) => ({ ...prev, subjects: values }));
  };

  // Handles text input changes for the Subject form
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubjectForm({ name: e.target.value });
  };

  // Creates or Updates a user
  const handleCreateOrUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (userForm.id) {
        // Logic for Update
        const variables: {
          id: string;
          name: string;
          email: string;
          password?: string;
          image: string;
          subjects: string[];
        } = { ...userForm };
        // If password is empty string, don't send it to the backend
        if (!userForm.password.trim()) delete variables.password;
        await updateUser({ variables });
      } else {
        // Logic for Create
        await createUser({ variables: userForm });
      }
      setUserForm(initialUserForm);
      refetchUsers(); // Refresh UI
    } catch (err: unknown) {
      alert(getErrorMessage(err));
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteUser({ variables: { id } });
      refetchUsers();
    } catch (err: unknown) {
      alert(getErrorMessage(err));
    }
  };

  // Populates the form with existing user data for editing
  const handleSelectUser = (user: UserRow) => {
    setUserForm({
      id: user.id,
      name: user.name,
      email: user.email,
      password: "", // Leave password blank for security/UI
      image: user.image ?? "",
      subjects: user.subjects?.map((s) => s.id) || [],
    });
  };

  const handleAddSubject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!subjectForm.name) return alert("Enter subject name");
    try {
      await addSubject({ variables: { name: subjectForm.name } });
      setSubjectForm({ name: "" });
      refetchSubjects();
    } catch (err: unknown) {
      alert(err);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!window.confirm("Delete this subject?")) return;
    try {
      await deleteSubject({ variables: { id } });
      refetchSubjects();
    } catch (err: unknown) {
      alert(getErrorMessage(err));
    }
  };

  // ====================== Render Logic ======================
  if (loadingUsers || loadingSubjects) return <p className="p-8 text-amber-600 animate-pulse">Loading data...</p>;
  if (userError) return <p className="text-red-500">User Error: {userError.message}</p>;
  if (subjectError) return <p className="text-red-500">Subject Error: {subjectError.message}</p>;

  return (
    <div className="p-8 font-sans max-w-6xl mx-auto bg-white min-h-screen text-gray-900">

      {/* ===== User Management Section ===== */}
      <h2 className="text-3xl font-extrabold mb-6 text-gray-800 border-b-2 border-amber-500 inline-block">User Management</h2>

      <form onSubmit={handleCreateOrUpdateUser} className="mb-10 p-6 bg-gray-50 rounded-xl shadow-md flex flex-col gap-4 max-w-lg border border-gray-200">
        <input name="name" placeholder="Full Name" value={userForm.name} onChange={handleUserChange} required className="border p-2 rounded focus:ring-2 focus:ring-amber-500 outline-none" />
        <input name="email" type="email" placeholder="Email Address" value={userForm.email} onChange={handleUserChange} required className="border p-2 rounded focus:ring-2 focus:ring-amber-500 outline-none" />
        <input name="password" type="password" placeholder={userForm.id ? "New Password (Optional)" : "Password"} value={userForm.password} onChange={handleUserChange} required={!userForm.id} className="border p-2 rounded focus:ring-2 focus:ring-amber-500 outline-none" />
        <input name="image" placeholder="Profile Image URL" value={userForm.image} onChange={handleUserChange} className="border p-2 rounded focus:ring-2 focus:ring-amber-500 outline-none" />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">Assign Subjects (Multi-select)</label>
          <select multiple value={userForm.subjects} onChange={handleSubjectsChange} className="border p-2 rounded h-32 focus:ring-2 focus:ring-amber-500 outline-none">
            {subjectData?.subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition-all shadow-sm">
          {userForm.id ? "Update User Details" : "Create New User"}
        </button>
      </form>

      {/* ===== User Table ===== */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mb-12">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100 uppercase text-xs font-bold text-gray-600">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Subjects</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {userData?.users.map((user) => (
              <tr key={user.id} className="hover:bg-amber-50/30 transition-colors">
                <td className="px-6 py-4 font-medium">{user.name}</td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  {user.image ? <img src={user.image} alt={user.name} className="w-10 h-10 object-cover rounded-full border" /> : <span className="text-gray-400 text-xs italic">No Image</span>}
                </td>
                <td className="px-6 py-4 text-sm">
                  {user.subjects?.length ? user.subjects.map(s => s.name).join(", ") : "—"}
                </td>
                <td className="px-6 py-4 flex justify-center gap-3">
                  <button onClick={() => handleSelectUser(user)} className="text-blue-600 hover:text-blue-800 font-semibold underline decoration-2 underline-offset-4">Edit</button>
                  <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700 font-semibold underline decoration-2 underline-offset-4">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== Subject Management Section ===== */}
      <h2 className="text-3xl font-extrabold mb-6 text-gray-800 border-b-2 border-amber-500 inline-block">Subject Management</h2>
      <form onSubmit={handleAddSubject} className="mb-6 flex gap-3 max-w-md">
        <input type="text" placeholder="Subject Name" value={subjectForm.name} onChange={handleSubjectChange} className="border p-2 rounded flex-1 focus:ring-2 focus:ring-amber-500 outline-none" />
        <button type="submit" className="bg-gray-800 hover:bg-black text-white px-6 py-2 rounded-lg font-bold transition-colors">Add</button>
      </form>

      <div className="flex flex-wrap gap-3">
        {subjectData?.subjects.map((sub) => (
          <div key={sub.id} className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:border-amber-500 transition-all">
            <span className="font-medium">{sub.name}</span>
            <button onClick={() => handleDeleteSubject(sub.id)} className="text-red-400 hover:text-red-600 font-bold text-lg">×</button>
          </div>
        ))}
      </div>
    </div>
  );
}
