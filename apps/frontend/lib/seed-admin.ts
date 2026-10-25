import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SECRET_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function seedAdmin(email: string): Promise<void> {
  console.log(`🔍 Looking for user: ${email}`);

  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Failed to list users:', listError.message);
    process.exit(1);
  }

  const user = users.users.find((u) => u.email === email);
  if (!user) {
    console.error(`❌ User ${email} not found in Supabase Auth.`);
    console.log('Available users:', users.users.map((u) => u.email).join(', '));
    process.exit(1);
  }

  console.log(`✅ Found user: ${user.id} (${user.email})`);

  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert({ id: user.id, email: user.email!, role: 'admin' });

  if (upsertError) {
    console.error('Failed to upsert profile:', upsertError.message);
    process.exit(1);
  }

  console.log(`🎉 Admin role granted to ${email}`);
}

const email = process.argv[2] || 'admin@itqa.local';
seedAdmin(email).catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});