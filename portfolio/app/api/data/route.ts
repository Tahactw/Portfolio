import { NextRequest, NextResponse } from 'next/server';
import { getProjects } from '@/lib/data';

// --- SIMPLIFIED GET HANDLER ---
// This API route now only serves project data and has no other responsibilities.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  
  try {
    if (type === 'projects') {
      const projects = await getProjects();
      return NextResponse.json(projects);
    }
    // All other types and methods are no longer supported
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

// POST, PUT, DELETE handlers are removed as the admin panel is no longer part of the scope.