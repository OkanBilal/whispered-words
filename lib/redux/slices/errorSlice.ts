import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { transcriptionsApi } from '../api/transcriptionsApi';

// Define the state interface
interface ErrorState {
  message: string | null;
  status: number | null;
  type: 'info' | 'warning' | 'error' | 'success' | null;
}

// Define the initial state
const initialState: ErrorState = {
  message: null,
  status: null,
  type: null,
};

// Create the slice
const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<{ message: string; status?: number; type?: 'warning' | 'error' }>) => {
      state.message = action.payload.message;
      state.status = action.payload.status || null;
      state.type = action.payload.type || 'error';
    },
    setSuccess: (state, action: PayloadAction<{ message: string }>) => {
      state.message = action.payload.message;
      state.status = 200;
      state.type = 'success';
    },
    clearError: (state) => {
      state.message = null;
      state.status = null;
      state.type = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add error handling for all RTK Query API error cases
      .addMatcher(
        transcriptionsApi.endpoints.getTranscriptions.matchRejected,
        (state, { payload }: { payload: any }) => {
          state.message = payload?.data?.error || payload?.error?.message || 'Failed to fetch transcriptions';
          state.status = typeof payload?.status === 'number' ? payload.status : 500;
          state.type = 'error';
        }
      )
      .addMatcher(
        transcriptionsApi.endpoints.getTranscriptionById.matchRejected,
        (state, { payload }) => {
          state.message = payload?.data?.error || payload?.error?.message || 'Failed to fetch transcription';
          state.status = typeof payload?.status === 'number' ? payload.status : 500;
          state.type = 'error';
        }
      )
      .addMatcher(
        transcriptionsApi.endpoints.deleteTranscription.matchRejected,
        (state, { payload }) => {
          state.message = payload?.data?.error || payload?.error?.message || 'Failed to delete transcription';
          state.status = typeof payload?.status === 'number' ? payload.status : 500;
          state.type = 'error';
        }
      )
      .addMatcher(
        transcriptionsApi.endpoints.uploadTranscription.matchRejected,
        (state, { payload }) => {
          state.message = payload?.data?.error || payload?.error?.message || 'Failed to upload transcription';
          state.status = typeof payload?.status === 'number' ? payload.status : 500;
          state.type = 'error';
        }
      )
      .addMatcher(
        transcriptionsApi.endpoints.saveTranscription.matchRejected,
        (state, { payload }) => {
          state.message = payload?.data?.error || payload?.error?.message || 'Failed to save transcription';
          state.status = typeof payload?.status === 'number' ? payload.status : 500;
          state.type = 'error';
        }
      )
      // Add success handlers
      .addMatcher(
        transcriptionsApi.endpoints.deleteTranscription.matchFulfilled,
        (state) => {
          state.message = 'Transcription deleted successfully';
          state.status = 200;
          state.type = 'success';
        }
      )
      .addMatcher(
        transcriptionsApi.endpoints.saveTranscription.matchFulfilled,
        (state) => {
          state.message = 'Transcription saved successfully';
          state.status = 200;
          state.type = 'success';
        }
      );
  },
});

// Export actions and reducer
export const { setError, setSuccess, clearError } = errorSlice.actions;
export const errorReducer = errorSlice.reducer;
