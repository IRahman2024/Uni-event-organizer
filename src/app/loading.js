import { Reuleaux } from 'ldrs/react'
import 'ldrs/react/Reuleaux.css'

// Default values shown

export default function Loading({text}) {

  // Stack uses React Suspense, which will render this page while user data is being fetched.
  // See: https://nextjs.org/docs/app/api-reference/file-conventions/loading
  return <>

    <div className='flex flex-col items-center justify-center min-h-screen'>
      <Reuleaux
        size="80"
        stroke="10"
        strokeLength="0.15"
        bgOpacity="0.1"
        speed="1.5"
        color="#fb3904ff"
      />
      <p className='mt-5'>{text}</p>
    </div>
  </>;
}
