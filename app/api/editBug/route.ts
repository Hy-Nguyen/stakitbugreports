import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { image_count, ...updateData } = body;

  const supabase = await createClient();
  const { error } = await supabase.from('stakit_bugs').update(updateData).eq('id', body.id);
  console.log(error);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: 'Bug updated successfully' }, { status: 200 });
}
