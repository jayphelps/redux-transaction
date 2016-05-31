export const getTransactionMeta = action => action && action.meta && action.meta.transaction;
export const getTransactionId = action => action.meta.optimism.id;
export const selectTransaction = (state, action) => state.transactions[getTransactionId(action)];
