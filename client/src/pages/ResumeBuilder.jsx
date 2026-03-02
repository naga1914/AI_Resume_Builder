import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  GraduationCap,
  User,
  Briefcase,
  FileText,
  FolderIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Share2Icon,
  EyeIcon,
  EyeOffIcon,
  DownloadIcon,
} from "lucide-react";

import PersonalInfoForm from "../components/PersonalInfoForm";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from 'react-hot-toast';

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  });

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  // ✅ LOAD EXISTING RESUME (FIXED)
  const loadExistingResume = async () => {
    try {
      const { data } = await api.get(
        '/api/resumes/get/'+resumeId,
         // ✅ correct REST route
        {
          headers: {
            Authorization: token, // ✅ important
          }
        }
      )

      if (data.resume) {
        setResumeData(data.resume)
        document.title=data.resume.title;
      }
       
    } catch (error) {
      console.log("Error loading resume:", error.response?.data || error.message);
    }
  };

  // ✅ FIXED useEffect
  useEffect(() => {
    if (resumeId && token) {
      loadExistingResume();
    }
  }, [resumeId, token]);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "project", name: "Project", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const changeResumeVisibility = async () => {
  try {
    const formData = new FormData();
    formData.append("resumeId", resumeId);
    formData.append("resumeData", JSON.stringify({ public: !resumeData.public }));

    const { data } = await api.put(   // <-- This is fine now
      '/api/resumes/update',
      formData,
      { headers: { Authorization: token } }
    );

    setResumeData({ ...resumeData, public: !resumeData.public });
    toast.success(data.message);
  } catch (error) {
    console.error("Error saving resume:", error);
  }
};

  const handleShare = () => {
    const frontendUrl = window.location.origin;
    const resumeUrl = `${frontendUrl}/view/${resumeId}`;

    if (navigator.share) {
      navigator.share({
        url: resumeUrl,
        text: "Check out my resume",
      });
    } else {
      alert("Share not supported in this browser");
    }
  };

  const downloadResume = () => {
    window.print();
  };

  const saveResume=async()=>{
    try{
      let updatedResumeData=structuredClone(resumeData)

      if(typeof resumeData.personal_info.image==='object'){
        delete updatedResumeData.personal_info.image
      }
      const formData=new FormData();
      formData.append("resumeId", resumeId)
      formData.append('resumeData',JSON.stringify(updatedResumeData))
      removeBackground && formData.append("removeBackground","yes");
      typeof resumeData.personal_info.image === 'object' && formData.append("image",resumeData.personal_info.image)

      const {data}= await api.put('/api/resumes/update',formData,{headers:{Authorization:token}})
      setResumeData(data.resume)
      toast.success(data.message)
    }catch(error){
       console.error("Error svaing resume",error)
    }
    
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to="/"
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">

          {/* LEFT */}
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">

              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
              <hr
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-300"
                style={{
                  width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
                }}
              />

              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-2">
                <div className="flex items-center gap-2">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={(template) =>
                      setResumeData((prev) => ({ ...prev, template }))
                    }
                  />
                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(accent_color) =>
                      setResumeData((prev) => ({ ...prev, accent_color }))
                    }
                  />
                </div>

                <div className="flex items-center">
                  {activeSectionIndex > 0 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex((prev) => Math.max(prev - 1, 0))
                      }
                      className="flex items-center gap-1 p-3 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                    >
                      <ChevronLeft className="size-4" />
                      Previous
                    </button>
                  )}

                  {activeSectionIndex < sections.length - 1 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex((prev) =>
                          Math.min(prev + 1, sections.length - 1)
                        )
                      }
                      className="flex items-center gap-1 p-3 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                    >
                      Next
                      <ChevronRight className="size-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {sections[activeSectionIndex].id === "personal" && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personal_info: data,
                      }))
                    }
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}

                {sections[activeSectionIndex].id === "summary" && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        professional_summary: data,
                      }))
                    }
                  />
                )}

                {sections[activeSectionIndex].id === "experience" && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        experience: data,
                      }))
                    }
                  />
                )}

                {sections[activeSectionIndex].id === "education" && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: data,
                      }))
                    }
                  />
                )}

                {sections[activeSectionIndex].id === "project" && (
                  <ProjectForm
                    data={resumeData.project}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        project: data,
                      }))
                    }
                  />
                )}

                {sections[activeSectionIndex].id === "skills" && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        skills: data,
                      }))
                    }
                  />
                )}
              </div>
              <button onClick={()=>{toast.promise(saveResume,{loading:'saving....'})}} className="bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm">
                Save Changes
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="relative w-full">
              <div className="absolute top-3 right-0 flex items-center gap-2">

                {resumeData.public && (
                  <button
                    onClick={handleShare}
                    className="flex items-center p-2 px-4 text-xs bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                  >
                    <Share2Icon className="size-4" />
                    Share
                  </button>
                )}

                <button
                  onClick={changeResumeVisibility}
                  className="flex items-center gap-2 p-2 px-4 text-xs bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                >
                  {resumeData.public ? (
                    <EyeIcon className="size-4" />
                  ) : (
                    <EyeOffIcon className="size-4" />
                  )}
                  {resumeData.public ? "Public" : "Private"}
                </button>

                <button
                  onClick={downloadResume}
                  className="flex items-center gap-2 px-6 py-2 text-xs bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                >
                  <DownloadIcon className="size-4" />
                  Download
                </button>

              </div>
            </div>

            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;