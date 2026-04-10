import apiClient from './axios'

export const getChallengeHistory = async (userId) => {
  const { data } = await apiClient.get('/challengeHistory')
  if (!Array.isArray(data)) return []
  // json-server v1이 쿼리 파라미터의 숫자 문자열을 number로 변환해
  // 타입 불일치가 발생하므로 클라이언트에서 직접 필터링
  return data.filter((item) => String(item.userId) === String(userId))
}
