import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Help = () => {
  const [form, setForm] = useState({
    email: "",
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
      // Ensure your backend has an app.use("/help", helpRoutes) or similar
      await axios.post("http://localhost:3000/help", form);
      toast.success("Query sent successfully 🚀");

      setForm({
        email: "",
        message: ""
      });
    } catch (err) {
      toast.error("Error sending query");
      console.error(err);
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
          className="w-full p-3 rounded bg-black/40 border border-gray-600 focus:outline-none focus:border-amber-500"
          required
        />

        <textarea
          name="message"
          placeholder="Describe your issue or question..."
          value={form.message}
          onChange={handleChange}
          className="w-full p-3 rounded bg-black/40 border border-gray-600 h-32 focus:outline-none focus:border-amber-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-amber-500 py-3 rounded-lg font-semibold hover:bg-amber-600 transition duration-300"
        >
          Send Query
        </button>
      </form>
    </div>
  );
};

export default Help;