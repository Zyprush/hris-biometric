import { NextResponse } from 'next/server';
import { createZKInstance } from '../Util';

interface Info {
  userCounts: number;
  logCounts: number;
  logCapacity: number;
}

export async function GET() {
  const zkInstance = createZKInstance();

  try {
    // Create socket to machine
    await zkInstance.createSocket();

    // Get general info like logCapacity, user counts, logs count
    const info: Info = await zkInstance.getInfo();
    //console.log(info);

    // Disconnect the machine
    // await zkInstance.disconnect();

    // Respond with the gathered data
    return NextResponse.json({ info });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
