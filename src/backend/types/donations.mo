import Common "common";

module {
  public type Id = Common.Id;
  public type Timestamp = Common.Timestamp;
  public type Currency = Common.Currency;
  public type Frequency = Common.Frequency;

  /// Supported payment methods.
  public type PaymentMethod = {
    #mpesa;
    #orangeMoney;
    #airtelMoney;
    #afrimoney;
    #visa;
    #mastercard;
  };

  /// Donation status.
  public type DonationStatus = {
    #pending;
    #confirmed;
    #failed;
  };

  /// Donor contact details.
  public type DonorInfo = {
    name : Text;
    email : Text;
    phone : ?Text;
  };

  /// A recorded donation. `programmeId = null` means general fund.
  public type Donation = {
    id : Id;
    amount : Nat;
    currency : Currency;
    frequency : Frequency;
    programmeId : ?Id;
    method : PaymentMethod;
    donor : DonorInfo;
    transactionNumber : Text;
    createdAt : Timestamp;
    status : DonationStatus;
  };

  /// Per-method payment configuration (admin-managed).
  public type MethodSettings = {
    enabled : Bool;
    apiKey : Text;
    apiSecret : Text;
  };

  /// Global payment settings (admin-managed).
  public type PaymentSettings = {
    testMode : Bool;
    webhookUrl : Text;
    acceptedCurrencies : [Currency];
    mpesa : MethodSettings;
    orangeMoney : MethodSettings;
    airtelMoney : MethodSettings;
    afrimoney : MethodSettings;
    visa : MethodSettings;
    mastercard : MethodSettings;
  };
};
