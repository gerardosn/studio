import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import type { Website } from '@/lib/types';

const dbPath = path.join(process.cwd(), 'fakeDB.json');

async function readDb(): Promise<Website[]> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data) as Website[];
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return []; // Return empty array if file does not exist
    }
    throw error; // Re-throw other errors
  }
}

async function writeDb(data: Website[]): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const websites = await readDb();
    return NextResponse.json(websites);
  } catch (error) {
    console.error('Failed to read database:', error);
    return NextResponse.json({ message: 'Failed to read database' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, url } = (await req.json()) as { name: string; url: string };

    if (!name || !url) {
      return NextResponse.json({ message: 'Name and URL are required' }, { status: 400 });
    }

    const websites = await readDb();
    
    if (websites.some(site => site.url === url)) {
        return NextResponse.json({ message: 'Website with this URL already exists' }, { status: 409 });
    }

    const newWebsite: Website = {
      id: crypto.randomUUID(),
      name,
      url,
      count: 0,
    };

    websites.push(newWebsite);
    await writeDb(websites);

    return NextResponse.json(newWebsite, { status: 201 });
  } catch (error) {
    console.error('Failed to add website:', error);
    return NextResponse.json({ message: 'Failed to add website' }, { status: 500 });
  }
}
