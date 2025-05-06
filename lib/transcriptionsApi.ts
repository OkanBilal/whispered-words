import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define types
export interface Transcription {
  id: string;
  title: string;
  user_id: string;
  content?: string;
  created_at: string;
}

export interface TranscriptionRequest {
  file: File;
  language: string;
  format: string;
  prompt?: string;
  model?: string;
}

export interface TranscriptionResponse {
  transcription: string;
  title: string;
}

// Create the API
export const transcriptionsApi = createApi({
  reducerPath: 'transcriptionsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Transcription'],
  endpoints: (builder) => ({
    // Get all transcriptions for a user
    getTranscriptions: builder.query<Transcription[], void>({
      query: () => 'transcriptions',
      providesTags: ['Transcription'],
    }),
    
    // Upload and transcribe an audio file
    uploadTranscription: builder.mutation<TranscriptionResponse, TranscriptionRequest>({
      query: (transcriptionRequest) => {
        const formData = new FormData();
        formData.append('model', transcriptionRequest.model || 'whisper-1');
        formData.append('file', transcriptionRequest.file);
        formData.append('language', transcriptionRequest.language);
        formData.append('response_format', transcriptionRequest.format);
        
        if (transcriptionRequest.prompt) {
          formData.append('prompt', transcriptionRequest.prompt);
        }
        
        return {
          url: 'upload',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Transcription'],
    }),
    
    // Save transcription to database
    saveTranscription: builder.mutation<void, { title: string; user_id: string; content?: string }>({
      query: (data) => ({
        url: 'transcriptions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Transcription'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetTranscriptionsQuery,
  useUploadTranscriptionMutation,
  useSaveTranscriptionMutation,
} = transcriptionsApi;