import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import path from 'path';
import { selectOneCkEditorDataQuery } from '../../../../../../common/querys/cmm/page';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // URL에서 파일 경로 가져오기
    const { id } = params;
    const result = await selectOneCkEditorDataQuery([id]);

    const streFileNm = result.stre_file_nm;
    const fileStreCrse = result.file_stre_cours;
    const orginalFileNm = result.orignl_file_nm;
    const ext = result.ext;
    const fullPath = path.join(fileStreCrse,streFileNm);

    // 파일 존재 여부 확인
    try {

      await stat(fullPath);

    } catch {

      return NextResponse.json({ 
        message: "파일을 찾을 수 없습니다."
      }, { status: 404 });

    }

    // 파일 읽기
    const fileBuffer = await readFile(fullPath);

    const contentType = getContentType(ext);

    // 응답 헤더 설정
    const headers = new Headers({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename=${encodeURIComponent(orginalFileNm)}`,
      'Content-Length': fileBuffer.length.toString()
    });

    return new NextResponse(fileBuffer, {
      headers,
      status: 200,
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ 
      message: "파일 다운로드 중 오류가 발생했습니다." 
    }, { status: 500 });
  }
}

// Content-Type 매핑 함수
function getContentType(ext: string): string {
  const contentTypes: Record<string, string> = {
    '.txt': 'text/plain',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.zip': 'application/zip',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg'
  };

  return contentTypes[ext] || 'application/octet-stream';
}