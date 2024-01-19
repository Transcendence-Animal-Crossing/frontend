export const handleSetUserAvatar = (avatar: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!avatar) return apiUrl + '/original/profile2.png';
  return apiUrl + '/' + avatar;
};
