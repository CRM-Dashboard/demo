import { useQuery } from "@tanstack/react-query";

const useCustomQuery = (queryKey, fetchFunction, options = {}) => {
  return useQuery(queryKey, fetchFunction, {
    staleTime: 60000, // Default stale time (1 minute)
    cacheTime: 300000, // Default cache time (5 minutes)
    ...options, // Allow overriding defaults
  });
};

export default useCustomQuery;
