- Todo move data fetching out of client components


issues with server actions
 - having trouble with keeping track of is loading/is error for async calls
 - looking at using suspense boundaries, or having each component keep track of its loading state

 - possible solution
    - convert all server actions being used rn to dedicated API routes
    - use SWR in client components to handle state
    - use normal fetching in server components to get info, if a component needs to be dynamic, make it a client component

- keep doign what I'm doing, but dont bother with suspend,

- use SWR, with supabase cache helpers

- use SWR for pulling/revalidating data
- use server actions for mutations to the db
- then use SWR mutation for updating all the swr pulling data from db