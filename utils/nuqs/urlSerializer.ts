import {
    createSerializer,
    parseAsArrayOf,
    parseAsFloat,
    parseAsInteger,
    parseAsString,
    parseAsStringLiteral
  } from 'nuqs/server' // can also be imported from 'nuqs' in client code
   
  const searchParams = {
    minRating: parseAsString,
    tags: parseAsArrayOf(parseAsInteger),
    maxDistance: parseAsInteger,
    sort: parseAsStringLiteral(['new', 'top', 'nearby', ''] as const),
    page: parseAsInteger,
    lat: parseAsFloat,
    lng: parseAsFloat
  }
   
  // Create a serializer function by passing the description of the search params to accept
  export const serializePhotospotSearch = createSerializer(searchParams)
   
  // Then later, pass it some values (a subset) and render them to a query string