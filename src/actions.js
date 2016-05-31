export const BEGIN = 'BEGIN';
export const COMMIT = 'COMMIT';
export const ROLLBACK = 'ROLLBACK';

let transactionID = 0;

export const pend = action => ({
  ...action,
  meta: {
    optimism: {
      type: BEGIN,
      id: `${++transactionID}`
    }
  }
});

export const fulfill = (action, payload) => ({
  type: action.type + '_FULFILLED',
  payload,
  meta: {
    optimism: {
      type: COMMIT,
      id: action.meta.optimism.id
    }
  }
});

export const reject = (action, payload) => ({
  type: action.type + '_REJECTED',
  payload,
  error: true,
  meta: {
    optimism: {
      type: ROLLBACK,
      id: action.meta.optimism.id
    }
  }
});

export const cancel = action => ({
  type: action.type + '_CANCELLED',
  meta: {
    optimism: {
      type: ROLLBACK,
      id: action.meta.optimism.id
    }
  }
});
