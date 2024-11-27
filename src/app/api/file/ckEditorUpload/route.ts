import { writeFile, mkdir } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import crypto from 'crypto';
import { inserCkEditorFileDataQuery } from '../../../../../common/querys/cmm/page';

// 설정
const UPLOAD_DIR = `${process.env.UPLOAD_DIR}`;
const MAX_FILE_SIZE = 2 * 1024 * 1024; //2메가
const ALLOWED_FILE_TYPES = ['jfif','pjpeg','jpeg','pip','jpg','png','gif','bmp']; //허용 파일

//파일 유효성 검사
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
  const fileExt = file.name.split('.')[1];
  if (!ALLOWED_FILE_TYPES.includes(fileExt)) {
    return {
      isValid: false,
      message: "지원하지 않는 파일 형식입니다."
    };
  }

  return { isValid: true };
}


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
    const user_id = formData.get('user_id');

    //파일 유효성 검사
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

    const params = [stre_file_nm, file.name, uploadPath, file.size, file.name.split('.')[1], user_id];
    await inserCkEditorFileDataQuery(params);

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