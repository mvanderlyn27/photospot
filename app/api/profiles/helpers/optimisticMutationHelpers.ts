//add this in later looool


// FETCHERS
export const searchByUsername = (url : string,  {arg} : {arg: {name: string}}) => {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg)
      }).then(res => res.json())
}
export const searchById = (url : string,  {arg} : {arg: {id: number}}) =>{
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg)
      }).then(res => res.json())
}