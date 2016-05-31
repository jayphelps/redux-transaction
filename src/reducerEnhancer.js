import { getTransactionMeta } from './utils';

const transaction = (state = {}, action) => {
  const { type } = action.meta.transaction;

  switch (type) {
    case 'BEGIN':
      return { isPending: true, error: null };

    case 'COMMIT':
      return { isPending: false, error: null };

    case 'ROLLBACK':
      return { isPending: false, error: action.payload || null };

    default:
      return state;
  }
};

const transactions = (state = {}, action) => {
  const transactionMeta = getTransactionMeta(action);
  if (transactionMeta) {
    const { type, id } = action.meta.transaction;

    switch (type) {
      case 'BEGIN':
      case 'COMMIT':
      case 'ROLLBACK':
        return {
          ...state,
          [id]: transaction(state[id], action)
        };

      default:
        return state;
    }
  }

  return state;
};

export default function reducer(rootReducer) {
  const pending = {};

  return (state = {}, action) => {
    let { transactions: transactionsState, ...innerState } = state;

    for (const key in pending) {
      if (pending.hasOwnProperty(key)) {
        pending[key].history.push(action);
      }
    }

    const transactionMeta = getTransactionMeta(action);

    if (transactionMeta) {
      const { type, id } = transactionMeta;

      switch (type) {
        case 'BEGIN':
          pending[id] = { history: [], beforeState: innerState };
          break;

        case 'COMMIT':
          if (!pending[id]) {
            throw new TypeError(`You tried to commit (aka fulfill) transaction #${id} ${action.type.replace(/_FULFILLED$/, '')}, but it wasn't pending.`);
          }

          delete pending[id];
          break;

        case 'ROLLBACK':
          if (!pending[id]) {
            throw new TypeError(`You tried to rollback (reject/cancel) transaction #${id} ${action.type.replace(/_FULFILLED$/, '')}, but it wasn't pending.`);
          }

          const { history, beforeState } = pending[id];
          innerState = beforeState;

          for (let i = 0, l = history.length; i < l; i++) {
            innerState = rootReducer(innerState, history[i]);
          }

          delete pending[id];
          break;

        default:
          throw new TypeError(`Unexpected transaction type: ${type} for #${id}`);
      }
    }

    return {
      ...rootReducer(innerState, action),
      transactions: transactions(transactionsState, action)
    };
  };
}
