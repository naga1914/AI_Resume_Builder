import React, { useState } from 'react'
import { Layout } from 'lucide-react'

const TemplateSelector = ({ selectedTemplate, onChange }) => {

  const [isOpen, setIsOpen] = useState(false)

  const templates = [
    {
      id: 'classic',
      name: 'Classic',
      description: 'A timeless design with a clean layout, suitable for all industries.'
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'A sleek and contemporary design with bold typography and vibrant colors.'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'A clean and simple design with minimal visual elements.'
    },
    {
      id: 'minimal-image',
      name: 'Minimal with Image',
      description: 'A minimal design that includes a profile image.'
    }
  ]

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-1 text-sm text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 hover:ring-2 hover:ring-blue-300 transition-all px-3 py-2 rounded-lg'
      >
        <Layout size={14} />
        <span className='max-sm:hidden'>Template</span>
      </button>

      {isOpen && (
        <div className='absolute top-full mt-2 w-64 p-3 space-y-3 z-10 bg-white rounded-md border border-gray-200 shadow-sm'>
          {templates.map(template => (
            <div
              key={template.id}
              onClick={() => {
                onChange(template.id)
                setIsOpen(false)
              }}
              className={`p-3 rounded-md cursor-pointer transition-all border ${
                template.id === selectedTemplate
                  ? 'bg-blue-50 border-blue-200'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className='font-medium text-sm'>{template.name}</div>
              <div className='text-xs text-gray-500 mt-1'>{template.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TemplateSelector
