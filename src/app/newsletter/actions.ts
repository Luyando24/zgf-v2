'use server';

import { createClient } from '@/utils/supabase/server';

export async function subscribeToNewsletter(email: string, source: string = 'website') {
    const supabase = await createClient();

    // Check if already subscribed
    const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('id, status')
        .eq('email', email)
        .single();

    if (existing) {
        if (existing.status === 'active') {
            return { success: false, alreadySubscribed: true };
        }
        // Re-activate if previously unsubscribed
        const { error } = await supabase
            .from('newsletter_subscribers')
            .update({ status: 'active', updated_at: new Date().toISOString() })
            .eq('id', existing.id);
        if (error) return { success: false, error: error.message };
        return { success: true, reactivated: true };
    }

    const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email, source, status: 'active' }]);

    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function bulkImportSubscribers(subscribers: { email: string, name?: string }[]) {
    const supabase = await createClient();

    // Process in batches of 100 to avoid request body limits
    const BATCH_SIZE = 100;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
        const batch = subscribers.slice(i, i + BATCH_SIZE).map(s => ({
            email: s.email,
            name: s.name || '',
            source: 'bulk_import',
            status: 'active'
        }));

        const { error } = await supabase
            .from('newsletter_subscribers')
            .upsert(batch, { onConflict: 'email', ignoreDuplicates: false });

        if (error) {
            console.error('Bulk import error:', error);
            errorCount += batch.length;
        } else {
            successCount += batch.length;
        }
    }

    return {
        success: true,
        imported: successCount,
        errors: errorCount
    };
}
