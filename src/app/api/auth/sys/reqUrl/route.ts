import { NextRequest, NextResponse } from "next/server";
import logger from "../../../../../../common/utils/log/logger";

export async function POST(req: NextRequest) {
  try {
    const data  = await req.json();
    logger.info({
      info: data.remoteUrl,
      message: "============= RequestURL INFO =============" 
    });
  
    logger.info({
      info: data.remoteIp,
      message: "============= RequestIp INFO =============" 
    });
    return NextResponse.json({ url: data.remoteUrl ,ip: data.remoteIp });
  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: error
    });
  }
}

export async function GET(req: NextRequest) {
  const remoteUrl = req.headers.get('referer');
  const remoteIp = req.headers.get('x-forwarded-for');
  return NextResponse.json({ url: remoteUrl, ip: remoteIp });

}