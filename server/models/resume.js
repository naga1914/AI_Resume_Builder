import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, default: "Untitled Resume", required: true },

    personal_info: {
      image: { type: String, default: "" },
      full_name: { type: String, default: "" },
      profession: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      website: { type: String, default: "" },
    },

    professional_summary: { type: String, default: "" },

    experience: [
      {
        company: String,
        position: String, // fixed typo (was postion)
        start_date: String,
        end_date: String,
        description: String,
        is_current: Boolean,
      },
    ],

    education: [
      {
        institution: String,
        degree: String,
        field: String,
        graduation_date: String,
        gpa: String,
      },
    ],

    project: [
      {
        name: String,
        type: String,
        description: String,
      },
    ],

    skills: { type: Array, default: [] },

    template: { type: String, default: "classic" },
    accent_color: { type: String, default: "#3B82F6" },
    public: { type: Boolean, default: false },
  },
  { timestamps: true, minimize: false }
);

export default mongoose.model("Resume", resumeSchema);