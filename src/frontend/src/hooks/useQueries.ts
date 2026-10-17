import { createActor } from "@/backend";
import type {
  Article,
  Campaign,
  ContactMessage,
  Currency,
  Donation,
  DonationStatus,
  DonorInfo,
  Frequency,
  Id,
  PaymentMethod,
  PaymentSettings,
  Photo,
  Programme,
  Testimony,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*  Public reads                                                              */
/* -------------------------------------------------------------------------- */

export function usePublishedArticles() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Article[]>({
    queryKey: ["articles", "published"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPublishedArticles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useArticle(id: Id | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Article | null>({
    queryKey: ["article", id?.toString()],
    queryFn: async () => {
      if (!actor || id === undefined) return null;
      return actor.getArticle(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

export function useProgrammes() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Programme[]>({
    queryKey: ["programmes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProgrammes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProgramme(id: Id | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Programme | null>({
    queryKey: ["programme", id?.toString()],
    queryFn: async () => {
      if (!actor || id === undefined) return null;
      return actor.getProgramme(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

export function useTestimonies() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Testimony[]>({
    queryKey: ["testimonies"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTestimonies();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePhotos() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Photo[]>({
    queryKey: ["photos"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPhotos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useActiveCampaigns() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Campaign[]>({
    queryKey: ["campaigns", "active"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listActiveCampaigns();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCampaign(id: Id | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Campaign | null>({
    queryKey: ["campaign", id?.toString()],
    queryFn: async () => {
      if (!actor || id === undefined) return null;
      return actor.getCampaign(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

export function usePaymentSettings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PaymentSettings | null>({
    queryKey: ["paymentSettings"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPaymentSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDonation(id: Id | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Donation | null>({
    queryKey: ["donation", id?.toString()],
    queryFn: async () => {
      if (!actor || id === undefined) return null;
      return actor.getDonation(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

/* -------------------------------------------------------------------------- */
/*  Public writes                                                             */
/* -------------------------------------------------------------------------- */

export function useSubmitContactMessage() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (input: {
      name: string;
      email: string;
      subject: string;
      message: string;
    }): Promise<ContactMessage> => {
      if (!actor) throw new Error("Le service est indisponible.");
      return actor.submitContactMessage(
        input.name,
        input.email,
        input.subject,
        input.message,
      );
    },
  });
}

export function useCreateDonation() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      amount: bigint;
      currency: Currency;
      frequency: Frequency;
      programmeId: Id | null;
      method: PaymentMethod;
      donor: DonorInfo;
    }): Promise<Donation> => {
      if (!actor) throw new Error("Le service est indisponible.");
      return actor.createDonation(
        input.amount,
        input.currency,
        input.frequency,
        input.programmeId,
        input.method,
        input.donor,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["campaigns", "active"] });
    },
  });
}

/* -------------------------------------------------------------------------- */
/*  Admin reads                                                               */
/* -------------------------------------------------------------------------- */

export function useAllArticles() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Article[]>({
    queryKey: ["articles", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllArticles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllCampaigns() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Campaign[]>({
    queryKey: ["campaigns", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllCampaigns();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useContactMessages() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ContactMessage[]>({
    queryKey: ["contactMessages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listContactMessages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDonations() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Donation[]>({
    queryKey: ["donations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listDonations();
    },
    enabled: !!actor && !isFetching,
  });
}

/* -------------------------------------------------------------------------- */
/*  Admin writes                                                              */
/* -------------------------------------------------------------------------- */

export function useCreateArticle() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      title: string;
      category: string;
      author: string;
      imageUrl: string;
      content: string;
      published: boolean;
    }): Promise<Article> => {
      if (!actor) throw new Error("Le service est indisponible.");
      return actor.createArticle(
        input.title,
        input.category,
        input.author,
        input.imageUrl,
        input.content,
        input.published,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useUpdateArticle() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      id: Id;
      title: string;
      category: string;
      author: string;
      imageUrl: string;
      content: string;
      published: boolean;
    }): Promise<Article | null> => {
      if (!actor) throw new Error("Le service est indisponible.");
      return actor.updateArticle(
        input.id,
        input.title,
        input.category,
        input.author,
        input.imageUrl,
        input.content,
        input.published,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useDeleteArticle() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: Id): Promise<boolean> => {
      if (!actor) throw new Error("Le service est indisponible.");
      return actor.deleteArticle(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useCreateProgramme() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      title: string;
      description: string;
      objectives: string[];
      actions: string[];
      imageUrl: string;
      displayOrder: bigint;
    }): Promise<Programme> => {
      if (!actor) throw new Error("Le service est indisponible.");
      return actor.createProgramme(
        input.title,
        input.description,
        input.objectives,
        input.actions,
        input.imageUrl,
        input.displayOrder,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["programmes"] });
    },
  });
}

export function useUpdateProgramme() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      id: Id;
      title: string;
      description: string;
      objectives: string[];
      actions: string[];
      imageUrl: string;
      displayOrder: bigint;
    }): Promise<Programme | null> => {
      if (!actor) throw new Error("Le service est indisponible.");
      return actor.updateProgramme(
        input.id,
        input.title,
        input.description,
        input.objectives,
        input.actions,
        input.imageUrl,
        input.displayOrder,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["programmes"] });
    },
  });
}

export function useDeleteProgramme() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: Id): Promise<boolean> => {
      if (!actor) throw new Error("Le service est indisponible.");
      return actor.deleteProgramme(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["programmes"] });
    },
  });
}

export function useCreateTestimony() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      name: string;
      origin: string;
      story: string;
      imageUrl: string | null;
    }): Promise<Testimony> => {
      if (!actor) throw new Error("Le service est indisponible.");
      return actor.createTestimony(
        input.name,
        input.origin,
        input.story,
        input.imageUrl,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["testimonies"] });
    },
  });
}

export function useUpdateTestimony() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      id: Id;
      name: string;
      origin: string;
      story: string;
      imageUrl: string | null;
    }): Promise<Testimony | null> => {
      if (!actor) throw new Error("Le service est indisponible.");
      return actor.updateTestimony(
        input.id,
        input.name,
        input.origin,
        input.story,
        input.imageUrl,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["testimonies"] });
    },
  });
}

export function useDeleteTestimony() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: Id): Promise<boolean> => {
      if (!actor) throw new Error("Le service est indisponible.");
      return actor.deleteTestimony(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["testimonies"] });
    },
  });
}

