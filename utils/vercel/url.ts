export const getURL = () => {
    let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
        process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
        'http://localhost:3000/'
    // Make sure to include `https://` when not localhost.
    url = url.includes('http') ? url : `https://${url}`
    // Make sure to include a trailing `/`.
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
    return url
}
export const getDBURL = (): string => {
        if(process.env.ENV === 'production' || process.env.ENV === 'staging'){  // Set this to your site URL in production env.
            return process.env.NEXT_PUBLIC_SUPABASE_URL!;
        }
        else{
        return 'http://127.0.0.1:54321';
        }
    // Make sure to include `https://` when not localhost.
};