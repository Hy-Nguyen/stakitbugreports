import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Bug } from '@/features/bugreports/type';
type ResponseData = {
  data?: Omit<Bug, 'images'>[];
  error?: string;
};

export async function GET(): Promise<NextResponse<ResponseData>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('stakit_bugs')
    .select('id, title, url, description, category, status, created_at, updated_at, author, resolved_at, image_count, dev_note')
    .order('updated_at', { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    return NextResponse.json({ data }, { status: 200 });
  }
}