export function useCreatePhoto() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      imageUrl: string;
      caption: string;
      displayOrder: bigint;
    }): Promise<Photo> => {
      if (!actor) throw new Error("Le service est indisponible.");
      return actor.createPhoto(
        input.imageUrl,
        input.caption,
        input.displayOrder,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
  });
}

export function useUpdatePhoto() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      id: Id;
      imageUrl: string;
      caption: string;
      displayOrder: bigint;
    }): Promise<Photo | null> => {
      if (!actor) throw new Error("Le service est indisponible.");
      return actor.updatePhoto(
        input.id,
        input.imageUrl,
        input.caption,
        input.displayOrder,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
  });
}

export function useDeletePhoto() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: Id): Promise<boolean> => {
      if (!actor) throw new Error("Le service est indisponible.");
      return actor.deletePhoto(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
  });
}

export function useCreateCampaign() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      title: string;
      description: string;
      goalAmount: bigint;
      currency: Currency;
      active: boolean;
    }): Promise<Campaign> => {
      if (!actor) throw new Error("Le service est indisponible.");
      return actor.createCampaign(
        input.title,
        input.description,
        input.goalAmount,
        input.currency,
        input.active,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useUpdateCampaign() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      id: Id;
      title: string;
      description: string;
      goalAmount: bigint;
      currency: Currency;
      active: boolean;
    }): Promise<Campaign | null> => {
      if (!actor) throw new Error("Le service est indisponible.");
      return actor.updateCampaign(
        input.id,
        input.title,
        input.description,
        input.goalAmount,
        input.currency,
        input.active,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useDeleteCampaign() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: Id): Promise<boolean> => {
      if (!actor) throw new Error("Le service est indisponible.");
      return actor.deleteCampaign(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useDeleteContactMessage() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: Id): Promise<boolean> => {
      if (!actor) throw new Error("Le service est indisponible.");
      return actor.deleteContactMessage(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["contactMessages"] });
    },
  });
}

export function useUpdateDonationStatus() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      id: Id;
      status: DonationStatus;
    }): Promise<Donation | null> => {
      if (!actor) throw new Error("Le service est indisponible.");
      return actor.updateDonationStatus(input.id, input.status);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["donations"] });
    },
  });
}

export function useUpdatePaymentSettings() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (next: PaymentSettings): Promise<PaymentSettings> => {
      if (!actor) throw new Error("Le service est indisponible.");
      return actor.updatePaymentSettings(next);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["paymentSettings"] });
    },
  });
}
