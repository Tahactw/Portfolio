import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'projects.json');

async function getProjects() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return { projects: [] };
  }
}

async function saveProjects(data: any) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  const data = await getProjects();
  return NextResponse.json(data.projects);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const data = await getProjects();
  
  const newProject = {
    id: `proj-${Date.now()}`,
    ...body
  };
  
  data.projects.push(newProject);
  await saveProjects(data);
  
  return NextResponse.json(newProject);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const data = await getProjects();
  
  const index = data.projects.findIndex((p: any) => p.id === body.id);
  if (index !== -1) {
    data.projects[index] = body;
    await saveProjects(data);
    return NextResponse.json(body);
  }
  
  return NextResponse.json({ error: 'Project not found' }, { status: 404 });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }
  
  const data = await getProjects();
  data.projects = data.projects.filter((p: any) => p.id !== id);
  await saveProjects(data);
  
  return NextResponse.json({ success: true });
}