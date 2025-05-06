import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define types
export interface Transcription {
  id: string;
  title: string;
  user_id: string;
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
  text?: string;          // For text format
  transcription?: string; // For backward compatibility
  // For JSON format
  task?: string;
  language?: string;
  duration?: number;
  segments?: Array<{
    id: number;
    seek: number;
    start: number;
    end: number;
    text: string;
    tokens: number[];
    temperature: number;
    avg_logprob: number;
    compression_ratio: number;
    no_speech_prob: number;
  }>;
}

// Create the API
export const transcriptionsApi = createApi({
  reducerPath: 'transcriptionsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/',
    credentials: 'include', // Include credentials for authenticated requests
  }),
  tagTypes: ['Transcription'],
  endpoints: (builder) => ({
    // Get all transcriptions for a user
    getTranscriptions: builder.query<Transcription[], void>({
      query: () => 'transcriptions',
      providesTags: (result = []) => [
        'Transcription',
        ...result.map(({ id }) => ({ type: 'Transcription' as const, id })),
      ],
    }),
    
    // Get a single transcription by ID
    getTranscriptionById: builder.query<Transcription, string>({
      query: (id) => `transcriptions/${id}`,
      providesTags: (_, __, id) => [{ type: 'Transcription', id }],
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
    saveTranscription: builder.mutation<void, { title: string; user_id: string; }>({
      query: (data) => ({
        url: 'transcriptions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Transcription'],
    }),
    
    // Delete a transcription
    deleteTranscription: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `transcriptions/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: (_, __, id) => [{ type: 'Transcription', id }, 'Transcription'],
      // Add transformResponse to normalize the API response
      transformResponse: (response: { success: boolean } | undefined) => {
        return response || { success: false };
      },
      // Add the transformErrorResponse to normalize API errors
      transformErrorResponse: (response) => {
        console.error('Delete transcription error:', response);
        return { status: response.status, data: response.data };
      },
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetTranscriptionsQuery,
  useGetTranscriptionByIdQuery,
  useUploadTranscriptionMutation,
  useSaveTranscriptionMutation,
  useDeleteTranscriptionMutation,
} = transcriptionsApi;