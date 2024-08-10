import { NextResponse } from "next/server";
import { createZKInstance } from "../Util";

export async function GET() {
  const zkInstance = createZKInstance();

  try {
    // Create socket to machine
    await zkInstance.createSocket();

    // Delete the ALL data in the machine
    // You should do this when there is too much data in the machine, as this issue can slow down the machine
    zkInstance.clearAttendanceLog();
    
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
