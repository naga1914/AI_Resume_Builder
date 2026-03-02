import React from 'react'

const Modal = ({ title, onClose, onSubmit, value, setValue }) => {
  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
      <div className='bg-white p-6 rounded-lg w-80'>
        <h2 className='text-lg font-semibold mb-4'>{title}</h2>

        <form onSubmit={onSubmit} className='flex flex-col gap-4'>
          <input
            type='text'
            placeholder='Enter title'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className='border p-2 rounded'
            required
          />

          <div className='flex justify-end gap-2'>
            <button type='button' onClick={onClose} className='px-3 py-1 border rounded'>
              Cancel
            </button>

            <button type='submit' className='px-3 py-1 bg-indigo-500 text-white rounded'>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Modal