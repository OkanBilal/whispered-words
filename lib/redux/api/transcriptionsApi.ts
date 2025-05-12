import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Transcription {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  content?: string;            
  source_language?: string;    
  duration?: number;           
  format?: string;
  model?: string;
  file_name?: string;
  file_size?: number;
  audio_file_path?: string;
  transcript_file_path?: string;
  download_url?: string;
}

export interface TranscriptionRequest {
  file: File;
  language: string;
  format: string;
  prompt?: string;
  model?: string;
}

export interface TranscriptionResponse {
  text?: string;
  transcription?: string;
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

export const transcriptionsApi = createApi({
  reducerPath: 'transcriptionsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/',
    credentials: 'include', 
  }),
  tagTypes: ['Transcription'],
  endpoints: (builder) => ({
    getTranscriptions: builder.query<Transcription[], void>({
      query: () => 'transcriptions',
      providesTags: (result = []) => [
        'Transcription',
        ...result.map(({ id }) => ({ type: 'Transcription' as const, id })),
      ],
    }),
    
    getTranscriptionById: builder.query<Transcription, string>({
      query: (id) => `transcriptions/${id}`,
      providesTags: (_, __, id) => [{ type: 'Transcription', id }],
    }),
    
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
      transformErrorResponse: (response) => {
        console.error('Upload transcription error:', response);
        return response;
      },
    }),
    
    saveTranscription: builder.mutation<void, Partial<Transcription>>({
      query: (data) => ({
        url: 'transcriptions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Transcription'],
      transformErrorResponse: (response) => {
        console.error('Save transcription error:', response);
        return response;
      },
    }),
    
    deleteTranscription: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `transcriptions/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: (_, __, id) => [{ type: 'Transcription', id }, 'Transcription'],
      transformResponse: (response: { success: boolean } | undefined) => {
        return response || { success: false };
      },
      transformErrorResponse: (response) => {
        console.error('Delete transcription error:', response);
        return { status: response.status, data: response.data };
      },
    }),

  }),
});

export const {
  useGetTranscriptionsQuery,
  useGetTranscriptionByIdQuery,
  useUploadTranscriptionMutation,
  useSaveTranscriptionMutation,
  useDeleteTranscriptionMutation,
} = transcriptionsApi;
