export type Photolist = {
    created_at?: string;
    created_by?: string | null;
    description?: string | null;
    id: number;
    name: string;
    photospots?: number[];
}
export type PhotolistInput = {
    created_at?: string; 
    created_by?: string;
    description?: string;
    name: string;
}

export type Photospot  = {
    created_at?: string;
    created_by?: string;
    description?: string;
    id: number;
    name?: string;
}