import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getProjects, getExperiences, createProject, createExperience,
  updateProject, updateExperience, deleteProject, deleteExperience,
} from '@/lib/data';

async function isAuthorized() {
  const session = await getServerSession(authOptions);
  return session?.user?.login === process.env.GITHUB_ADMIN_USERNAME;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  try {
    if (type === 'projects') return NextResponse.json(await getProjects());
    if (type === 'experience') return NextResponse.json(await getExperiences());
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!await isAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { type, data } = await request.json();
    if (type === 'projects') return NextResponse.json(await createProject(data), { status: 201 });
    if (type === 'experience') return NextResponse.json(await createExperience(data), { status: 201 });
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create data' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!await isAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { type, id, data } = await request.json();
    let result;
    if (type === 'projects') result = await updateProject(id, data);
    else if (type === 'experience') result = await updateExperience(id, data);
    else return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

    if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!await isAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { type, id } = await request.json();
    let success = false;
    if (type === 'projects') success = await deleteProject(id);
    else if (type === 'experience') success = await deleteExperience(id);
    else return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    
    if (!success) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
  }
}