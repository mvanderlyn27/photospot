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
 const centerLat = 42.3601;
 const centerLng = -71.0589;
 const radius = 2000;
let  latLngAr =  generateRandomPosition(centerLat, centerLng, radius, seen);
return 'Point(' + latLngAr[0] + ' ' + latLngAr[1] + ')';
}

const supabase = createClient<Database>(
  "http://127.0.0.1:54321",
 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IUIU" 
);

const PASSWORD = "testuser";
const USER_COUNT = 100;
const main = async () => {
  const seed = await createSeedClient({dryRun: false});
  // Truncate all tables in the database
  await seed.$resetDatabase(["auth.users", "public.profiles", "public.priv_profiles"]);
  for (let i = 0; i < USER_COUNT; i++) {
  await supabase.auth.signUp({
      email: `user${i}@example.com`,
      password: PASSWORD,
      options: { data: {username: `user${i}` }}
  });
  }

  process.exit();
};

main();