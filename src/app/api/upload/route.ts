import { writeFile, mkdir } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import crypto from 'crypto';

// 설정
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

// 허용된 파일 형식
const ALLOWED_FILE_TYPES = {
  // 이미지
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  // 문서
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  // 기타
  'text/plain': '.txt',
  'application/zip': '.zip'
};

// 안전한 파일명 생성 함수
function generateSafeFileName(originalName: string, fileType: string): string {
  const fileExtension = ALLOWED_FILE_TYPES[fileType as keyof typeof ALLOWED_FILE_TYPES];
  const randomName = crypto.randomBytes(16).toString('hex');
  const timestamp = new Date().getTime();
  return `${randomName}-${timestamp}${fileExtension}`;
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

// 파일 검증 함수
function validateFile(file: File): { isValid: boolean; message?: string } {
  // 파일 존재 여부 확인
  if (!file) {
    return {
      isValid: false,
      message: "파일이 없습니다."
    };
  }

  // 파일 크기 검사
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      message: `파일 크기는 ${MAX_FILE_SIZE / (1024 * 1024)}MB를 초과할 수 없습니다.`
    };
  }

  // 파일 형식 검사
  if (!ALLOWED_FILE_TYPES.hasOwnProperty(file.type)) {
    return {
      isValid: false,
      message: "지원하지 않는 파일 형식입니다."
    };
  }

  return { isValid: true };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    // 파일 검증
    const validation = validateFile(file);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        message: validation.message
      }, {
        status: 400
      });
    }

    // 안전한 파일명 생성
    const safeFileName = generateSafeFileName(file.name, file.type);

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
    const filePath = path.join(uploadPath, safeFileName);

    // 파일 저장
    await writeFile(filePath, buffer);

    // 클라이언트에서 접근 가능한 URL 생성 (public 폴더 기준)
    const fileUrl = `/uploads/${yearMonth}/${safeFileName}`;

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: safeFileName,
      originalName: file.name,
      fileSize: file.size,
      fileType: file.type
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