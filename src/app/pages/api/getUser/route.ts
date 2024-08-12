import { NextResponse } from 'next/server';
import { createZKInstance } from '../Util';

export async function GET() {
    const zkInstance = createZKInstance();

  try {
    // Create socket to machine
    await zkInstance.createSocket();

    // Get all attendance in the machine
    const users = await zkInstance.getUsers();
    //console.log(users);


    // Respond with the gathered data
    return NextResponse.json({ users });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

/*
* this is the json format of the fetch users

need parsing of role; Admin=14, User=0,
{
  data: [
    {
      uid: 2,
      role: 0,
      password: '',
      name: 'User',
      cardno: 0,
      userId: '2'
    },
  ],
  err: undefined
}
 */