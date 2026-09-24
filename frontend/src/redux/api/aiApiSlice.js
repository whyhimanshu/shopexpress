import { apiSlice } from "./apiSlice";

export const aiApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    trackAiEvent: builder.mutation({
      query: (body) => ({
        url: "/api/ai/events",
        method: "POST",
        body,
      }),
    }),
    getRecommendations: builder.query({
      query: (sessionId) => ({
        url: "/api/ai/recommendations",
        params: { sessionId },
      }),
      keepUnusedDataFor: 60,
    }),
    askShopAssistant: builder.mutation({
      query: (body) => ({
        url: "/api/ai/chat",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useTrackAiEventMutation,
  useGetRecommendationsQuery,
  useAskShopAssistantMutation,
} = aiApiSlice;
