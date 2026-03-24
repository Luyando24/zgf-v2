'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function saveCampaignDraft(id: string | null, subject: string, content: string) {
    const supabase = await createClient();

    const data = {
        subject,
        content,
        status: 'draft',
        updated_at: new Date().toISOString()
    };

    if (id) {
        const { error } = await supabase.from('newsletter_campaigns').update(data).eq('id', id);
        if (error) return { success: false, error: error.message };
        revalidatePath('/admin/newsletter/campaigns');
        return { success: true, id };
    } else {
        const { data: inserted, error } = await supabase.from('newsletter_campaigns').insert([data]).select('id').single();
        if (error) return { success: false, error: error.message };
        revalidatePath('/admin/newsletter/campaigns');
        return { success: true, id: inserted.id };
    }
}

export async function scheduleCampaign(id: string, scheduledAt: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('newsletter_campaigns')
        .update({
            status: 'scheduled',
            scheduled_at: scheduledAt,
            updated_at: new Date().toISOString()
        })
        .eq('id', id);

    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/newsletter/campaigns');
    return { success: true };
}

export async function sendCampaignNow(id: string) {
    const supabase = await createClient();

    // Set status to sending
    await supabase.from('newsletter_campaigns').update({ status: 'sending' }).eq('id', id);

    // Get the campaign details
    const { data: campaign, error: campError } = await supabase
        .from('newsletter_campaigns')
        .select('*')
        .eq('id', id)
        .single();

    if (campError || !campaign) {
        await supabase.from('newsletter_campaigns').update({ status: 'failed' }).eq('id', id);
        return { success: false, error: 'Campaign not found' };
    }

    // Get SMTP Settings
    const { data: settings } = await supabase.from('settings').select('smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from_email, smtp_from_name').single();

    if (!settings?.smtp_host || !settings?.smtp_user || !settings?.smtp_pass) {
        await supabase.from('newsletter_campaigns').update({ status: 'failed' }).eq('id', id);
        return { success: false, error: 'SMTP settings are not configured in Site Settings. Please configure them before sending.' };
    }

    // Get active subscribers
    const { data: subscribers, error: subsError } = await supabase
        .from('newsletter_subscribers')
        .select('email')
        .eq('status', 'active');

    if (subsError || !subscribers || subscribers.length === 0) {
        await supabase.from('newsletter_campaigns').update({ status: 'failed' }).eq('id', id);
        return { success: false, error: 'No active subscribers found.' };
    }

    try {
        // Setup Nodemailer transporter
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            host: settings.smtp_host,
            port: settings.smtp_port || 587,
            secure: settings.smtp_port === 465, // true for 465, false for 587
            auth: {
                user: settings.smtp_user,
                pass: settings.smtp_pass,
            },
        });

        // Send emails
        // For larger lists, BCC is used to send one email that reaches everyone
        const bccList = subscribers.map(s => s.email).join(',');
        const fromHeader = settings.smtp_from_name
            ? `"${settings.smtp_from_name}" <${settings.smtp_from_email}>`
            : settings.smtp_from_email;

        await transporter.sendMail({
            from: fromHeader,
            bcc: bccList,
            subject: campaign.subject,
            html: campaign.content,
        });

        console.log(`[NEWSLETTER ENGINE] Successfully sent campaign ID ${id} using SMTP to ${subscribers.length} recipients.`);

        // Mark as sent
        const { error: updateError } = await supabase
            .from('newsletter_campaigns')
            .update({
                status: 'sent',
                sent_at: new Date().toISOString(),
                total_recipients: subscribers.length,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (updateError) return { success: false, error: updateError.message };

        revalidatePath('/admin/newsletter/campaigns');
        return { success: true, recipients: subscribers.length };

    } catch (error: any) {
        console.error('[NEWSLETTER ENGINE] SMTP Error:', error);
        await supabase.from('newsletter_campaigns').update({ status: 'failed' }).eq('id', id);
        return { success: false, error: `SMTP Error: ${error.message}` };
    }
}

export async function deleteCampaign(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('newsletter_campaigns').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/newsletter/campaigns');
    return { success: true };
}
