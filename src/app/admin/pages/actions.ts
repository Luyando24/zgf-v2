/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// ==========================================
// HOME PAGE ACTIONS
// ==========================================
export async function getHomePageContent() {
    const supabase = await createClient();

    const [aboutRes, statsRes] = await Promise.all([
        supabase.from('about_sections').select('*').in('type', ['home_about_snippet', 'about_mission', 'about_vision']).order('id', { ascending: true }),
        supabase.from('stats').select('*').order('order', { ascending: true })
    ]);

    return {
        about: aboutRes.data || [],
        stats: statsRes.data || []
    };
}

export async function saveHomeAboutSnippet(id: string, title: string, content: string, image: string | null) {
    const supabase = await createClient();
    const { error } = await supabase.from('about_sections').update({ title, content, image }).eq('id', id);
    if (!error) revalidatePath('/');
    return { success: !error, error: error?.message };
}

export async function saveHomeStats(stats: any[]) {
    const supabase = await createClient();
    const { error } = await supabase.from('stats').upsert(stats.map((s, i) => ({ ...s, order: i + 1 })));
    if (!error) revalidatePath('/');
    return { success: !error, error: error?.message };
}

// ==========================================
// ABOUT PAGE ACTIONS
// ==========================================
export async function getAboutPageContent() {
    const supabase = await createClient();
    const { data } = await supabase.from('about_sections')
        .select('*')
        .in('type', ['about_intro', 'about_mission', 'about_vision', 'about_value', 'about_journey'])
        .order('order', { ascending: true })
        .order('id', { ascending: true });
    return data || [];
}

export async function saveAboutPageContent(items: any[]) {
    const supabase = await createClient();
    // Keep 'order' consistent and upsert
    const { error } = await supabase.from('about_sections').upsert(items.map((item, i) => ({ ...item, order: i + 1 })));
    if (!error) revalidatePath('/about');
    return { success: !error, error: error?.message };
}

// ==========================================
// PILLARS PAGE ACTIONS
// ==========================================
export async function getPillarsContent() {
    const supabase = await createClient();
    const [pillarsRes, statsRes] = await Promise.all([
        supabase.from('pillars').select('*').order('order', { ascending: true }),
        supabase.from('about_sections').select('*').eq('type', 'pillar_stat').order('order', { ascending: true })
    ]);
    return {
        pillars: pillarsRes.data || [],
        stats: statsRes.data || []
    };
}

export async function savePillars(pillars: any[], stats: any[]) {
    const supabase = await createClient();
    
    // Prepare pillars for saving
    const pillarsToSave = pillars.map((p, i) => {
        const { id, ...rest } = p;
        // If id is a temporary string, don't include it so Postgres generates a real one
        const isTempId = typeof id === 'string' && (id.startsWith('temp-') || id.startsWith('default-'));
        return {
            ...(isTempId ? {} : { id }),
            ...rest,
            order: i + 1,
            is_active: true
        };
    });

    // Prepare stats for saving
    const statsToSave = stats.map((s, i) => {
        const { id, ...rest } = s;
        const isTempId = typeof id === 'string' && (id.startsWith('temp-') || id.startsWith('default-'));
        return {
            ...(isTempId ? {} : { id }),
            ...rest,
            type: 'pillar_stat',
            order: i + 1,
            is_active: true
        };
    });

    const [pillarsRes, statsRes] = await Promise.all([
        supabase.from('pillars').upsert(pillarsToSave),
        supabase.from('about_sections').upsert(statsToSave)
    ]);

    const error = pillarsRes.error || statsRes.error;
    if (!error) revalidatePath('/pillars');
    return { success: !error, error: error?.message };
}

export async function deletePillar(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('pillars').delete().eq('id', id);
    if (!error) revalidatePath('/pillars');
    return { success: !error, error: error?.message };
}

export async function deletePillarStat(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('about_sections').delete().eq('id', id);
    if (!error) revalidatePath('/pillars');
    return { success: !error, error: error?.message };
}

// ==========================================
// SERVICES / WHAT WE DO ACTIONS
// ==========================================
export async function getServicesContent() {
    const supabase = await createClient();
    const { data } = await supabase.from('services').select('*').order('id', { ascending: true });
    return data || [];
}

export async function saveServices(services: any[]) {
    const supabase = await createClient();
    const { error } = await supabase.from('services').upsert(services);
    if (!error) revalidatePath('/what-we-do');
    return { success: !error, error: error?.message };
}

// ==========================================
// COMMUNITIES ACTIONS
// ==========================================
export async function getCommunitiesContent() {
    const supabase = await createClient();
    const [communities, sections] = await Promise.all([
        supabase.from('communities').select('*').order('order', { ascending: true }),
        supabase.from('about_sections')
            .select('*')
            .in('type', ['community_partnership', 'community_impact_stat'])
            .order('order', { ascending: true })
            .order('id', { ascending: true })
    ]);

    return {
        communities: communities.data || [],
        partnerships: sections.data?.filter(s => s.type === 'community_partnership') || [],
        stats: sections.data?.filter(s => s.type === 'community_impact_stat') || []
    };
}

export async function saveCommunities(communities: any[], partnerships: any[], stats: any[]) {
    const supabase = await createClient();

    // Prepare communities for saving
    const communitiesToSave = communities.map((c, i) => {
        const { id, ...rest } = c;
        const isTempId = typeof id === 'string' && (id.startsWith('temp-') || id.startsWith('default-'));
        return {
            ...(isTempId ? {} : { id }),
            ...rest,
            order: i + 1,
            is_active: true
        };
    });

    // Prepare partnerships for saving
    const partnershipsToSave = partnerships.map((p, i) => {
        const { id, ...rest } = p;
        const isTempId = typeof id === 'string' && (id.startsWith('temp-') || id.startsWith('default-'));
        return {
            ...(isTempId ? {} : { id }),
            ...rest,
            type: 'community_partnership',
            order: i + 1,
            is_active: true
        };
    });

    // Prepare stats for saving
    const statsToSave = stats.map((s, i) => {
        const { id, ...rest } = s;
        const isTempId = typeof id === 'string' && (id.startsWith('temp-') || id.startsWith('default-'));
        return {
            ...(isTempId ? {} : { id }),
            ...rest,
            type: 'community_impact_stat',
            order: i + 1,
            is_active: true
        };
    });

    const [commRes, partRes, statsRes] = await Promise.all([
        supabase.from('communities').upsert(communitiesToSave),
        supabase.from('about_sections').upsert(partnershipsToSave),
        supabase.from('about_sections').upsert(statsToSave)
    ]);

    const error = commRes.error || partRes.error || statsRes.error;
    if (!error) revalidatePath('/communities');
    return { success: !error, error: error?.message };
}

export async function deleteCommunity(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('communities').delete().eq('id', id);
    if (!error) revalidatePath('/communities');
    return { success: !error, error: error?.message };
}

export async function deleteAboutSection(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('about_sections').delete().eq('id', id);
    if (!error) revalidatePath('/communities');
    return { success: !error, error: error?.message };
}

// ==========================================
// HOW WE DO IT ACTIONS
// ==========================================
export async function getHowWeDoItContent() {
    const supabase = await createClient();
    const { data } = await supabase.from('about_sections')
        .select('*')
        .in('type', ['how_we_do_it_methodology', 'how_we_do_it_process', 'how_we_do_it_strategy', 'how_we_do_it_success_story'])
        .order('order', { ascending: true })
        .order('id', { ascending: true });
    return data || [];
}

export async function saveHowWeDoItContent(items: any[]) {
    const supabase = await createClient();
    const { error } = await supabase.from('about_sections').upsert(items.map((item, i) => ({ 
        ...item, 
        order: item.order || i + 1 
    })));
    if (!error) revalidatePath('/how-we-do-it');
    return { success: !error, error: error?.message };
}
