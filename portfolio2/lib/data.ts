import fs from 'fs/promises';
import path from 'path';

// --- SIMPLIFIED PROJECT INTERFACE ---
// This now matches the structure in data/projects.json
export interface Project {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  brief: string;
  link: string;
}

const dataDir = path.join(process.cwd(), 'data');
const projectsPath = path.join(dataDir, 'projects.json');

async function readProjectsFile(): Promise<{ projects: Project[] }> {
  try {
    await fs.access(projectsPath);
    const data = JSON.parse(await fs.readFile(projectsPath, 'utf-8'));
    return data;
  } catch {
    // If the file doesn't exist, return a default empty structure
    return { projects: [] };
  }
}

// --- SIMPLIFIED GET PROJECTS FUNCTION ---
// The only data function we now need for the frontend.
export const getProjects = async (): Promise<Project[]> => {
  const data = await readProjectsFile();
  // No sorting needed as we are not managing order via an admin panel anymore
  return data.projects || [];
};

// --- REMOVED UNUSED FUNCTIONS ---
// getProject, createProject, updateProject, deleteProject are removed.
// All Experience-related functions are removed.
// GalleryItem and Experience interfaces are removed.