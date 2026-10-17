import AccessControl "mo:caffeineai-authorization/access-control";
import Map "mo:core/Map";

module {
  public type OldActor = {};

  public type Currency = { #usd; #cdf };

  public type MethodSettings = {
    enabled : Bool;
    apiKey : Text;
    apiSecret : Text;
  };

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

  public type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    articles : Map.Map<Nat, {
      id : Nat;
      title : Text;
      category : Text;
      author : Text;
      publishedAt : Int;
      imageUrl : Text;
      content : Text;
      published : Bool;
    }>;
    programmes : Map.Map<Nat, {
      id : Nat;
      title : Text;
      description : Text;
      objectives : [Text];
      actions : [Text];
      imageUrl : Text;
      displayOrder : Nat;
    }>;
    testimonies : Map.Map<Nat, {
      id : Nat;
      name : Text;
      origin : Text;
      story : Text;
      imageUrl : ?Text;
    }>;
    photos : Map.Map<Nat, {
      id : Nat;
      imageUrl : Text;
      caption : Text;
      displayOrder : Nat;
    }>;
    campaigns : Map.Map<Nat, {
      id : Nat;
      title : Text;
      description : Text;
      goalAmount : Nat;
      raisedAmount : Nat;
      currency : Currency;
      active : Bool;
    }>;
    contactMessages : Map.Map<Nat, {
      id : Nat;
      name : Text;
      email : Text;
      subject : Text;
      message : Text;
      receivedAt : Int;
    }>;
    contentState : {
      var nextArticleId : Nat;
      var nextProgrammeId : Nat;
      var nextTestimonyId : Nat;
      var nextPhotoId : Nat;
      var nextCampaignId : Nat;
      var nextContactMessageId : Nat;
    };
    donations : Map.Map<Nat, {
      id : Nat;
      amount : Nat;
      currency : Currency;
      frequency : { #oneTime; #monthly };
      programmeId : ?Nat;
      method : {
        #mpesa;
        #orangeMoney;
        #airtelMoney;
        #afrimoney;
        #visa;
        #mastercard;
      };
      donor : { name : Text; email : Text; phone : ?Text };
      transactionNumber : Text;
      createdAt : Int;
      status : { #pending; #confirmed; #failed };
    }>;
    paymentSettings : { var current : PaymentSettings };
    donationState : { var nextDonationId : Nat };
  };

  public func migration(_ : OldActor) : NewActor {
    {
      accessControlState = AccessControl.initState();
      articles = Map.empty();
      programmes = Map.empty();
      testimonies = Map.empty();
      photos = Map.empty();
      campaigns = Map.empty();
      contactMessages = Map.empty();
      contentState = {
        var nextArticleId = 0;
        var nextProgrammeId = 0;
        var nextTestimonyId = 0;
        var nextPhotoId = 0;
        var nextCampaignId = 0;
        var nextContactMessageId = 0;
      };
      donations = Map.empty();
      paymentSettings = {
        var current = {
          testMode = true;
          webhookUrl = "";
          acceptedCurrencies = [#usd, #cdf];
          mpesa = { enabled = false; apiKey = ""; apiSecret = "" };
          orangeMoney = { enabled = false; apiKey = ""; apiSecret = "" };
          airtelMoney = { enabled = false; apiKey = ""; apiSecret = "" };
          afrimoney = { enabled = false; apiKey = ""; apiSecret = "" };
          visa = { enabled = false; apiKey = ""; apiSecret = "" };
          mastercard = { enabled = false; apiKey = ""; apiSecret = "" };
        };
      };
      donationState = { var nextDonationId = 0 };
    };
  };
};
