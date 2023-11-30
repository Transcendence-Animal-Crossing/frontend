export const handleSetUserAvatar = (avatar: string) => {
  const apiUrl = 'http://ec2-43-201-205-34.ap-northeast-2.compute.amazonaws.com:8080/';
  // const apiUrl = 'http://backend:8080/';
  if (!avatar) return apiUrl + 'original/profile2.png';
  return apiUrl + avatar;
};
