import { Sparkles, Loader2 } from "lucide-react";
import React, { useState } from "react";
import api from "../configs/api";
import toast from "react-hot-toast";

const ProfessionalSummaryForm = ({ data, onChange }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    // ✅ Prevent sending empty content
    if (!data || data.trim() === "") {
      toast.error("Please enter a professional summary first!");
      return;
    }

    try {
      setIsGenerating(true);

      const prompt = `Enhance my professional summary: "${data}"`;

      // ✅ No need to pass headers manually (interceptor handles token)
      const response = await api.post("/api/ai/enhance-pro-sum", {
  userContent: prompt,  // If `prompt` is empty, backend sees it as missing
});

      // Use the onChange callback provided by the parent to update the summary
      onChange(response.data.enhancedContent);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsGenerating(false); // ✅ Always reset loader
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Professional Summary
          </h3>
          <p className="text-sm text-gray-500">
            Add a professional summary to your resume.
          </p>
        </div>

        <button
          disabled={isGenerating}
          onClick={generateSummary}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
        >
          {isGenerating && <Loader2 className="size-4 animate-spin" />}
          <Sparkles className="size-4" />
          {isGenerating ? "Enhancing..." : "AI Enhance"}
        </button>
      </div>

      <div className="mt-6">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none text-sm"
          placeholder="Write a professional summary that highlights your key strengths and career objectives..."
          value={data || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={7}
        />

        <p className="text-xs text-gray-500 max-w-[80%] mx-auto text-center">
          Tip: Keep it concise (3–4 sentences) and focus on your most relevant
          achievements and skills.
        </p>
      </div>
    </div>
  );
};

export default ProfessionalSummaryForm;