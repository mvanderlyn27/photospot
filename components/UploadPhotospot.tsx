"use client";
import { uploadPhotoSpot } from "@/app/photospotActions"
//@ts-expect-error
import { experimental_useFormState as useFormState } from 'react-dom'
import { experimental_useFormStatus as useFormStatus } from 'react-dom'
const initialState = {
    message: null,
  }
function SubmitButton() {
    const { pending } = useFormStatus()
  
    return (
      <button type="submit" aria-disabled={pending} className="bg-blue-500">
        Add
      </button>
    )
  }

export default function UploadPhotospot() {
const [state, formAction] = useFormState(uploadPhotoSpot, initialState)

return (
    <div>
        <h1>PhotoSpot: </h1>
        <form action={formAction} className="flex flex-col gap-4 items-center">
        <div className="block w-full">
        <label htmlFor="name" className="mb-1 font-medium">Name:</label>
        <input type="text" id="name" name="name" required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
          invalid:border-pink-500 invalid:text-pink-600
          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"/>             
      </div>
      <div className="block w-full">
        <label htmlFor="description" className="mb-1 font-medium">Description:</label>
        <input type="text" id="description" name="description" required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-500
    "/>
    </div>
  <label className="block w-full">
    <span className="sr-only">Choose profile photo</span>
        <input type="file" id="photospot_picture"name="photospot_picture"className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-slate-50 file:text-slate-700
      hover:file:bg-slate-100
    " />
    </label>
    <SubmitButton />
    </form>
    <p aria-live="polite" className="sr-only" role="status">
        {state?.message}
        </p>
    </div>
    )
}