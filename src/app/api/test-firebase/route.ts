import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {  
    const { ip } = await request.json();

    if (!ip) {
      return NextResponse.json({ success: false, message: 'IP address is required' }, { status: 400 });
    }

    console.log('Sending request to PHP API with IP:', ip);
    const response = await axios.post('https://chocolate-tapir-277497.hostingersite.com/zk_api.php', { ip });
    
    console.log('PHP API Response:', response.data);

    if (!response.data.success) {
      return NextResponse.json({ success: false, message: response.data.message }, { status: 400 });
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      return NextResponse.json({ success: false, message }, { status: error.response?.status || 500 });
    }
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}