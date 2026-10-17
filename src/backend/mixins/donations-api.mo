import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/donations";
import DonationsLib "../lib/donations";

mixin (
  accessControlState : AccessControl.AccessControlState,
  donations : Map.Map<Types.Id, Types.Donation>,
  paymentSettings : { var current : Types.PaymentSettings },
  donationState : { var nextDonationId : Nat },
) {
  /// Public: record a donation (no sign-in required).
  public shared func createDonation(
    amount : Nat,
    currency : Types.Currency,
    frequency : Types.Frequency,
    programmeId : ?Types.Id,
    method : Types.PaymentMethod,
    donor : Types.DonorInfo,
  ) : async Types.Donation {
    DonationsLib.createDonation(
      donations,
      donationState,
      amount,
      currency,
      frequency,
      programmeId,
      method,
      donor,
    );
  };

  /// Public: read a donation by id (for the confirmation page).
  public query func getDonation(id : Types.Id) : async ?Types.Donation {
    DonationsLib.getDonation(donations, id);
  };

  /// Public: payment settings needed by the donation flow.
  public query func getPaymentSettings() : async Types.PaymentSettings {
    DonationsLib.getPaymentSettings(paymentSettings.current);
  };

  /// Admin: list all donations.
  public query ({ caller }) func listDonations() : async [Types.Donation] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can list donations");
    };
    DonationsLib.listDonations(donations);
  };

  /// Admin: update a donation's status.
  public shared ({ caller }) func updateDonationStatus(id : Types.Id, status : Types.DonationStatus) : async ?Types.Donation {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update donation status");
    };
    DonationsLib.updateDonationStatus(donations, id, status);
  };

  /// Admin: replace payment settings.
  public shared ({ caller }) func updatePaymentSettings(next : Types.PaymentSettings) : async Types.PaymentSettings {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update payment settings");
    };
    DonationsLib.updatePaymentSettings(paymentSettings, next);
  };
};
