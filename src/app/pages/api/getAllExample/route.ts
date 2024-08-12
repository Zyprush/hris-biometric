import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Simulated example data for attendances
    const attendances = {
      data: [
        {
          userSn: 64,
          deviceUserId: "3",
          recordTime: "2024-08-10T00:43:31.000Z",
          ip: "192.168.1.169"
        },
        {
          userSn: 65,
          deviceUserId: "4",
          recordTime: "2024-08-10T08:20:11.000Z",
          ip: "192.168.1.169"
        }
      ]
    };

    // Simulated example data for users
    const users = {
      data: [
        {
          uid: 2,
          role: 0,
          password: '',
          name: 'User One',
          cardno: 0,
          userId: '2'
        },
        {
          uid: 3,
          role: 14,
          password: '',
          name: 'Admin User',
          cardno: 123456,
          userId: '3'
        }
      ],
      err: undefined
    };

    // Simulated example data for device info
    const info = {
      userCounts: 100,
      logCounts: 5000,
      logCapacity: 10000
    };

    // Respond with the simulated data
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
