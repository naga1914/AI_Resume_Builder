import { LockIcon, MailIcon, User2Icon } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";
import { login } from "../app/features/authSlice";
import api from "../configs/api";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();

  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state");

  const [state, setState] = React.useState(urlState || "login");

  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = React.useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post(
        `/api/users/${state}`,
        formData
      );

      dispatch(login(data));
      localStorage.setItem("token", data.token);
      toast.success(data.message)
    } catch (err) {
      toast(err?.response?.data?.message || err.message)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-96 text-center bg-white border border-gray-200 shadow-xl rounded-2xl px-8"
      >
        <h1 className="text-gray-800 text-3xl mt-10 font-semibold">
          {state === "login" ? "Login" : "Sign up"}
        </h1>

        <p className="text-gray-500 text-sm mt-2">
          Please {state === "login" ? "login" : "register"} to continue
        </p>

        {state !== "login" && (
          <div className="flex items-center mt-6 w-full bg-gray-100 ring-2 ring-gray-200 focus-within:ring-indigo-500 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
            <User2Icon size={16} color="gray" />
            <input
              type="text"
              name="username"
              placeholder="Name"
              className="w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="flex items-center w-full mt-4 bg-gray-100 ring-2 ring-gray-200 focus-within:ring-indigo-500 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
          <MailIcon size={16} color="gray" />
          <input
            type="email"
            name="email"
            placeholder="Email id"
            className="w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center mt-4 w-full bg-gray-100 ring-2 ring-gray-200 focus-within:ring-indigo-500 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
          <LockIcon size={16} color="gray" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-3">{error}</p>
        )}

        <div className="mt-4 text-left">
          <button
            type="button"
            className="text-sm text-indigo-600 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="mt-4 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition"
        >
          {state === "login" ? "Login" : "Sign up"}
        </button>

        <p
          onClick={() =>
            setState((prev) =>
              prev === "login" ? "register" : "login"
            )
          }
          className="text-gray-500 text-sm mt-4 mb-10 cursor-pointer"
        >
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <span className="text-indigo-600 hover:underline ml-1">
            Click here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;