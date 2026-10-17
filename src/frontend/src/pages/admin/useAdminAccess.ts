import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

/**
 * Resolves whether the signed-in caller is an authorized administrator.
 * The backend remains the source of truth: this only drives the UI gate.
 */
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<boolean>({
    queryKey: ["admin", "isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
