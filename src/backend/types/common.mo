module {
  /// Signed nanosecond timestamp (Time.now()).
  public type Timestamp = Int;

  /// Unique numeric identifier for a stored record.
  public type Id = Nat;

  /// Currency accepted by the platform.
  public type Currency = {
    #usd;
    #cdf;
  };

  /// Donation frequency.
  public type Frequency = {
    #oneTime;
    #monthly;
  };
};
