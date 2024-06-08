"use server"

import { Review } from "@/types/photospotTypes";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { id: number } }) {
    const supabase = createClient();
    const user = await supabase.auth.getUser();
    if (!user.data.user) return new Response('Not logged in', { status: 401 });
    const body = await request.json();
    if (!body) return new Response('No data to upload', { status: 400 });
    const { data, error } = await supabase.from('photospot_reviews').update({ ...body }).eq('photospot_id', params.id).eq('created_by', user.data.user.id);
    if (error) {
        return new Response(error.message, { status: 500 });
    }
    const { data: updateReviews, error: updateError } = await supabase.from('photospot_reviews').select('*').eq('photospot_id', params.id);
    if (updateError) {
        return new NextResponse(updateError.message, { status: 500 });
    }
    let userReview: Review | undefined = updateReviews.find((review: any) => review.created_by === user.data.user?.id);
    let reviewAr = updateReviews as Review[];
    if (userReview) {
        const index = reviewAr.indexOf(userReview);
        reviewAr.splice(index, 1);
        userReview.owner = true;
        reviewAr.unshift(userReview);
    }
    return NextResponse.json(reviewAr);

}