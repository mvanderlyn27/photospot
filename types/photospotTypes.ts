export interface Photolist {
    created_at?: string;
    created_by?: string | null;
    description?: string | null;
    id: number;
    name: string;
}
export interface PhotolistInput {
    created_at?: string; 
    created_by?: string;
    description?: string;
    name: string;
}

export interface Photospot {
    created_at?: string;
    created_by?: string;
    description?: string;
    id: number;
    name?: string;
}