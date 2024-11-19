import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Bug } from '@/features/bugreports/type';
type ResponseData = {
  data?: Bug[];
  error?: string;
};

export async function GET(): Promise<NextResponse<ResponseData>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('stakit_bugs').select('*').order('updated_at', { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    return NextResponse.json({ data }, { status: 200 });
  }
}
