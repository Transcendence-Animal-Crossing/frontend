export const handleSetUserAvatar = (avatar: string) => {
  // const apiUrl = process.env.API_URL +'/' ;
  const apiUrl = 'http://10.13.4.2:8080/'

  if (!avatar) return apiUrl + 'original/profile2.png';
  return apiUrl + avatar;
};
