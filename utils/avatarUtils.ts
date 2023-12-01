export const handleSetUserAvatar = (avatar: string) => {
  const apiUrl = process.env.API_URL +'/' ;

  if (!avatar) return apiUrl + 'original/profile2.png';
  return apiUrl + avatar;
};
