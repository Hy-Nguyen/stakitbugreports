import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type ResponseData = {
  images?: string[];
  error?: string;
};

export async function GET(req: NextRequest): Promise<NextResponse<ResponseData>> {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const supabase = await createClient();
  const { data, error } = await supabase.from('stakit_bugs').select('images').eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const images = data.map((item: { images: string[] }) => item.images).flat();
    return NextResponse.json({ images }, { status: 200 });
  }
}
