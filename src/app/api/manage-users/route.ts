
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'UsersFakeDB.json');

async function readDb(): Promise<any[]> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(dbPath, JSON.stringify([], null, 2), 'utf-8');
      return []; 
    }
    throw error;
  }
}

async function writeDb(data: any[]): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const users = await readDb();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to read user database:', error);
    return NextResponse.json({ message: 'Failed to read user database' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, Password } = await req.json();

    if (!user || !Password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    const users = await readDb();

    if (users.length > 0) {
      users[0] = { user, Password };
    } else {
      users.push({ user, Password });
    }
    
    await writeDb(users);

    return NextResponse.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json({ message: 'Failed to update user' }, { status: 500 });
  }
}
