import React, { useState } from 'react'
import { Palette, Check } from 'lucide-react'

const ColorPicker = ({ selectedColor, onChange }) => {

  const [isOpen, setIsOpen] = useState(false)

  const colors = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Green', value: '#10B981' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Teal', value: '#14B8A6' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Gray', value: '#6B7280' },
  ]

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-1 text-sm text-purple-600 bg-gradient-to-br from-purple-100 to-purple-200 hover:ring-2 hover:ring-purple-300 transition-all px-3 py-2 rounded-lg'
      >
        <Palette size={16} />
        <span className='max-sm:hidden'>Accent Color</span>
      </button>

      {isOpen && (
        <div className='absolute top-full mt-2 w-40 p-3 grid grid-cols-3 gap-2 z-10 bg-white rounded-md border border-gray-200 shadow-sm'>
          {colors.map(color => (
            <div
              key={color.value}
              onClick={() => {
                onChange(color.value)
                setIsOpen(false)
              }}
              className='relative w-8 h-8 rounded-full cursor-pointer border border-gray-300 hover:scale-110 transition-transform flex items-center justify-center'
              style={{ backgroundColor: color.value }}
            >
              {selectedColor === color.value && (
                <Check size={12} className='text-white' />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ColorPicker
