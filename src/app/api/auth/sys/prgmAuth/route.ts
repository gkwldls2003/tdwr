import { NextRequest, NextResponse } from "next/server";
import { selectUserAuthPrgmQuery } from "../../../../../../common/querys/auth/page";

export async function POST(req: NextRequest) {
  try {
    const data  = await req.json();
    const prgmList = await selectUserAuthPrgmQuery([data.author_id]);
    return NextResponse.json(prgmList.data);
  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: error
    });
  }
  
}
