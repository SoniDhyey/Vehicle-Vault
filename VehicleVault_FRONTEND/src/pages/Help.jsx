import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Help = () => {

  const [form, setForm] = useState({
    email: "",
    password: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/help", form);
      toast.success("Query sent successfully 🚀");

      setForm({
        email: "",
        password: "",
        message: ""
      });

    } catch (err) {
      toast.error("Error sending query");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center px-4">

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-amber-400 text-center">
          Help & Support 🛠
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 rounded bg-black/40 border border-gray-600"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password (optional)"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 rounded bg-black/40 border border-gray-600"
        />

        <textarea
          name="message"
          placeholder="Write your issue..."
          value={form.message}
          onChange={handleChange}
          className="w-full p-3 rounded bg-black/40 border border-gray-600 h-32"
          required
        />

        <button
          type="submit"
          className="w-full bg-amber-500 py-3 rounded-lg hover:bg-amber-600 transition"
        >
          Send Query
        </button>

      </form>
    </div>
  );
};

export default Help;