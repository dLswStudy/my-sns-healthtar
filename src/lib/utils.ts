import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import exp from "node:constants";
import {getDownloadURL, ref, uploadBytes} from "@firebase/storage";
import {storage} from "@/firebase/firebase.client.config";
import {bucketName} from "@/stores/store.config";
import {ChangeEvent} from "react";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const applyPrefix = (prefix, classes) => {
  classes = classes.split(' ')
  return classes.map(cls => `${prefix}:${cls}`).join(' ');
};

/* 영어 대문자, 소문자, 숫자, 특수문자 중
2종류 문자 조합으로 최소 10자리 이상 또는
3종류 문자 조합으로 최소 8자리 이상
연속된 숫자나 연속적으로 배치된 키보드 문자가 3개 이상 포함 불가.
*/
export function validatePassword(testString) {
  const nick = localStorage.getItem('hst-nickname');
  const sequences = [nick, '`1234567890-=','=-0987654321`','~!@#$%^&*()_+','+_)(*&^%$#@!~','qwertyuiop[]','][poiuytrewq','asdfghjkl;',';lkjhgfdsa','zxcvbnm,./','/.,mnbvcxz']

  // 연속된 숫자나 연속적으로 배치된 키보드 문자가 3개 이상 포함될 경우
  for (let seq of sequences) {
    if (containsNLengthSubstring(seq, testString, 3)) {
      return false;
    }
  }

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

export function exportNickname(nickname) {
  localStorage.setItem('hst-nickname', nickname);
  return true;
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

function containsNLengthSubstring(A, B, n) {
  if (n < 2) return false; // n은 최소 2 이상이어야 합니다.

  // A 문자열에서 가능한 모든 연속된 n 글자 조합을 확인
  for (let i = 0; i <= A.length - n; i++) {
    const substring = A.slice(i, i + n);
    if (B.includes(substring)) {
      return true;  // B에서 해당 부분 문자열을 찾으면 true 반환
    }
  }
  return false;  // 모든 검사 후 찾지 못했으면 false 반환
}

export const updateAwithB = (objA, objB) => {
  const updatedA = { ...objA };

  for (const key in objA) {
    if (objB.hasOwnProperty(key)) {
      updatedA[key] = objB[key];
    }
  }
  return updatedA;
};

export const asyncSet = (store: any, field: string, newValue: any): Promise<void> => {
  const {setField} = store()
  return new Promise((resolve) => {
    const unsubscribe = store.subscribe((state) => {
      if (state[field] === newValue) {
        unsubscribe();
        resolve();
      }
    });
    setField(field, newValue);
  });
}

export const asyncWait = (store, field) => {
  console.log('asyncSet')
  return new Promise<void>((resolve) => {
    const unsubscribe = store.subscribe((state) => {
      if (state[field] !== null) {
        console.log('asyncSet state[field] !== null')
        unsubscribe();
        resolve();
      }
    });
  });
};

export const uploadImage = async (file: File, middle_path:string, id: string): Promise<string> => {
  const storageRef = ref(storage, `${bucketName}/${middle_path}/${id}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

//부모 요소의 폭에 맞춰 이미지 조정
export const handleImagePreview = (e: ChangeEvent<HTMLInputElement>, canvasRef, setImgFileFunc, setImgUrlFunc) => {
  if (e.target.files?.[0]) {
    const file = e.target.files[0];
    console.log("original File: ", file);
    const previewUrl = URL.createObjectURL(file);

    // 이미지의 원본 크기를 읽어와서 캔버스에 그리기
    const img = new window.Image();
    img.src = previewUrl;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // 설정하려는 부모 요소의 크기
          const maxWidth = 250;
          const aspectRatio = img.width / img.height;
          const width = maxWidth;
          const height = maxWidth / aspectRatio;

          // 캔버스 크기 설정
          canvas.width = width;
          canvas.height = height;

          // 이미지 캔버스에 그리기
          ctx.drawImage(img, 0, 0, width, height);

          // 캔버스에서 Blob 객체로 변환
          canvas.toBlob((blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
              });
              const resizedUrl = URL.createObjectURL(resizedFile);
              setImgUrlFunc(resizedUrl)
              setImgFileFunc(resizedFile)
              console.log("Resized File: ", resizedFile);
            }
          }, file.type);
        }
      }
    };
  }
};

// 정사각형 안에 사진이 모두 포함되게 조정
export const handleAddPostPreview = (e: ChangeEvent<HTMLInputElement>, canvasRef, setImgFileFunc, setImgUrlFunc, maxWidth) => {
  if (e.target.files?.[0]) {
    const file = e.target.files[0];
    console.log("original File: ", file);
    const previewUrl = URL.createObjectURL(file);

    // 이미지의 원본 크기를 읽어와서 캔버스에 그리기
    const img = new window.Image();
    img.src = previewUrl;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // 설정하려는 부모 요소의 크기
          let width, height;
          const aspectRatio = img.width / img.height;
          if (img.width > img.height) {
            width = maxWidth;
            height = maxWidth / aspectRatio;
          } else {
            height = maxWidth;
            width = maxWidth * aspectRatio;
          }

          // 캔버스 크기 설정
          canvas.width = width;
          canvas.height = height;

          // 이미지 캔버스에 그리기
          ctx.drawImage(img, 0, 0, width, height);

          // 캔버스에서 Blob 객체로 변환
          canvas.toBlob((blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
              });
              const resizedUrl = URL.createObjectURL(resizedFile);
              setImgUrlFunc(resizedUrl)
              setImgFileFunc(resizedFile)
              console.log("Resized File: ", resizedFile);
            }
          }, file.type);
        }
      }
    };
  }
};


export async function hasCamera() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    return videoDevices.length > 0;
  } catch (error) {
    console.error("Error checking for cameras:", error);
    return false;
  }
}