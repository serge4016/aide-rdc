import Int "mo:core/Int";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Types "../types/donations";

module {
  /// Build a unique, human-readable transaction number from the donation id.
  /// Format: DON-<id>-<timestamp suffix>.
  func makeTransactionNumber(id : Types.Id, now : Types.Timestamp) : Text {
    let suffix = Int.abs(now % 1_000_000).toText();
    "DON-" # id.toText() # "-" # suffix;
  };

  /// Record a donation and return it with its generated transaction number.
  public func createDonation(
    donations : Map.Map<Types.Id, Types.Donation>,
    state : { var nextDonationId : Nat },
    amount : Nat,
    currency : Types.Currency,
    frequency : Types.Frequency,
    programmeId : ?Types.Id,
    method : Types.PaymentMethod,
    donor : Types.DonorInfo,
  ) : Types.Donation {
    let id = state.nextDonationId;
    state.nextDonationId := id + 1;
    let now = Time.now();
    let donation : Types.Donation = {
      id;
      amount;
      currency;
      frequency;
      programmeId;
      method;
      donor;
      transactionNumber = makeTransactionNumber(id, now);
      createdAt = now;
      status = #pending;
    };
    donations.add(id, donation);
    donation;
  };

  public func getDonation(donations : Map.Map<Types.Id, Types.Donation>, id : Types.Id) : ?Types.Donation {
    donations.get(id);
  };

  public func listDonations(donations : Map.Map<Types.Id, Types.Donation>) : [Types.Donation] {
    donations.values().toArray();
  };

  /// Update a donation's status (admin).
  public func updateDonationStatus(
    donations : Map.Map<Types.Id, Types.Donation>,
    id : Types.Id,
    status : Types.DonationStatus,
  ) : ?Types.Donation {
    switch (donations.get(id)) {
      case (?existing) {
        let updated : Types.Donation = { existing with status };
        donations.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  /// Read the current payment settings.
  public func getPaymentSettings(settings : Types.PaymentSettings) : Types.PaymentSettings {
    settings;
  };

  /// Replace the payment settings (admin).
  public func updatePaymentSettings(
    settings : { var current : Types.PaymentSettings },
    next : Types.PaymentSettings,
  ) : Types.PaymentSettings {
    settings.current := next;
    next;
  };
};
