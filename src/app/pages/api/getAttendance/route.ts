import { NextResponse } from 'next/server';
import { createZKInstance } from '../Util';

export async function GET() {
    const zkInstance = createZKInstance();

  try {
    // Create socket to machine
    await zkInstance.createSocket();

    // Get all attendance in the machine
    const attendances = await zkInstance.getAttendances();
    //console.log(attendances);


    // Respond with the gathered data
    return NextResponse.json({ attendances });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
/**
 * this is the format to be fetched in json format
{
  "attendances": {
    "data": [
      {
        "userSn": 64,
        "deviceUserId": "3",
        "recordTime": "2024-08-10T00:43:31.000Z",
        "ip": "192.168.1.169"
      },
    ]
  }
}
  kulang ng TYPE (check-in, check out)
 */