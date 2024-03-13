import { apiSlice } from "./apiSlice";

export const transcriptionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTranscriptions: builder.query<boolean, string>({
      query: () => "transcriptions",
      providesTags: ["Transcriptions"],
    }),
    addTranscription: builder.mutation({
      query: ({ url, body }) => ({
        url: `${url}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Transcriptions"],
    }),
    deleteTranscription: builder.mutation({
      query: ({ url, id }) => ({
        url: `${url}/${id}`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["Transcriptions"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTranscriptionsQuery,
  useAddTranscriptionMutation,
  useDeleteTranscriptionMutation,
} = transcriptionApi;
