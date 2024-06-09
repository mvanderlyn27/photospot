- Currently doing a data flow overhaul for backend -> client data
    - backend going to be route handlers
    - frontend will use SWR + fetch to interact with backend
    - could have some functions for repeated code on backend that routes call
    - TODO Now:
        - continue implementing new pages with above data flow
    - TODO LATER:
        - comeback to preview map, and photospot info sections to remove useQuery hooks, and replace with useSWR and route handlers
        - go over routehandlers to ensure consistency, efficiency and clean code
    