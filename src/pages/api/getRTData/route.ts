import { NextResponse } from "next/server";
import { createZKInstance } from "../Util";


export async function GET() {
  const zkInstance = createZKInstance();

  try {
    // Create socket to machine
    await zkInstance.createSocket();

    // You can also read realtime log by getRealTimelogs function
    zkInstance.getRealTimeLogs((data: any) => {
      // Do something when someone checks in
      console.log(data);
    });

    // Disconnect the machine
    // await zkInstance.disconnect();

    // Respond with the gathered data
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
