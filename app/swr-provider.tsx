// 'use client';
// import { SWRConfig } from 'swr'

export const fetcher = (resource: RequestInfo | URL, init: RequestInit | undefined) => fetch(resource, init).then(res => res.json())
//not working for some reason
// export const SWRProvider = ({ children }: {children: React.ReactNode}) => {
//   return <SWRConfig
//     value={{
//     refreshInterval: 3600, 
//     fetcher: fetcher 
//     }}>
//     {children}
//     </SWRConfig>
// };