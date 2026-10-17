import Common "common";

module {
  public type Id = Common.Id;
  public type Timestamp = Common.Timestamp;
  public type Currency = Common.Currency;

  /// Blog article. `published = false` means draft (admin-only).
  public type Article = {
    id : Id;
    title : Text;
    category : Text;
    author : Text;
    publishedAt : Timestamp;
    imageUrl : Text;
    content : Text;
    published : Bool;
  };

  /// Humanitarian programme.
  public type Programme = {
    id : Id;
    title : Text;
    description : Text;
    objectives : [Text];
    actions : [Text];
    imageUrl : Text;
    displayOrder : Nat;
  };

  /// Testimony from a displaced person.
  public type Testimony = {
    id : Id;
    name : Text;
    origin : Text;
    story : Text;
    imageUrl : ?Text;
  };

  /// Gallery photo.
  public type Photo = {
    id : Id;
    imageUrl : Text;
    caption : Text;
    displayOrder : Nat;
  };

  /// Donation campaign.
  public type Campaign = {
    id : Id;
    title : Text;
    description : Text;
    goalAmount : Nat;
    raisedAmount : Nat;
    currency : Common.Currency;
    active : Bool;
  };

  /// Contact form submission.
  public type ContactMessage = {
    id : Id;
    name : Text;
    email : Text;
    subject : Text;
    message : Text;
    receivedAt : Timestamp;
  };
};
