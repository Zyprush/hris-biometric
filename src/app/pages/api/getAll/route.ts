import { NextResponse } from "next/server";
import { createZKInstance } from "../Util";

export async function GET() {
  const zkInstance = createZKInstance();

  try {
    // Create socket to machine
    await zkInstance.createSocket();

    // Get all attendance in the machine
    const attendances = await zkInstance.getAttendances();
    const users = await zkInstance.getUsers();
    const info = await zkInstance.getInfo();

    // Read real-time logs
    zkInstance.getRealTimeLogs((data: any) => {
      // Handle real-time log data
      console.log(data);
    });

    // Respond with the gathered data
    return NextResponse.json({
      attendances,
      users,
      info,
      success: true,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

//attendance format:
/**
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
 */
//user format:
/**
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
