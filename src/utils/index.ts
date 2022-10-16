import path from 'path';
import fs from 'fs';

//GENERATE OTP
const generateCode = (len: number): string => {
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < len; i++) {
    code += digits[Math.floor(Math.random() * 10)];
  }
  return code;
};

//Delete file in public/uploads
const deleteFile = (pathFile: string) => {
  pathFile = pathFile.replace('//', '/');
  if (
    fs.existsSync(path.join(path.dirname(path.dirname(__dirname)), pathFile))
  ) {
    fs.unlinkSync(path.join(path.dirname(path.dirname(__dirname)), pathFile));
  }
};

const isValidDate = (dateStr: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if (dateStr.match(regex) === null) {
    return false;
  }

  const date = new Date(dateStr);

  const timestamp = date.getTime();

  if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
    return false;
  }

  return date.toISOString().startsWith(dateStr);
}

export { generateCode, deleteFile, isValidDate };
export default class UserSocket {
  userId: number;
  socketId: string;
}