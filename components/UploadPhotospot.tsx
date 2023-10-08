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
      <button type="submit" aria-disabled={pending}>
        Add
      </button>
    )
  }

export default function UploadPhotospot() {
const [state, formAction] = useFormState(uploadPhotoSpot, initialState)

return (
    <div>
        <h1>PhotoSpot: </h1>
        <form action={formAction}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-500
    "/>
        <label htmlFor="description">Description:</label>
        <input type="text" id="description" name="description" required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-500
    "/>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload PhotoSpot</label>
        <input type="file" id="photospot_picture"name="photospot_picture" className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100" />
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
      <input className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" aria-describedby="file_input_help" id="file_input" type="file"></input>
        <SubmitButton />
    </form>
    <p aria-live="polite" className="sr-only" role="status">
        {state?.message}
        </p>
    </div>
    )
}