/**
 * ! Executing this script will delete all data in your database and seed it with 10 users.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createClient } from '@supabase/supabase-js';
import { createSeedClient } from "@snaplet/seed";
import { generateRandomPosition } from "./utils/snaplet/seedingHelpers";
import { Database } from './types/supabase';
let seen: number[][] = [];
const getLocation = () => {
 const centerLat = 40.738;
 const centerLng = -73.993;
 const radius = 100;
let  latLngAr =  generateRandomPosition(centerLat, centerLng, radius, seen);
// console.log('location',latLngAr);
return 'Point(' + latLngAr[0] + ' ' + latLngAr[1] + ')';
}

const supabase = createClient<Database>(
  "http://127.0.0.1:54321",
 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0" 
);

const main = async () => {
  const seed = await createSeedClient({dryRun: false});
  // Truncate all tables in the database
  await seed.$resetDatabase(["!auth.users", "!public.profiles", "!public.priv_profiles"]);
  // Retrieving profiles for linking with new data
  const { data: databaseProfiles, error: databaseProfilesError } = await supabase.from("profiles").select('*');
  if (databaseProfilesError) {
    console.log('error', databaseProfilesError);
  }
const profiles = databaseProfiles ??  [];
// console.log('profiles',databaseProfiles, profiles);
  
  const {photospots } = await seed.photospots((x) => x(10,({seed})=> ({
      location: () => getLocation(),
      location_name : `Photospot ${seed}`,
  })));
  const {tags} = await seed.tags((x) => x(10, {
  }));

  if (profiles.length){
    // console.log("photospots", photospots);
  for( const p of photospots){
    await seed.photospot_reviews((x) => x({min: 1, max: 3}, {
      photospot_id: p.id,
      created_by: profiles[Math.floor(Math.random() * profiles.length)].id,
      rating: () => Math.floor(Math.random() * 5)+1
    }), {connect: {profiles}});
    const {photoshots} = await seed.photoshots((x) => x(15, {
      photo_paths: ()=> [`https://picsum.photos/id/${Math.floor(Math.random()*1000)}/400/400`, `https://picsum.photos/id/${Math.floor(Math.random()*1000)}/400/400`, `https://picsum.photos/id/${Math.floor(Math.random()*1000)}/400/400`],
      photospot_id: p.id,
      created_by: profiles[Math.floor(Math.random() * profiles.length)].id
    }), {connect: {profiles}});
    for(const photoshot of photoshots){
      await seed.photoshot_tags((x) => x({min: 1, max: 5}, {
        id: photoshot.id,
        // tag_id: tags[Math.floor(Math.random() * tags.length)].id
      }), {connect: {tags}});
      await seed.photoshot_likes((x) => x({min: 0, max: 5}, {
        photoshot_id: photoshot.id,
        like_type: 1,
        // created_by: profiles[Math.floor(Math.random() * profiles.length)].id
        }), {connect:{profiles}});
      await seed.saved_photoshots((x) => x({min: 0, max: 5}, {
        photoshot_id: photoshot.id
        }), {connect: {profiles}});
      }
    }
  }

  // console.log("Database seeded successfully!");

  process.exit();
};

main();