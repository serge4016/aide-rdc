import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDonations, useUpdateDonationStatus } from "@/hooks/useQueries";
import { formatAmount, formatDate } from "@/lib/format";
import {
  DONATION_STATUS_LABELS,
  type Donation,
  DonationStatus,
  PAYMENT_METHOD_LABELS,
} from "@/types";
import { AdminSectionHeader, MutationError } from "./AdminUI";

const STATUS_STYLES: Record<DonationStatus, string> = {
  [DonationStatus.pending]: "bg-accent/20 text-accent-foreground",
  [DonationStatus.confirmed]: "bg-primary/10 text-primary",
  [DonationStatus.failed]: "bg-destructive/10 text-destructive",
};

export function DonationsAdmin() {
  const { data: donations, isLoading, isError, refetch } = useDonations();
  const updateStatus = useUpdateDonationStatus();

  return (
    <div className="space-y-6" data-ocid="admin.donations.panel">
      <AdminSectionHeader
        title="Dons reçus"
        description="Consultez les dons enregistrés et confirmez ou marquez leur statut."
      />

      <MutationError message={updateStatus.error?.message} />

      {isLoading && (
        <p
          data-ocid="admin.donations.loading_state"
          className="text-sm text-muted-foreground"
        >
          Chargement des dons…
        </p>
      )}

      {isError && (
        <div data-ocid="admin.donations.error_state" className="space-y-2">
          <p className="text-sm text-destructive">
            Impossible de charger la liste des dons.
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

      {!isLoading && !isError && (donations?.length ?? 0) === 0 && (
        <p
          data-ocid="admin.donations.empty_state"
          className="rounded-lg border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground"
        >
          Aucun don enregistré pour le moment.
        </p>
      )}

      {!isLoading && !isError && (donations?.length ?? 0) > 0 && (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-subtle">
          <Table data-ocid="admin.donations.table">
            <TableHeader className="sticky top-0 bg-muted/60">
              <TableRow>
                <TableHead>Donateur</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations?.map((donation: Donation, index) => (
                <TableRow
                  key={donation.id.toString()}
                  data-ocid={`admin.donations.row.${index + 1}`}
                >
                  <TableCell>
                    <span className="font-medium">{donation.donor.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {donation.donor.email}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {PAYMENT_METHOD_LABELS[donation.method]}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {donation.transactionNumber}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(donation.createdAt)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatAmount(donation.amount, donation.currency)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[donation.status]}`}
                      >
                        {DONATION_STATUS_LABELS[donation.status]}
                      </span>
                      <Select
                        value={donation.status}
                        onValueChange={(value) =>
                          updateStatus.mutate({
                            id: donation.id,
                            status: value as DonationStatus,
                          })
                        }
                      >
                        <SelectTrigger
                          className="h-8 w-[9.5rem]"
                          data-ocid={`admin.donations.status_select.${index + 1}`}
                          aria-label={`Statut du don de ${donation.donor.name}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(DonationStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {DONATION_STATUS_LABELS[status]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
