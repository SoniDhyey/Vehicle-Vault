import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const GetApiDemo = () => {
  const [users, setusers] = useState([]);

  const getUsers = async () => {
    const res = await axios.get("https://node5.onrender.com/user/user/");
    console.log("response...", res);
    setusers(res.data.data);
  };

  const deleteUser = async (id) => {
    //alert("delete user called..."+id)
    ///url =de5.onrender.com/user/user/12345678o9p

    const res = await axios.delete(
      `https://node5.onrender.com/user/user/${id}`,
    );
    console.log(res);
    if (res.status == 204) {
      toast.success("User deleted successfully");
      getUsers();
    }
  };

  //component --> load --> useEffec call --> function call..
  useEffect(() => {
    //api logic..
    getUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex justify-center items-center p-10">
      {/* Card Container (Glass Effect) */}
      <div className="backdrop-blur-lg bg-white/70 shadow-2xl rounded-3xl p-8 w-full max-w-6xl border border-white/40">
        {/* Title */}
        <h1 className="text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent tracking-wide">
          GET API DEMO
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full text-center rounded-xl overflow-hidden">
            {/* HEADER */}
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg">
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className={`
                    transition-all duration-300
                    hover:scale-[1.02]
                    hover:shadow-lg
                    hover:bg-indigo-100
                    ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  `}
                >
                  <td className="p-4 font-mono text-sm text-gray-700">
                    {user._id}
                  </td>

                  <td className="p-4 font-semibold text-indigo-700">
                    {user.name}
                  </td>

                  <td className="p-4">
                    <span className="bg-indigo-200 text-indigo-900 px-3 py-1 rounded-full text-sm">
                      {user.email}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-red-600 transition duration-300 shadow-md"
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
