// import { NextResponse } from 'next/server';
// import { createClient } from '@/lib/supabase/server';
// import { Bug } from '@/features/bugreports/type';
// type ResponseData = {
//   data?: Bug[];
//   error?: string;
// };

// export async function GET(): Promise<NextResponse<ResponseData>> {
//   const supabase = await createClient();
//   const { data, error } = await supabase.from('stakit_bugs').select('*').order('updated_at', { ascending: false });
//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   } else {
//     return NextResponse.json({ data }, { status: 200 });
//   }
// }

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Bug } from '@/features/bugreports/type';
type ResponseData = {
  data?: Bug[];
  error?: string;
};

export async function GET(request: Request): Promise<NextResponse<ResponseData>> {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('stakit_bugs')
    .select('*')
    .order('updated_at', { ascending: false })
    .range(start, end);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    return NextResponse.json({ data }, { status: 200 });
  }
}