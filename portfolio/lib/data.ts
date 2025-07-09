import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

const dataDir = path.join(process.cwd(), 'data');
const projectsPath = path.join(dataDir, 'projects.json');
const experiencePath = path.join(dataDir, 'experience.json');

export interface Project {
  id: string; 
  title: string; 
  description: string; 
  category: string;
  thumbnail: string;
  images: string[]; 
  tags: string[];
  links: { github?: string; live?: string; youtube?: string; };
  order: number; 
  createdAt: string; 
  updatedAt: string;
}

export interface Experience {
  id: string; 
  title: string; 
  company: string; 
  description: string;
  startDate: string; 
  endDate: string | null; 
  current: boolean;
  skills: string[]; 
  order: number; 
  createdAt: string; 
  updatedAt: string;
}

async function readDataFile<T>(filePath: string, defaultData: { [key: string]: T[] }): Promise<{ [key: string]: T[] }> {
  try {
    await fs.access(filePath);
    return JSON.parse(await fs.readFile(filePath, 'utf-8'));
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
}

const getProjects = async (): Promise<Project[]> => {
  const data = await readDataFile<Project>(projectsPath, { projects: [] });
  return data.projects.sort((a, b) => a.order - b.order);
};

const getProject = async (id: string): Promise<Project | null> => {
  const projects = await getProjects();
  return projects.find(p => p.id === id) || null;
};

const createProject = async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'order'>): Promise<Project> => {
  const fileData = await readDataFile<Project>(projectsPath, { projects: [] });
  const newProject: Project = { 
    ...data, 
    id: nanoid(), 
    order: fileData.projects.length, 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  };
  fileData.projects.push(newProject);
  await fs.writeFile(projectsPath, JSON.stringify(fileData, null, 2));
  return newProject;
};

const updateProject = async (id: string, updates: Partial<Project>): Promise<Project | null> => {
  const fileData = await readDataFile<Project>(projectsPath, { projects: [] });
  const index = fileData.projects.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  fileData.projects[index] = { 
    ...fileData.projects[index], 
    ...updates, 
    updatedAt: new Date().toISOString() 
  };
  await fs.writeFile(projectsPath, JSON.stringify(fileData, null, 2));
  return fileData.projects[index];
};

const deleteProject = async (id: string): Promise<boolean> => {
  const fileData = await readDataFile<Project>(projectsPath, { projects: [] });
  const filtered = fileData.projects.filter(p => p.id !== id);
  if (filtered.length === fileData.projects.length) return false;
  
  fileData.projects = filtered.map((p, i) => ({ ...p, order: i }));
  await fs.writeFile(projectsPath, JSON.stringify(fileData, null, 2));
  return true;
};

const getExperiences = async (): Promise<Experience[]> => {
  const data = await readDataFile<Experience>(experiencePath, { experience: [] });
  return data.experience.sort((a, b) => a.order - b.order);
};

const createExperience = async (data: Omit<Experience, 'id' | 'createdAt' | 'updatedAt' | 'order'>): Promise<Experience> => {
  const fileData = await readDataFile<Experience>(experiencePath, { experience: [] });
  const newExperience: Experience = { 
    ...data, 
    id: nanoid(), 
    order: fileData.experience.length, 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  };
  fileData.experience.push(newExperience);
  await fs.writeFile(experiencePath, JSON.stringify(fileData, null, 2));
  return newExperience;
};

const updateExperience = async (id: string, updates: Partial<Experience>): Promise<Experience | null> => {
  const fileData = await readDataFile<Experience>(experiencePath, { experience: [] });
  const index = fileData.experience.findIndex(e => e.id === id);
  if (index === -1) return null;
  
  fileData.experience[index] = { 
    ...fileData.experience[index], 
    ...updates, 
    updatedAt: new Date().toISOString() 
  };
  await fs.writeFile(experiencePath, JSON.stringify(fileData, null, 2));
  return fileData.experience[index];
};

const deleteExperience = async (id: string): Promise<boolean> => {
  const fileData = await readDataFile<Experience>(experiencePath, { experience: [] });
  const filtered = fileData.experience.filter(e => e.id !== id);
  if (filtered.length === fileData.experience.length) return false;
  
  fileData.experience = filtered.map((e, i) => ({ ...e, order: i }));
  await fs.writeFile(experiencePath, JSON.stringify(fileData, null, 2));
  return true;
};

export { 
  getProjects, 
  getProject, 
  createProject, 
  updateProject, 
  deleteProject,
  getExperiences, 
  createExperience, 
  updateExperience, 
  deleteExperience
};