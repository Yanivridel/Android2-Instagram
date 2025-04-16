export default function passwordConvertor(password: string) {
  return password.replace(/./g, '*');
}
