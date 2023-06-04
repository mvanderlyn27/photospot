import { Message } from '../types/api';
import dotenv from 'dotenv';

dotenv.config();
const api_route = process.env.API_ROUTE;

function getMessages(): Promise<Message> {
    // For now, consider the data is stored on a static `users.json` file
    return fetch(api_route+'/ping')
            // the JSON body is taken from the response
            .then(res => {
                // if(!res.ok()){

                // }
                    // The response has an `any` type, so we need to cast
                    // it to the `User` type, and return it from the promise
                    return res as unknown as Message;
            })
}

export { getMessages }