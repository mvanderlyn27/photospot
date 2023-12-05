# NOTES

- Need to modify triggers for user creation ( upload username/email/id to profile table)
- delete, delete in auth table, and profile table, and storage object
- need to fix update function to properly enforce metadata, and test that info/photo updates properly
- build out the test user creation route, protect it so only admins can call it
- figure out RLS policies to protect user accounts if they're private, maybe need to split out user profile for private/public info
- potentially split profile into public/private profile 
- figure out user login to have username/email 