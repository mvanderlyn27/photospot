import { SearchBox } from "@mapbox/search-js-react";

export default function AutoComplete() {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    //add mapbox map ref, and marker settings
    //
    return (
        <div>
            {/* @ts-expect-error Server Component */}
            {token && <SearchBox
                accessToken={token}
                options={{
                    language: 'en',
                    country: 'US'
                }}
                theme={{
                    variables: {
                        fontFamily: 'Avenir, sans-serif',
                        unit: '14px',
                        padding: '0.5em',
                        borderRadius: '10px',
                        boxShadow: '0 0 0 1px silver',
                    }
                }}
                placeholder="Search a location"
                value=""
            />
            }
        </div>
    )
}