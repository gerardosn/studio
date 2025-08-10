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
      return []; // Return empty array if file does not exist
    }
    throw error; // Re-throw other errors
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, Password } = await req.json();

    if (!user || !Password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    const users = await readDb();
    
    const foundUser = users.find(u => u.user === user && u.Password === Password);

    if (foundUser) {
      return NextResponse.json({ success: true, message: 'Login successful' });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

  } catch (error) {
    console.error('Failed to authenticate user:', error);
    return NextResponse.json({ message: 'Failed to authenticate user' }, { status: 500 });
  }
}
