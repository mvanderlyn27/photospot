# Planned Features
- overall 
    - nav bar across all pages
- home page
    - need to figure out what to put here for MVP
        - maybe photo inspo feed?
        - maybe heatmap of photo locations 
        - need to narrow down target audiance/needs for them
- explore page
    - view photospots on a map
    - add photospots via location
    - filter photospots/search photospots
- ratings
    - implement rating of photolocation
    - have commenting/ up/down vote of rating
    - add overall score of location
    - add user uploaded images for a location
- photospots
    - allow users to update, and delete photospots
    - figure out more of what we want to allow for photospots
        - should they be owned by a user, or by the community? 
    - maybe make it so owner of photospot can be transfered
- users
    - add user table, add triggers to fill out fields after authenticating new user
- profile
    - users profile page for viewing/updating user details
- photobooks (photolist?)
    - allow users to curate list of photospots 


# features needed still for MVP
- 
# Code Improvement
- Add trigger to photospot table on deletes to also delete its picture from storage 
- Add new function and trigger to delete user from auth table upon deleting user profile
- ADD REVIEW RATING FUNCTIONALITY for photospots and photolists
- ADD ability to upload photo for user profile
- ADD proper migration for supabase dbs, for local testing
    - need to have multiple env for db, so we're not working against prod data
- Add better unit testing/ e2e 
    - rn using a test page to do testing, not super comprehensive
- improve error handeling/loggin in apis/frontend
- fix search by location for photolists
- layout better, cleaner types for use throughout the app 
- Move a lot of db functions to db triggers
    - delete photospot, and profile picture on delete of auth.row
    - delete old photospots pictures on new entry
- rewrite all route handler code to have as much parallelism as possible
- need to update GET profiles route to only have access to public profiles via RLS/Functions
- update trigger so users can't give themselves admin
- also give admin more abilities 
- properly enforce private user profiles
- add better searching for all text searches, using some type of substring search 
    - username
    - photospot
    - photolist
- need to update auth signup/login/signin/password reset/magic link to work better, janky rn
- add admin edge functions for managing users/testing
    - create random user
    - create random review
    - modify user/ ownership of diff db entities
- add admin panel to app
# Bugs





# Future Ideas
- realtime for reviews? 
add shadows for photospots, see if you're photospot will be in shadow when you want a shot
- have weather included as well to findout when is the perfect time to take a photo
    - maybe could be the main focus of product to sell to photographers
- have a "placeholder" person to put into a photo for photospots where a user don't want to upload their face, or have a way to blur out the user
- have notification for users how many people liked their photospot they uploaded
- add cool tagging feature for photos
- add cool tagging feature for videos as well
- maybe have whole social media platform, adding friends, messaging, etc
    - need to think through how to make the MVP have most value to users in the beginning
    - setup user feed of photos 
        - show new photos posted at your photospots
        - show new photos posted at tags you like
        - maybe have mapview of your feed, showing hotspots of locations 
- offline
- Could focus in a few areas
    - social media part, finding other photographers near you, seeing their pics, sharing yours
    - planning photography shoots for professionals
    - mainly the "photo trip" planning, focusing on either traveling somewhere, or exploring your own city, multiple locations, focusing more on the photo trip, than just the one location


# Intended audiance
- pro photographers?
- amatuer photographers?
- travelers?
- influencers?