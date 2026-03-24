const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

async function checkImpactData() {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envConfig = dotenv.parse(fs.readFileSync(envPath));

    const supabase = createClient(
        envConfig.NEXT_PUBLIC_SUPABASE_URL,
        envConfig.SUPABASE_SERVICE_ROLE_KEY || envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    console.log('Checking impact_pages...');
    const { data: pages, error: error1 } = await supabase.from('impact_pages').select('*');
    if (error1) console.error('Error impact_pages:', error1);
    else console.log('Pages found:', pages.length, pages);

    console.log('Checking impact_sections...');
    const { data: sections, error: error2 } = await supabase.from('impact_sections').select('*');
    if (error2) console.error('Error impact_sections:', error2);
    else console.log('Sections found:', sections.length, sections);
}

checkImpactData();
