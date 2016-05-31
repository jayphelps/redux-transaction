export const getTransactionMeta = action => action && action.meta && action.meta.transaction;
export const getTransactionId = action => action.meta.transaction.id;
export const selectTransaction = (state, action) => state.transactions[getTransactionId(action)];
