import React from 'react'
import { X } from 'lucide-react'

const SkillsForm = ({ data, onChange }) => {

    const [newSkill, setNewSkill] = React.useState("")

    const addSkill = () => {
        if (newSkill.trim() && !data.includes(newSkill.trim())) {
            onChange([...data, newSkill.trim()])
        }
        setNewSkill("")
    }

    const removeSkill = (index) => {
        const update = data.filter((_, i) => i !== index);
        onChange(update)
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSkill();
        }
    }

    return (
        <div className='space-y-4'>
            <div>
                <h3 className='text-lg font-semibold text-gray-900'>Skills</h3>
                <p className='text-sm text-gray-500'>Add your technical skills</p>
            </div>

            <div className='flex gap-2'>
                <input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className='flex-1 px-3 py-2 rounded-lg text-sm'
                    placeholder='Add a skill'
                />
                <button
                    onClick={addSkill}
                    className='px-3 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200'
                >
                    Add
                </button>
            </div>

            <div className='flex flex-wrap gap-2'>
                {data.map((skill, index) => (
                    <div key={index} className='flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm'>
                        {skill}
                        <button onClick={() => removeSkill(index)}>
                            <X className='w-3 h-3 text-red-500' />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SkillsForm
