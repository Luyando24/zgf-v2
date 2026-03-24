const mysql = require('mysql2/promise');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables from both locations
const rootEnvPath = path.resolve(__dirname, '../../.env');
const nextEnvPath = path.resolve(__dirname, '../.env.local');

if (fs.existsSync(rootEnvPath)) {
  const rootEnv = dotenv.parse(fs.readFileSync(rootEnvPath));
  for (const k in rootEnv) {
    process.env[k] = rootEnv[k];
  }
}

dotenv.config({ path: nextEnvPath });

const tablesToMigrate = [
  'settings',
  'heroes',
  'posts',
  'volunteers',
  'donations',
  'community_initiatives',
  'team_members',
  'resources',
  'abuse_reports',
  'partner_requests',
  'careers',
  'job_applications',
  'about_sections',
  'impact_pages',
  'impact_sections',
  'pillars',
  'services',
  'capacity_development_areas',
  'communities',
  'grants',
  'grants_pages',
  'stats',
  'newsletter_subscribers',
  'newsletter_templates'
];

async function migrate() {
  console.log('Starting migration...');

  // MySQL Connection
  const mysqlConn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: 'root', // Local MySQL default
    password: '', // Local MySQL default
    database: 'zgf', // User specified local database name
    port: process.env.DB_PORT || 3306
  });

  // Supabase Connection
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for migration
  );

  for (const table of tablesToMigrate) {
    try {
      console.log(`Migrating table: ${table}...`);

      // 1. Fetch data from MySQL
      const [rows] = await mysqlConn.execute(`SELECT * FROM ${table}`);
      
      if (rows.length === 0) {
        console.log(`Table ${table} is empty, skipping.`);
        continue;
      }

      // 2. Transform data if necessary
      const transformedRows = rows.map(row => {
        const newRow = { ...row };
        
        // Handle JSON fields (MySQL might return them as strings)
        const jsonFields = ['metadata', 'sections', 'features', 'blocks', 'variables', 'eligibility_criteria', 'required_documents'];
        jsonFields.forEach(field => {
          if (newRow[field] && typeof newRow[field] === 'string') {
            try {
              newRow[field] = JSON.parse(newRow[field]);
            } catch (e) {
              // Keep as is if not valid JSON
            }
          }
        });

        // Ensure dates are in ISO format for PG
        for (const key in newRow) {
          if (newRow[key] instanceof Date) {
            newRow[key] = newRow[key].toISOString();
          }
        }

        // Specific table cleanup
        if (table === 'newsletter_subscribers') {
          delete newRow.confirmation_token;
          delete newRow.email_verified_at;
        }

        return newRow;
      });

      // 3. Upsert into Supabase
      // Using upsert with the primary key 'id' to avoid duplicates
      const { error } = await supabase
        .from(table)
        .upsert(transformedRows, { onConflict: 'id' });

      if (error) {
        console.error(`Error migrating table ${table}:`, error.message);
      } else {
        console.log(`Successfully migrated ${rows.length} rows for table ${table}.`);
      }
    } catch (err) {
      console.error(`Failed to migrate table ${table}:`, err.message);
    }
  }

  await mysqlConn.end();
  console.log('Migration completed!');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
