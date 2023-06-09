import { Message } from '../types/api';

let api_route = process.env.REACT_APP_API_ROUTE;
api_route = api_route? api_route : '';
function getMessages(): Promise<Message> {
    console.log('getting message');
    // For now, consider the data is stored on a static `users.json` file
    return fetch(api_route+'/ping')
            // the JSON body is taken from the response
            .then(res => { 
                return res.json();
            }).then(data =>{
                return data as Message;
            });
}

export { getMessages }