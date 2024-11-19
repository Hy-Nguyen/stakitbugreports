import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Bug } from '@/features/bugreports/type';

export async function DELETE(request: Request): Promise<NextResponse> {
  const supabase = await createClient();
  const body = await request.json();

  const response = await supabase.from('stakit_bugs').delete().eq('id', body.id);
  if (response.error) {
    return NextResponse.json({ error: response.error.message }, { status: 500 });
  } else {
    return NextResponse.json({ data: response.data }, { status: 200 });
  }
}
