// export const fetcher = (...args: any) => fetch(...args).then(res => res.json()) 
export const fetcher = (url: RequestInfo | URL) => fetch(url).then(async (r) => {
    if(!r.ok){
    // Attach extra info to the error object.
        const errorInfo = await r.json()
        let error = new Error(`An error occurred while fetching the data. Error: ${errorInfo.error}, status: ${r.status}`)
        throw error;
    }
    return r.json();
})