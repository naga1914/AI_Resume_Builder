import React, { useState } from "react";
import { Plus, Trash2, Sparkles, Loader2 } from "lucide-react";
import api from "../configs/api";
import toast from "react-hot-toast";

const ProjectForm = ({ data = [], onChange }) => {
  const [loadingIndex, setLoadingIndex] = useState(null);

  // Add Project
  const addProject = () => {
    const newProject = {
      name: "",
      type: "",
      description: "",
    };

    onChange([...data, newProject]);
  };

  // Remove Project
  const removeProject = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  // Update Project Field
  const updateProject = (index, field, value) => {
    const updated = [...data];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  // ✅ AI Enhance Project Description
  const enhanceProjectDescription = async (index) => {
    const currentDescription = data[index]?.description;

    if (!currentDescription || currentDescription.trim() === "") {
      toast.error("Please enter project description first!");
      return;
    }

    try {
      setLoadingIndex(index);

      const response = await api.post(
        "/api/ai/enhance-project-desc",
        {
          userContent: currentDescription,
        }
      );

      updateProject(
        index,
        "description",
        response.data.enhancedContent || ""
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "AI enhancement failed"
      );
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Projects
          </h3>
          <p className="text-sm text-gray-500">
            Add your projects
          </p>
        </div>

        <button
          type="button"
          onClick={addProject}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
        >
          <Plus className="size-4" />
          Add Project
        </button>
      </div>

      <div className="space-y-4 mt-6">
        {data.map((project, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm"
          >
            {/* Top Row */}
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-gray-800">
                Project #{index + 1}
              </h4>

              <button
                type="button"
                onClick={() => removeProject(index)}
                className="text-red-500 hover:text-red-700 transition"
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            {/* Inputs */}
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Project Name"
                value={project.name || ""}
                onChange={(e) =>
                  updateProject(index, "name", e.target.value)
                }
                className="px-3 py-2 rounded-lg text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <input
                type="text"
                placeholder="Project Type"
                value={project.type || ""}
                onChange={(e) =>
                  updateProject(index, "type", e.target.value)
                }
                className="px-3 py-2 rounded-lg text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Project Description
                </label>

                <button
                  type="button"
                  disabled={loadingIndex === index}
                  onClick={() => enhanceProjectDescription(index)}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition disabled:opacity-50"
                >
                  {loadingIndex === index ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3" />
                      Enhance with AI
                    </>
                  )}
                </button>
              </div>

              <textarea
                value={project.description || ""}
                onChange={(e) =>
                  updateProject(index, "description", e.target.value)
                }
                rows={4}
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectForm;