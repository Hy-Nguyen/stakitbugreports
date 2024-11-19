import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = await createClient();
  const { data, error } = await supabase.from('stakit_bugs').insert(body).select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data }, { status: 200 });
}
