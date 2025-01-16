'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface TermsState {
  all: boolean;
  service: boolean;
  personal: boolean;
  content: boolean;
  marketing: boolean;
  advertisement: boolean;
}

type TermKey = keyof TermsState;

interface TermItem {
  key: TermKey;
  label: string;
  required?: boolean;
}

export default function BusinessJoinPage() {
  const [agreeTerms, setAgreeTerms] = useState<TermsState>({
    all: false,
    service: false,
    personal: false,
    content: false,
    marketing: false,
    advertisement: false,
  });

  const [verificationType, setVerificationType] = useState<'본인인증' | '아이핀+휴대폰번호 인증'>('본인인증');

  const toggleAll = (checked: boolean) => {
    setAgreeTerms(prev => Object.keys(prev).reduce((acc, key) => ({
      ...acc,
      [key]: checked
    }), {} as TermsState));
  };

  const termItems: TermItem[] = [
    { key: 'service', label: '(필수) 서비스 이용약관의', required: true },
    { key: 'personal', label: '(필수) 개인정보 수집 및 이용 동의', required: true },
    { key: 'content', label: '(필수) 콘텐서비스 이용약관 동의', required: true },
    { key: 'marketing', label: '(선택) 개인정보수집 및 이용 동의-인재추천 매칭', required: false },
    { key: 'advertisement', label: '(선택) 광고성 정보 수신 동의', required: false },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-xl p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      <h1 className="text-2xl font-bold mb-8">기업 회원가입</h1>
      
      <div className="space-y-6">
        {/* Agreement Section */}
        <div className="space-y-4">
          <h2 className="font-bold flex items-center">
            약관 동의
            <span className="text-red-500 ml-1">*</span>
          </h2>
          
          <div className="border rounded-lg p-4 space-y-3 bg-white shadow-sm">
          <div className="space-y-2 ml-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={agreeTerms.all}
                onChange={(e) => toggleAll(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="font-bold">전체동의</span>
            </label>
            </div>
            <p className="text-sm text-left text-gray-500 ml-6">선택항목 포함 모든 약관에 동의합니다.</p>
            
            <hr className="my-2" />
            
            <div className="space-y-2 ml-6">
              {termItems.map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={agreeTerms[item.key]}
                      onChange={(e) => setAgreeTerms({...agreeTerms, [item.key]: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span>{item.label}</span>
                  </label>
                  <button className="text-gray-400">{'>'}</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Verification Section */}
        <div className="space-y-4">
          <div>
            <label className="font-bold flex items-center">
              본인 인증
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="verification"
                  checked={verificationType === '본인인증'}
                  onChange={() => setVerificationType('본인인증')}
                  className="w-4 h-4"
                />
                <span>본인인증</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="verification"
                  checked={verificationType === '아이핀+휴대폰번호 인증'}
                  onChange={() => setVerificationType('아이핀+휴대폰번호 인증')}
                  className="w-4 h-4"
                />
                <span>아이핀+휴대폰번호 인증</span>
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">본인명의로 개설된 휴대폰 또는 종이인증서로 인증할 수 있습니다.</p>
            <button className="mt-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              인증하기
            </button>
          </div>

          <div>
            <label className="font-bold flex items-center">
              아이디
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input type="text" className="w-full border rounded-lg p-2" />
          </div>

          <div>
            <label className="font-bold flex items-center">
              비밀번호
              <span className="text-red-500 ml-1">*</span>
              <span className="text-gray-400 text-sm ml-2"></span>
            </label>
            <input type="password" className="w-full border rounded-lg p-2" />
          </div>

          <div>
            <label className="font-bold flex items-center">
              비밀번호 확인
              <span className="text-red-500 ml-1">*</span>
              <span className="text-gray-400 text-sm ml-2"></span>
            </label>
            <input type="password" className="w-full border rounded-lg p-2" />
          </div>

          <div>
            <label className="font-bold flex items-center">
              전화번호
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input type="tel" className="w-full border rounded-lg p-2" />
          </div>

          <div>
            <label className="font-bold flex items-center">
              이메일
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input type="email" className="w-full border rounded-lg p-2" />
          </div>

          <div>
            <label className="font-bold flex items-center">
              사업자등록번호
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex gap-2">
              <input type="text" className="flex-1 border rounded-lg p-2" placeholder="-없이 숫자만" />
              <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">확인</button>
            </div>
            <ul className="text-sm text-gray-500 mt-2 space-y-1">
              <li>• 사업자등록번호로 도용 방지를 위해 가입인증을 시행하고 있습니다.</li>
              <li>• 인증이 되지 않을 경우 고객센터(1588-9351)로 문의해 주세요.</li>
              <li>• 개인 및 사업자등록번호/법사무소 면접확인번호 고객센터로 사업자등 록증을 보내주시야 합니다.</li>
            </ul>
          </div>

          <div>
            <label className="font-bold flex items-center">
              회사/점포명
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input type="text" className="w-full border rounded-lg p-2" />
          </div>

          <div>
            <label className="font-bold flex items-center">
              대표자명
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input type="text" className="w-full border rounded-lg p-2" />
          </div>

          <div>
            <label className="font-bold flex items-center">
              회사/점포 주소
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex gap-2">
              <input type="text" className="flex-1 border rounded-lg p-2" />
              <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">주소검색</button>
            </div>
            <input type="text" className="w-full border rounded-lg p-2 mt-2" />
          </div>
        </div>

        {/* Submit Button */}
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 transition-colors">
          가입하기
        </button>
      </div>
    </div>
  );
}