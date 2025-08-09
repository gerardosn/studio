
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'fakeUsersDB.json');

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    let usersData;
    try {
        const fileContents = await fs.readFile(dbPath, 'utf-8');
        usersData = JSON.parse(fileContents);
    } catch (error) {
        console.error("Could not read or parse user database:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
    
    if (username === usersData.usu && password === usersData.pass) {
        // In a real app, generate a secure JWT. For this prototype, a simple token is fine.
        const token = 'fake-auth-token'; 
        return NextResponse.json({ success: true, token });
    } else {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}
