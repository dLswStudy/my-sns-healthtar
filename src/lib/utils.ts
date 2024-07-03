import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  actionCodeSettings,
  auth,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword} from "@/firebase/firebase.config";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const applyPrefix = (prefix, classes) => {
  classes = classes.split(' ')
  return classes.map(cls => `${prefix}:${cls}`).join(' ');
};

/* 영어 대문자, 소문자, 숫자, 특수문자 중
2종류 문자 조합으로 최소 10자리 이상 또는
3종류 문자 조합으로 최소 8자리 이상 */
export function validatePassword(testString) {
  let kindCnt = 0;

  // 정규 표현식을 사용하여 각 종류의 문자가 포함되었는지 확인
  if (/[A-Z]/.test(testString)) kindCnt += 1;
  if (/[a-z]/.test(testString)) kindCnt += 1;
  if (/\d/.test(testString)) kindCnt += 1;
  if (/[\W_]/.test(testString)) kindCnt += 1;

  // 조건에 따라 true 또는 false 반환
  if (kindCnt >= 3 && testString.length >= 8) {
    return true;
  }
  if (kindCnt >= 2 && testString.length >= 10) {
    return true;
  }
  return false;
}

