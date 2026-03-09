import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env (or .env.local) to run this script.');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function runTest() {
  console.log('1. Sending mock RevenueCat webhook to http://localhost:3000/api/webhooks/revenuecat...');
  
  // Create a dummy UUID for testing
  const testUserId = '123e4567-e89b-12d3-a456-426614174000';
  
  const payload = {
    event: {
      type: "INITIAL_PURCHASE",
      app_user_id: testUserId,
      product_id: "premium_unlock"
    }
  };

  try {
    const response = await fetch('http://localhost:3000/api/webhooks/revenuecat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log('Webhook response status:', response.status);
    console.log('Webhook response body:', result);
    
    if (response.status === 500 && result.error === 'Database update failed') {
        console.log('\n⚠️ The webhook processed the request, but Supabase failed to update.');
        console.log('This usually means the "profiles" table does not exist yet, or the test UUID is invalid.');
        console.log('To fix this, make sure you have run the SQL in `supabase/create-profiles-table.sql` in your Supabase dashboard.');
    } else if (response.status === 200) {
        console.log('\n✅ SUCCESS: Webhook successfully processed the purchase!');
    }

  } catch (err) {
    console.error('Error calling webhook:', err);
  }
}

runTest();
