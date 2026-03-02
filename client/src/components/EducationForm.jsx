import React from 'react'
import { Plus, GraduationCap, Trash2, Sparkles } from 'lucide-react'

const EducationForm = ({ data = [], onChange }) => {

    const addEducation = () => {
        const newEducation = {
            institution: "",
            degree: "",
            field: "",
            graduation_date: "",
            cgpa: "",
            description: "",
            is_current: false
        };
        onChange([...data, newEducation])
    }

    const removeEducation = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated)
    }

    const updateEducation = (index, field, value) => {
        const updated = [...data];
        updated[index] = { ...updated[index], [field]: value }
        onChange(updated)
    }

    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
                        Education
                    </h3>
                    <p className='text-sm text-gray-500'>
                        Add your educational background
                    </p>
                </div>

                <button
                    type="button"
                    onClick={addEducation}
                    className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors'
                >
                    <Plus className='size-4' />
                    Add Education
                </button>
            </div>

            {data.length === 0 ? (
                <div className='text-center text-gray-500 py-8'>
                    <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No education added yet</p>
                    <p className='text-sm'>
                        Click "Add Education" to get started
                    </p>
                </div>
            ) : (
                <div className='space-y-6'>
                    {data.map((edu, index) => (
                        <div key={index} className='border border-gray-200 rounded-lg p-4 space-y-4'>

                            <div className='flex justify-between items-start'>
                                <h4 className='font-medium'>
                                    Education #{index + 1}
                                </h4>

                                <button
                                    type="button"
                                    onClick={() => removeEducation(index)}
                                    className='text-red-500 hover:text-red-700 transition-colors'
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </div>

                            <div className='grid md:grid-cols-2 gap-3'>

                                <input
                                    value={edu.institution || ""}
                                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                    className='px-3 py-2 rounded-lg text-sm border border-gray-300'
                                    placeholder='Institution Name'
                                    type="text"
                                />

                                <input
                                    value={edu.degree || ""}
                                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                    className='px-3 py-2 rounded-lg text-sm border border-gray-300'
                                    placeholder='Degree'
                                    type="text"
                                />

                                <input
                                    value={edu.field || ""}
                                    onChange={(e) => updateEducation(index, 'field', e.target.value)}
                                    className='px-3 py-2 rounded-lg text-sm border border-gray-300'
                                    placeholder='Field of Study'
                                    type="text"
                                />

                                <input
                                    value={edu.cgpa || ""}
                                    onChange={(e) => updateEducation(index, 'cgpa', e.target.value)}
                                    className='px-3 py-2 rounded-lg text-sm border border-gray-300'
                                    placeholder='CGPA / Percentage'
                                    type="text"
                                />

                                <input
                                    value={edu.graduation_date || ""}
                                    onChange={(e) => updateEducation(index, 'graduation_date', e.target.value)}
                                    className='px-3 py-2 rounded-lg text-sm border border-gray-300 disabled:bg-gray-100'
                                    disabled={edu.is_current}
                                    type="month"
                                />

                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-gray-700'>
                                    Description
                                </label>

                                <textarea
                                    value={typeof edu.description === "string" ? edu.description : ""}
                                    onChange={(e) => updateEducation(index, "description", e.target.value)}
                                    rows={4}
                                    className='w-full text-sm px-3 py-2 rounded-lg border border-gray-300 resize-none'
                                    placeholder='Describe achievements, projects, coursework, honors, etc.'
                                />
                            </div>

                            <label className='flex items-center gap-2'>
                                <input
                                    type="checkbox"
                                    checked={edu.is_current || false}
                                    onChange={(e) =>
                                        updateEducation(index, "is_current", e.target.checked)
                                    }
                                    className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                                />
                                <span className='text-sm text-gray-700'>
                                    Currently studying here
                                </span>
                            </label>

                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default EducationForm