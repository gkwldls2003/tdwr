import { writeFile, mkdir } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import crypto from 'crypto';

// 설정
const UPLOAD_DIR = `${process.env.UPLOAD_DIR}`;

// 안전한 파일명 생성 함수
function generateSafeFileName(): string {
  const randomName = crypto.randomBytes(16).toString('hex');
  const timestamp = new Date().getTime();
  return `${randomName}-${timestamp}`;
}

// 업로드 디렉토리 생성 함수
async function ensureUploadDirectory(uploadDir: string) {
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (error) {
    if ((error as any).code !== 'EEXIST') {
      throw error;
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    // 안전한 파일명 생성
    const stre_file_nm = generateSafeFileName();

    // 연/월 기준으로 업로드 디렉토리 구성
    const date = new Date();
    const yearMonth = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    const uploadPath = path.join(UPLOAD_DIR, yearMonth);

    // 업로드 디렉토리 생성
    await ensureUploadDirectory(uploadPath);

    // 파일 데이터를 버퍼로 변환
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 최종 파일 경로
    const filePath = path.join(uploadPath, stre_file_nm);

    // 파일 저장
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      stre_file_nm: stre_file_nm,
      orignl_file_nm: file.name,
      file_stre_cours: uploadPath,
      file_size: file.size,
      ext: file.name.split('.')[1]
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      success: false,
      message: "파일 업로드 중 오류가 발생했습니다."
    }, { 
      status: 400 
    });
  }
}