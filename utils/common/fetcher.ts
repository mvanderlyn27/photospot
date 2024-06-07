// export const fetcher = (...args: any) => fetch(...args).then(res => res.json()) 
export const fetcher = (url: RequestInfo | URL) => fetch(url).then(r => r.json())