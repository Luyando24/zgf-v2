const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  const email = 'admin@zgf.org.zm';
  const password = 'AdminPassword123!'; // User should change this after first login

  console.log(`Creating admin user: ${email}...`);

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'admin' }
  });

  if (error) {
    if (error.message.includes('already registered')) {
      console.log('Admin user already exists.');
    } else {
      console.error('Error creating admin user:', error.message);
    }
  } else {
    console.log('Successfully created initial admin user!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('IMPORTANT: Please change this password after your first login.');
  }
}

createAdminUser();
