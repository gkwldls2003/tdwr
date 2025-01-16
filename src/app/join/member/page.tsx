'use client'

import React, { useState } from 'react';

interface TermsState {
  all: boolean;
  age: boolean;
  service: boolean;
  personal: boolean;
  marketing: boolean;
  sms: boolean;
  personalMarketing: boolean;
}

type TermKey = keyof TermsState;

interface TermItem {
  key: TermKey;
  label: string;
}

export default function JoinMemberPage() {
  const [agreeTerms, setAgreeTerms] = useState<TermsState>({
    all: false,
    age: false,
    service: false,
    personal: false,
    marketing: false,
    sms: false,
    personalMarketing: false,
  });

  const toggleAll = (checked: boolean) => {
    setAgreeTerms({
      all: checked,
      age: checked,
      service: checked,
      personal: checked,
      marketing: checked,
      sms: checked,
      personalMarketing: checked,
    });
  };

  const termItems: TermItem[] = [
    { key: 'age', label: '(필수) 만 15세 이상입니다.' },
    { key: 'service', label: '(필수) 서비스 이용약관의' },
    { key: 'personal', label: '(필수) 개인정보 수집 및 이용 동의' },
    { key: 'marketing', label: '(선택) 오늘의 일 웹/앱 서비스 이용 동의' },
    { key: 'sms', label: '(선택) 광고성 정보 이메일/SMS 수신 동의' },
    { key: 'personalMarketing', label: '(선택) 개인정보수집 및 이용 동의-광고/전송매체' },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-xl p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      <h1 className="text-2xl font-bold mb-8">개인 회원가입</h1>
      
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
                <label key={item.key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={agreeTerms[item.key]}
                    onChange={(e) => setAgreeTerms({ ...agreeTerms, [item.key]: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Other Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="font-bold flex items-center">
              휴대폰번호
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="'-' 제외하고 입력"
                className="flex-1 border rounded-lg p-2"
              />
              <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                인증번호
              </button>
            </div>
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
            </label>
            <input type="password" className="w-full border rounded-lg p-2" />
          </div>

          <div>
            <label className="font-bold flex items-center">
              비밀번호 확인
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input type="password" className="w-full border rounded-lg p-2" />
          </div>

          <div>
            <label className="font-bold flex items-center">
              이름
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input type="text" className="w-full border rounded-lg p-2" />
          </div>

          <div>
            <label className="font-bold flex items-center">
              이메일
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input type="email" className="w-full border rounded-lg p-2" />
          </div>

          {/* <div>
            <label className="font-bold">가입경로</label>
            <select className="w-full border rounded-lg p-2 bg-white">
              <option value="">주요 포털사이트 검색</option>
              <option value="sns">SNS</option>
              <option value="friend">지인 추천</option>
            </select>
          </div> */}
        </div>

        {/* Submit Button */}
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 transition-colors">
          가입하기
        </button>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <span>👍</span> 통합 ID 하나로 <span className="text-blue-500">오늘의</span>
          <span className="text-orange-500">일</span> 모든 이용 가능하세요
        </div>
      </div>
    </div>
  );
}