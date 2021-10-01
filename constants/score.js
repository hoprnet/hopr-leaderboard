export const DEDUCTABLE_SCORE_MAP = {
}


export const getImportanceScore = (account) => {
    const stake = account.balance
    if (account.fromChannels.length === 0 || stake === 0) {
        return 0;
    }
    return account.fromChannels.reduce((acc, cur) => {
        return acc + cur.destination.balance * Math.sqrt(cur.balance * stake)
    }, 0)
}