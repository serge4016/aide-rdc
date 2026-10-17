import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/content";
import ContentLib "../lib/content";

mixin (
  accessControlState : AccessControl.AccessControlState,
  articles : Map.Map<Types.Id, Types.Article>,
  programmes : Map.Map<Types.Id, Types.Programme>,
  testimonies : Map.Map<Types.Id, Types.Testimony>,
  photos : Map.Map<Types.Id, Types.Photo>,
  campaigns : Map.Map<Types.Id, Types.Campaign>,
  contactMessages : Map.Map<Types.Id, Types.ContactMessage>,
  contentState : {
    var nextArticleId : Nat;
    var nextProgrammeId : Nat;
    var nextTestimonyId : Nat;
    var nextPhotoId : Nat;
    var nextCampaignId : Nat;
    var nextContactMessageId : Nat;
  },
) {
  func requireAdmin(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  // --- Public reads ---
  public query func listPublishedArticles() : async [Types.Article] {
    ContentLib.listPublishedArticles(articles);
  };

  public query func getArticle(id : Types.Id) : async ?Types.Article {
    ContentLib.getArticle(articles, id);
  };

  public query func listProgrammes() : async [Types.Programme] {
    ContentLib.listProgrammes(programmes);
  };

  public query func getProgramme(id : Types.Id) : async ?Types.Programme {
    ContentLib.getProgramme(programmes, id);
  };

  public query func listTestimonies() : async [Types.Testimony] {
    ContentLib.listTestimonies(testimonies);
  };

  public query func listPhotos() : async [Types.Photo] {
    ContentLib.listPhotos(photos);
  };

  public query func listActiveCampaigns() : async [Types.Campaign] {
    ContentLib.listActiveCampaigns(campaigns);
  };

  public query func getCampaign(id : Types.Id) : async ?Types.Campaign {
    ContentLib.getCampaign(campaigns, id);
  };

  /// Public contact form submission.
  public shared func submitContactMessage(name : Text, email : Text, subject : Text, message : Text) : async Types.ContactMessage {
    ContentLib.createContactMessage(contactMessages, contentState, name, email, subject, message);
  };

  // --- Admin reads ---
  public query ({ caller }) func listAllArticles() : async [Types.Article] {
    requireAdmin(caller);
    ContentLib.listAllArticles(articles);
  };

  public query ({ caller }) func listAllCampaigns() : async [Types.Campaign] {
    requireAdmin(caller);
    ContentLib.listAllCampaigns(campaigns);
  };

  public query ({ caller }) func listContactMessages() : async [Types.ContactMessage] {
    requireAdmin(caller);
    ContentLib.listContactMessages(contactMessages);
  };

  // --- Admin writes: articles ---
  public shared ({ caller }) func createArticle(title : Text, category : Text, author : Text, imageUrl : Text, content : Text, published : Bool) : async Types.Article {
    requireAdmin(caller);
    ContentLib.createArticle(articles, contentState, title, category, author, imageUrl, content, published);
  };

  public shared ({ caller }) func updateArticle(id : Types.Id, title : Text, category : Text, author : Text, imageUrl : Text, content : Text, published : Bool) : async ?Types.Article {
    requireAdmin(caller);
    ContentLib.updateArticle(articles, id, title, category, author, imageUrl, content, published);
  };

  public shared ({ caller }) func deleteArticle(id : Types.Id) : async Bool {
    requireAdmin(caller);
    ContentLib.deleteArticle(articles, id);
  };

  // --- Admin writes: programmes ---
  public shared ({ caller }) func createProgramme(title : Text, description : Text, objectives : [Text], actions : [Text], imageUrl : Text, displayOrder : Nat) : async Types.Programme {
    requireAdmin(caller);
    ContentLib.createProgramme(programmes, contentState, title, description, objectives, actions, imageUrl, displayOrder);
  };

  public shared ({ caller }) func updateProgramme(id : Types.Id, title : Text, description : Text, objectives : [Text], actions : [Text], imageUrl : Text, displayOrder : Nat) : async ?Types.Programme {
    requireAdmin(caller);
    ContentLib.updateProgramme(programmes, id, title, description, objectives, actions, imageUrl, displayOrder);
  };

  public shared ({ caller }) func deleteProgramme(id : Types.Id) : async Bool {
    requireAdmin(caller);
    ContentLib.deleteProgramme(programmes, id);
  };

  // --- Admin writes: testimonies ---
  public shared ({ caller }) func createTestimony(name : Text, origin : Text, story : Text, imageUrl : ?Text) : async Types.Testimony {
    requireAdmin(caller);
    ContentLib.createTestimony(testimonies, contentState, name, origin, story, imageUrl);
  };

  public shared ({ caller }) func updateTestimony(id : Types.Id, name : Text, origin : Text, story : Text, imageUrl : ?Text) : async ?Types.Testimony {
    requireAdmin(caller);
    ContentLib.updateTestimony(testimonies, id, name, origin, story, imageUrl);
  };

  public shared ({ caller }) func deleteTestimony(id : Types.Id) : async Bool {
    requireAdmin(caller);
    ContentLib.deleteTestimony(testimonies, id);
  };

  // --- Admin writes: photos ---
  public shared ({ caller }) func createPhoto(imageUrl : Text, caption : Text, displayOrder : Nat) : async Types.Photo {
    requireAdmin(caller);
    ContentLib.createPhoto(photos, contentState, imageUrl, caption, displayOrder);
  };

  public shared ({ caller }) func updatePhoto(id : Types.Id, imageUrl : Text, caption : Text, displayOrder : Nat) : async ?Types.Photo {
    requireAdmin(caller);
    ContentLib.updatePhoto(photos, id, imageUrl, caption, displayOrder);
  };

  public shared ({ caller }) func deletePhoto(id : Types.Id) : async Bool {
    requireAdmin(caller);
    ContentLib.deletePhoto(photos, id);
  };

  // --- Admin writes: campaigns ---
  public shared ({ caller }) func createCampaign(title : Text, description : Text, goalAmount : Nat, currency : Types.Currency, active : Bool) : async Types.Campaign {
    requireAdmin(caller);
    ContentLib.createCampaign(campaigns, contentState, title, description, goalAmount, currency, active);
  };

  public shared ({ caller }) func updateCampaign(id : Types.Id, title : Text, description : Text, goalAmount : Nat, currency : Types.Currency, active : Bool) : async ?Types.Campaign {
    requireAdmin(caller);
    ContentLib.updateCampaign(campaigns, id, title, description, goalAmount, currency, active);
  };

  public shared ({ caller }) func deleteCampaign(id : Types.Id) : async Bool {
    requireAdmin(caller);
    ContentLib.deleteCampaign(campaigns, id);
  };

  // --- Admin writes: contact messages ---
  public shared ({ caller }) func deleteContactMessage(id : Types.Id) : async Bool {
    requireAdmin(caller);
    ContentLib.deleteContactMessage(contactMessages, id);
  };
};
