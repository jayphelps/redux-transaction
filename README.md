# redux-transaction (alpha)

As of now, this is just an experiment.

##### rootReducer.js

```js
const post = (state = { id: null, title: null }, action) => {
  switch (action.type) {
    case 'FETCH_POST':
    case 'FETCH_POST_FULFILLED':
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
};

const postsById = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_POST':
    case 'FETCH_POST_FULFILLED':
      const { id } = action.payload;

      return {
        ...state,
        [id]: post(state[id], action)
      };

    default:
      return state;
  }
};

export default combineReducers({
  postsById
});

```

##### index.js

```js
import transaction, { pend, fulfill, reject, cancel } from 'redux-transaction';

const store = createStore(transaction(rootReducer));

const fetchPost = id => pend({ type: 'FETCH_POST', payload: { id } });

const action = store.dispatch(fetchPost());

store.getState();
/*
{
  transactions: {
    '1': {
      isPending: true,
      error: null
    }
  }
}
*/
setTimeout(() => {
  store.dispatch(reject(action, { message: 'SERVER DOES NOT LIKE YOU' }));

  const state = store.getState();
  /*
  {
    transactions: {
      '1': {
        isPending: false,
        error: { message: 'SERVER DOES NOT LIKE YOU' }
      }
    }
  }
  */

  selectTransaction(state, action);
  /*
  {
    isPending: false,
    error: { message: 'SERVER DOES NOT LIKE YOU' }
  }
  */
  }, 1000);
```