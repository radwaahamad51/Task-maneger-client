import { useEffect, useState } from "react";
import { signInWithGoogle } from "../../fierbase.config";
import'./texbenner.css'; 

const TaskBanner = () => {
  const [showText, setShowText] = useState(false);
  useEffect(() => {
    setShowText(true);
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-6 text-white rounded-lg shadow-lg mb-6">
      <div className="flex justify-between items-center">
        <div className="text-xl font-semibold">
          <h2
            className={`text-2xl font-bold ${showText ? "typing-effect" : ""}`}
          >
            Add Your Own Tasks and Manage Efficiently
          </h2>
          <p className="mt-2 opacity-0 transition-opacity duration-1000 ease-in-out opacity-100">
            Organize your day, track progress, and stay on top of your tasks.
          </p>
        </div>
        <button
          onClick={() => signInWithGoogle().then((res) => setUser(res.user))}
          className="bg-green-500 text-white px-4 py-2 rounded shadow-lg flex items-center gap-2 hover:bg-green-600 transition duration-200"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default TaskBanner;

  