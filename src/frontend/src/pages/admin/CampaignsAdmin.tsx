import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useAllCampaigns,
  useCreateCampaign,
  useDeleteCampaign,
  useUpdateCampaign,
} from "@/hooks/useQueries";
import { formatAmount, progressPercent } from "@/lib/format";
import { CURRENCY_LABELS, type Campaign, Currency, type Id } from "@/types";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AdminSectionHeader,
  ConfirmDeleteDialog,
  Field,
  MutationError,
} from "./AdminUI";

interface CampaignDraft {
  title: string;
  description: string;
  goalAmount: string;
  currency: Currency;
  active: boolean;
}

const EMPTY_DRAFT: CampaignDraft = {
  title: "",
  description: "",
  goalAmount: "",
  currency: Currency.usd,
  active: true,
};

export function CampaignsAdmin() {
  const { data: campaigns, isLoading, isError, refetch } = useAllCampaigns();
  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const deleteCampaign = useDeleteCampaign();

  const [editingId, setEditingId] = useState<Id | null>(null);
  const [draft, setDraft] = useState<CampaignDraft>(EMPTY_DRAFT);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Campaign | null>(null);

  const saving = createCampaign.isPending || updateCampaign.isPending;
  const mutationError =
    createCampaign.error?.message ?? updateCampaign.error?.message;

  function openCreate() {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setFormOpen(true);
  }

  function openEdit(campaign: Campaign) {
    setEditingId(campaign.id);
    setDraft({
      title: campaign.title,
      description: campaign.description,
      goalAmount: campaign.goalAmount.toString(),
      currency: campaign.currency,
      active: campaign.active,
    });
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
  }

  function submit() {
    const payload = {
      title: draft.title,
      description: draft.description,
      goalAmount: BigInt(Number.parseInt(draft.goalAmount, 10) || 0),
      currency: draft.currency,
      active: draft.active,
    };
    if (editingId === null) {
      createCampaign.mutate(payload, { onSuccess: closeForm });
    } else {
      updateCampaign.mutate(
        { id: editingId, ...payload },
        { onSuccess: closeForm },
      );
    }
  }

  function toggleActive(campaign: Campaign) {
    updateCampaign.mutate({
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      goalAmount: campaign.goalAmount,
      currency: campaign.currency,
      active: !campaign.active,
    });
  }

  const canSubmit =
    draft.title.trim() !== "" &&
    draft.description.trim() !== "" &&
    draft.goalAmount.trim() !== "";

  return (
    <div className="space-y-6" data-ocid="admin.campaigns.panel">
      <AdminSectionHeader
        title="Campagnes de don"
        description="Définissez un objectif de collecte, suivez le montant réuni et activez ou désactivez chaque campagne."
        action={
          <Button
            type="button"
            className="rounded-full"
            data-ocid="admin.campaigns.add_button"
            onClick={openCreate}
          >
            <Plus className="size-4" aria-hidden="true" />
            Nouvelle campagne
          </Button>
        }
      />

      {formOpen && (
        <Card className="rounded-2xl border-border shadow-subtle">
          <CardContent className="space-y-4 pt-6">
            <h3 className="font-display text-lg font-semibold">
              {editingId === null
                ? "Nouvelle campagne"
                : "Modifier la campagne"}
            </h3>
            <Field label="Titre" htmlFor="campaign-title">
              <Input
                id="campaign-title"
                data-ocid="admin.campaigns.title_input"
                value={draft.title}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, title: e.target.value }))
                }
              />
            </Field>
            <Field label="Description" htmlFor="campaign-description">
              <Textarea
                id="campaign-description"
                data-ocid="admin.campaigns.description_textarea"
                rows={3}
                value={draft.description}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, description: e.target.value }))
                }
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Objectif (montant)"
                htmlFor="campaign-goal"
                hint="Montant entier, sans séparateur."
              >
                <Input
                  id="campaign-goal"
                  type="number"
                  min={0}
                  data-ocid="admin.campaigns.goal_input"
                  value={draft.goalAmount}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, goalAmount: e.target.value }))
                  }
                />
              </Field>
              <Field label="Devise" htmlFor="campaign-currency">
                <Select
                  value={draft.currency}
                  onValueChange={(value) =>
                    setDraft((d) => ({ ...d, currency: value as Currency }))
                  }
                >
                  <SelectTrigger
                    id="campaign-currency"
                    data-ocid="admin.campaigns.currency_select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Currency).map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {CURRENCY_LABELS[currency]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="campaign-active"
                data-ocid="admin.campaigns.active_switch"
                checked={draft.active}
                onCheckedChange={(checked) =>
                  setDraft((d) => ({ ...d, active: checked }))
                }
              />
              <label htmlFor="campaign-active" className="text-sm">
                Campagne active (visible sur le site)
              </label>
            </div>
            <MutationError message={mutationError} />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                className="rounded-full"
                data-ocid="admin.campaigns.save_button"
                disabled={!canSubmit || saving}
                onClick={submit}
              >
                {saving ? "Enregistrement…" : "Enregistrer"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                data-ocid="admin.campaigns.cancel_button"
                onClick={closeForm}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <p
          data-ocid="admin.campaigns.loading_state"
          className="text-sm text-muted-foreground"
        >
          Chargement des campagnes…
        </p>
      )}

      {isError && (
        <div data-ocid="admin.campaigns.error_state" className="space-y-2">
          <p className="text-sm text-destructive">
            Impossible de charger les campagnes.
          </p>
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => void refetch()}
          >
            Réessayer
          </Button>
        </div>
      )}

      {!isLoading && !isError && (campaigns?.length ?? 0) === 0 && (
        <p
          data-ocid="admin.campaigns.empty_state"
          className="rounded-lg border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground"
        >
          Aucune campagne. Créez-en une pour lancer une collecte de dons.
        </p>
      )}

      <ul className="space-y-3">
        {campaigns?.map((campaign, index) => {
          const percent = progressPercent(
            campaign.raisedAmount,
            campaign.goalAmount,
          );
          return (
            <li
              key={campaign.id.toString()}
              data-ocid={`admin.campaigns.item.${index + 1}`}
              className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-subtle"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-medium">{campaign.title}</h3>
                    <span
                      className={
                        campaign.active
                          ? "rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                          : "rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                      }
                    >
                      {campaign.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {campaign.description}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    data-ocid={`admin.campaigns.toggle_button.${index + 1}`}
                    disabled={updateCampaign.isPending}
                    onClick={() => toggleActive(campaign)}
                  >
                    {campaign.active ? "Désactiver" : "Activer"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    data-ocid={`admin.campaigns.edit_button.${index + 1}`}
                    onClick={() => openEdit(campaign)}
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                    Modifier
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full text-destructive"
                    data-ocid={`admin.campaigns.delete_button.${index + 1}`}
                    onClick={() => setPendingDelete(campaign)}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    Supprimer
                  </Button>
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-mono text-muted-foreground">
                    {formatAmount(campaign.raisedAmount, campaign.currency)} /{" "}
                    {formatAmount(campaign.goalAmount, campaign.currency)}
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {percent.toFixed(0)} %
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-primary"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <ConfirmDeleteDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title="Supprimer cette campagne ?"
        description={`« ${pendingDelete?.title ?? ""} » sera définitivement supprimée.`}
        pending={deleteCampaign.isPending}
        ocid="admin.campaigns.delete"
        onConfirm={() => {
          if (pendingDelete) {
            deleteCampaign.mutate(pendingDelete.id, {
              onSuccess: () => setPendingDelete(null),
            });
          }
        }}
      />
    </div>
  );
}
