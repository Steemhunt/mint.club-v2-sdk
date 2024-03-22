export function truncateString(str: string, length = 100) {
  if (str.length > length) {
    return str.slice(0, length - 3) + '...';
  }

  return str;
}

export function getSubscriptCharacter(number: number) {
  let str = number.toString();
  let newStr = '';
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    if (code >= 48 && code <= 57) {
      // If it's between "0" and "9", offset the code to subscript
      newStr += String.fromCharCode(code + 8272);
    } else {
      // If it's not a digit, keep the original character
      newStr += str[i];
    }
  }

  return newStr;
}
