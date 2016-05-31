export const BEGIN = 'BEGIN';
export const COMMIT = 'COMMIT';
export const ROLLBACK = 'ROLLBACK';

let transactionID = 0;

export const pend = action => ({
  ...action,
  meta: {
    transaction: {
      type: BEGIN,
      id: `${++transactionID}`
    }
  }
});

export const fulfill = (action, payload) => ({
  type: action.type + '_FULFILLED',
  payload,
  meta: {
    transaction: {
      type: COMMIT,
      id: action.meta.transaction.id
    }
  }
});

export const reject = (action, payload) => ({
  type: action.type + '_REJECTED',
  payload,
  error: true,
  meta: {
    transaction: {
      type: ROLLBACK,
      id: action.meta.transaction.id
    }
  }
});

export const cancel = action => ({
  type: action.type + '_CANCELLED',
  meta: {
    transaction: {
      type: ROLLBACK,
      id: action.meta.transaction.id
    }
  }
});
