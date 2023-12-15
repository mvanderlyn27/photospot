export const fetchUsersReviews = (url : string,  {arg} : {arg: {user: any}}) => {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg)
      }).then(res => res.json())
}

export const searchByPhotolist = (url : string,  {arg} : {arg: {photolist_id: number}}) => {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg)
      }).then(res => res.json())
}

export const searchByUser = (url : string,  {arg} : {arg: {user_id: string}}) => {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg)
      }).then(res => res.json())
}