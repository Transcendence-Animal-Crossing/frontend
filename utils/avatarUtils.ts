export const handleSetUserAvatar = (avatar: string) => {
  const apiUrl = 'http://localhost:8080/';
  // const apiUrl = 'http://backend:8080/';
  return apiUrl + avatar;
};