import React, { useState } from 'react'
import { Plus, Trash2, Briefcase, Sparkles, Loader2 } from 'lucide-react'
import api from "../configs/api";
import toast from "react-hot-toast";

const ExperienceForm = ({ data, onChange }) => {

    const [loadingIndex, setLoadingIndex] = useState(null);

    const addExperience = () => {
        const newExperience = {
            company: "",
            position: "",
            start_date: "",
            end_date: "",
            description: "",
            is_current: false,
        };
        onChange([...data, newExperience])
    }

    const removeExperience = (index) => {
        const update = data.filter((_, i) => i !== index);
        onChange(update)
    }

    const updateExperience = (index, field, value) => {
        const updated = [...data];
        updated[index] = { ...updated[index], [field]: value }
        onChange(updated)
    }

    // ✅ AI Enhance Job Description
    const generateJobDescription = async (index) => {
        const currentDescription = data[index]?.description;

        if (!currentDescription || currentDescription.trim() === "") {
            toast.error("Please enter job description first!");
            return;
        }

        try {
            setLoadingIndex(index);

            const prompt = `Enhance this job description professionally and make it impactful for a resume: "${currentDescription}"`;

            const response = await api.post("/api/ai/enhance-job-desc", {
                userContent: prompt,
            });

            updateExperience(index, "description", response.data.enhancedContent);

        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setLoadingIndex(null);
        }
    }

    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
                        Professional Experience
                    </h3>
                    <p className='text-sm text-gray-500'>
                        Add your job experience
                    </p>
                </div>

                <button
                    onClick={addExperience}
                    className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors'
                >
                    <Plus className='size-4' />
                    Add Experience
                </button>
            </div>

            {data.length === 0 ? (
                <div className='text-center text-gray-500 py-8'>
                    <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No work experience added yet</p>
                    <p className='text-sm'>
                        Click "Add Experience" to get started
                    </p>
                </div>
            ) : (
                <div className='space-y-6'>
                    {data.map((exp, index) => (
                        <div key={index} className='border border-gray-200 rounded-lg p-4 space-y-3'>

                            <div className='flex justify-between items-start'>
                                <h4>Experience #{index + 1}</h4>
                                <button
                                    onClick={() => removeExperience(index)}
                                    className='text-red-500 hover:text-red-700 transition-colors'
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </div>

                            <div className='grid md:grid-cols-2 gap-3'>
                                <input value={exp.company || ""} onChange={(e) => updateExperience(index, 'company', e.target.value)} className='px-3 py-2 rounded-lg text-sm' placeholder='Company Name' type="text" />
                                <input value={exp.position || ""} onChange={(e) => updateExperience(index, 'position', e.target.value)} className='px-3 py-2 rounded-lg text-sm' placeholder='Position' type="text" />
                                <input value={exp.start_date || ""} onChange={(e) => updateExperience(index, 'start_date', e.target.value)} className='px-3 py-2 rounded-lg text-sm' type="month" />
                                <input value={exp.end_date || ""} onChange={(e) => updateExperience(index, 'end_date', e.target.value)} disabled={exp.is_current} className='px-3 py-2 rounded-lg text-sm disabled:bg-gray-100' type="month" />
                            </div>

                            <div className='space-y-2'>
                                <div className='flex items-center justify-between'>
                                    <label className='text-sm font-medium text-gray-700'>
                                        Job Description
                                    </label>

                                    <button
                                        disabled={loadingIndex === index}
                                        onClick={() => generateJobDescription(index)}
                                        className='flex items-center gap-1 px-2 py-1 text-gray-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'
                                    >
                                        {loadingIndex === index && <Loader2 className='w-3 h-3 animate-spin' />}
                                        <Sparkles className='w-3 h-3' />
                                        {loadingIndex === index ? "Enhancing..." : "Enhance with AI"}
                                    </button>
                                </div>

                                <textarea
                                    value={exp.description || ""}
                                    onChange={(e) => updateExperience(index, "description", e.target.value)}
                                    rows={4}
                                    className='w-full text-sm px-3 py-2 rounded-lg resize-none'
                                />
                            </div>

                            <label className='flex items-center gap-2'>
                                <input
                                    type="checkbox"
                                    checked={exp.is_current || false}
                                    onChange={(e) => updateExperience(index, "is_current", e.target.checked)}
                                    className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                                />
                                <span className='text-sm text-gray-700'>
                                    Currently working here
                                </span>
                            </label>

                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ExperienceForm