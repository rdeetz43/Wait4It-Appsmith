export default {
  getBetOptionsRecordCount() {
    return qGetBetOptionsRecordCount.data && qGetBetOptionsRecordCount.data[0].count;
  },

	getChallengeRecordCount() {
    return qGetChallengeRecordCount.data && qGetChallengeRecordCount.data[0].count;
  }
}
