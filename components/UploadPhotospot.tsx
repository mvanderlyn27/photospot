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
        <input type="text" id="name" name="name" required />
        <label htmlFor="description">Description:</label>
        <input type="text" id="description" name="description" required />
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload PhotoSpot</label>
        <input id="photospot_picture"name="photospot_picture" className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" type="file"/>
        <SubmitButton />
        
    </form>
    <p aria-live="polite" className="sr-only" role="status">
        {state?.message}
        </p>
    </div>
    )
}