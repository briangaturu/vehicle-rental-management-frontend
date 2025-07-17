import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import authReducer from "../features/auth/authSlice"
import { userApi } from '../features/api/userApi';
import vehicleApi from '../features/api/vehiclesApi';
import ticketsApi from '../features/api/supportTicketsApi';
import bookingsApi from '../features/api/bookingsApi';
import { paymentsApi } from '../features/api/PaymentsApi';



// Create a persist config for the auth slice
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated','role'], // Specify which parts of the state to persist
};

// Create a persisted reducer for the auth slice
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);


export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [vehicleApi.reducerPath]: vehicleApi.reducer, 
    [ticketsApi.reducerPath]: ticketsApi.reducer,
    [bookingsApi.reducerPath]: bookingsApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }).concat(userApi.middleware,vehicleApi.middleware,ticketsApi.middleware,bookingsApi.middleware,paymentsApi.middleware), 
});

// Export the persisted store
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;