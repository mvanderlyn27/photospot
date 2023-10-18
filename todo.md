# Features
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
- users
    - add user table, add triggers to fill out fields after authenticating new user
- profile
    - users profile page for viewing/updating user details
- photobooks (photolist?)
    - allow users to curate list of photospots 
# Code Improvement
- Add types for all tables in DB 
# Bugs
- fix data revalidation for photospots, and loading state for uploading pics (maybe optimistic photo upload )
# Future Ideas
- have a "placeholder" person to put into a photo for photospots where a user don't want to upload their face, or have a way to blur out the user
- have notification for users how many people liked their photospot they uploaded