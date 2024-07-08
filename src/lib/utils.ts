import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
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

export function generateTemporaryPassword(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

export async function errorHandle(res){
  const error = {isError: false, code:500,message:''}
  if (!res.ok) {
    error.isError = true
    const errorJson = await res.json();
    switch (res.status) {
      case 404:
        error.code = res.status
        error.message = 'Resource not found'
        break;
      case 500:
        error.code = errorJson?.code
        switch (errorJson?.code) {
          case 'auth/invalid-credential':
            error.message = '이메일 주소와 비밀번호를 다시 확인해주세요.';
            break;
          case 'auth/email-already-in-use':
            error.message = '이미 존재하는 이메일입니다.';
            break;
          default:
            error.message = '서버에서 에러가 발생하였습니다. 잠시 후 다시 시도해주세요.';
        }
        break;
      default:
        error.code = res.status
        error.message = errorJson?.message || '에러가 발생하였습니다. 잠시 후 다시 시도해주세요.'
    }
  }

  return error
}

