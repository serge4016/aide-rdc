/// OQL value instance for `Common.Currency` (nullary variant).
/// Lets records carrying a `Currency` field ride the auto-derivation path.
import OQL "mo:caffeineai-oql";
import Common "common";

module {
  public func _toRow(self : Common.Currency) : OQL.Value =
    #text(
      switch (self) {
        case (#usd) "usd";
        case (#cdf) "cdf";
      }
    );
};
