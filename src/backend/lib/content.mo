import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Types "../types/content";

module {
  // --- Articles ---
  public func listPublishedArticles(articles : Map.Map<Types.Id, Types.Article>) : [Types.Article] {
    articles.values().filter(func article = article.published).toArray();
  };

  public func listAllArticles(articles : Map.Map<Types.Id, Types.Article>) : [Types.Article] {
    articles.values().toArray();
  };

  public func getArticle(articles : Map.Map<Types.Id, Types.Article>, id : Types.Id) : ?Types.Article {
    articles.get(id);
  };

  public func createArticle(
    articles : Map.Map<Types.Id, Types.Article>,
    state : { var nextArticleId : Nat },
    title : Text,
    category : Text,
    author : Text,
    imageUrl : Text,
    content : Text,
    published : Bool,
  ) : Types.Article {
    let id = state.nextArticleId;
    state.nextArticleId := id + 1;
    let article : Types.Article = {
      id;
      title;
      category;
      author;
      publishedAt = Time.now();
      imageUrl;
      content;
      published;
    };
    articles.add(id, article);
    article;
  };

  public func updateArticle(
    articles : Map.Map<Types.Id, Types.Article>,
    id : Types.Id,
    title : Text,
    category : Text,
    author : Text,
    imageUrl : Text,
    content : Text,
    published : Bool,
  ) : ?Types.Article {
    switch (articles.get(id)) {
      case (?existing) {
        let updated : Types.Article = {
          id = existing.id;
          title;
          category;
          author;
          publishedAt = existing.publishedAt;
          imageUrl;
          content;
          published;
        };
        articles.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  public func deleteArticle(articles : Map.Map<Types.Id, Types.Article>, id : Types.Id) : Bool {
    switch (articles.get(id)) {
      case (?_) {
        articles.remove(id);
        true;
      };
      case null { false };
    };
  };

  // --- Programmes ---
  public func listProgrammes(programmes : Map.Map<Types.Id, Types.Programme>) : [Types.Programme] {
    programmes.values().toArray().sort(func (a, b) = Nat.compare(a.displayOrder, b.displayOrder));
  };

  public func getProgramme(programmes : Map.Map<Types.Id, Types.Programme>, id : Types.Id) : ?Types.Programme {
    programmes.get(id);
  };

  public func createProgramme(
    programmes : Map.Map<Types.Id, Types.Programme>,
    state : { var nextProgrammeId : Nat },
    title : Text,
    description : Text,
    objectives : [Text],
    actions : [Text],
    imageUrl : Text,
    displayOrder : Nat,
  ) : Types.Programme {
    let id = state.nextProgrammeId;
    state.nextProgrammeId := id + 1;
    let programme : Types.Programme = {
      id;
      title;
      description;
      objectives;
      actions;
      imageUrl;
      displayOrder;
    };
    programmes.add(id, programme);
    programme;
  };

  public func updateProgramme(
    programmes : Map.Map<Types.Id, Types.Programme>,
    id : Types.Id,
    title : Text,
    description : Text,
    objectives : [Text],
    actions : [Text],
    imageUrl : Text,
    displayOrder : Nat,
  ) : ?Types.Programme {
    switch (programmes.get(id)) {
      case (?_) {
        let updated : Types.Programme = {
          id;
          title;
          description;
          objectives;
          actions;
          imageUrl;
          displayOrder;
        };
        programmes.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  public func deleteProgramme(programmes : Map.Map<Types.Id, Types.Programme>, id : Types.Id) : Bool {
    switch (programmes.get(id)) {
      case (?_) {
        programmes.remove(id);
        true;
      };
      case null { false };
    };
  };

  // --- Testimonies ---
  public func listTestimonies(testimonies : Map.Map<Types.Id, Types.Testimony>) : [Types.Testimony] {
    testimonies.values().toArray();
  };

  public func createTestimony(
    testimonies : Map.Map<Types.Id, Types.Testimony>,
    state : { var nextTestimonyId : Nat },
    name : Text,
    origin : Text,
    story : Text,
    imageUrl : ?Text,
  ) : Types.Testimony {
    let id = state.nextTestimonyId;
    state.nextTestimonyId := id + 1;
    let testimony : Types.Testimony = { id; name; origin; story; imageUrl };
    testimonies.add(id, testimony);
    testimony;
  };

  public func updateTestimony(
    testimonies : Map.Map<Types.Id, Types.Testimony>,
    id : Types.Id,
    name : Text,
    origin : Text,
    story : Text,
    imageUrl : ?Text,
  ) : ?Types.Testimony {
    switch (testimonies.get(id)) {
      case (?_) {
        let updated : Types.Testimony = { id; name; origin; story; imageUrl };
        testimonies.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  public func deleteTestimony(testimonies : Map.Map<Types.Id, Types.Testimony>, id : Types.Id) : Bool {
    switch (testimonies.get(id)) {
      case (?_) {
        testimonies.remove(id);
        true;
      };
      case null { false };
    };
  };

  // --- Photos ---
  public func listPhotos(photos : Map.Map<Types.Id, Types.Photo>) : [Types.Photo] {
    photos.values().toArray().sort(func (a, b) = Nat.compare(a.displayOrder, b.displayOrder));
  };

  public func createPhoto(
    photos : Map.Map<Types.Id, Types.Photo>,
    state : { var nextPhotoId : Nat },
    imageUrl : Text,
    caption : Text,
    displayOrder : Nat,
  ) : Types.Photo {
    let id = state.nextPhotoId;
    state.nextPhotoId := id + 1;
    let photo : Types.Photo = { id; imageUrl; caption; displayOrder };
    photos.add(id, photo);
    photo;
  };

  public func updatePhoto(
    photos : Map.Map<Types.Id, Types.Photo>,
    id : Types.Id,
    imageUrl : Text,
    caption : Text,
    displayOrder : Nat,
  ) : ?Types.Photo {
    switch (photos.get(id)) {
      case (?_) {
        let updated : Types.Photo = { id; imageUrl; caption; displayOrder };
        photos.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  public func deletePhoto(photos : Map.Map<Types.Id, Types.Photo>, id : Types.Id) : Bool {
    switch (photos.get(id)) {
      case (?_) {
        photos.remove(id);
        true;
      };
      case null { false };
    };
  };

  // --- Campaigns ---
  public func listActiveCampaigns(campaigns : Map.Map<Types.Id, Types.Campaign>) : [Types.Campaign] {
    campaigns.values().filter(func campaign = campaign.active).toArray();
  };

  public func listAllCampaigns(campaigns : Map.Map<Types.Id, Types.Campaign>) : [Types.Campaign] {
    campaigns.values().toArray();
  };

  public func getCampaign(campaigns : Map.Map<Types.Id, Types.Campaign>, id : Types.Id) : ?Types.Campaign {
    campaigns.get(id);
  };

  public func createCampaign(
    campaigns : Map.Map<Types.Id, Types.Campaign>,
    state : { var nextCampaignId : Nat },
    title : Text,
    description : Text,
    goalAmount : Nat,
    currency : Types.Currency,
    active : Bool,
  ) : Types.Campaign {
    let id = state.nextCampaignId;
    state.nextCampaignId := id + 1;
    let campaign : Types.Campaign = {
      id;
      title;
      description;
      goalAmount;
      raisedAmount = 0;
      currency;
      active;
    };
    campaigns.add(id, campaign);
    campaign;
  };

  public func updateCampaign(
    campaigns : Map.Map<Types.Id, Types.Campaign>,
    id : Types.Id,
    title : Text,
    description : Text,
    goalAmount : Nat,
    currency : Types.Currency,
    active : Bool,
  ) : ?Types.Campaign {
    switch (campaigns.get(id)) {
      case (?existing) {
        let updated : Types.Campaign = {
          id = existing.id;
          title;
          description;
          goalAmount;
          raisedAmount = existing.raisedAmount;
          currency;
          active;
        };
        campaigns.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  public func deleteCampaign(campaigns : Map.Map<Types.Id, Types.Campaign>, id : Types.Id) : Bool {
    switch (campaigns.get(id)) {
      case (?_) {
        campaigns.remove(id);
        true;
      };
      case null { false };
    };
  };

  // --- Contact messages ---
  public func listContactMessages(messages : Map.Map<Types.Id, Types.ContactMessage>) : [Types.ContactMessage] {
    messages.values().toArray();
  };

  public func createContactMessage(
    messages : Map.Map<Types.Id, Types.ContactMessage>,
    state : { var nextContactMessageId : Nat },
    name : Text,
    email : Text,
    subject : Text,
    message : Text,
  ) : Types.ContactMessage {
    let id = state.nextContactMessageId;
    state.nextContactMessageId := id + 1;
    let contactMessage : Types.ContactMessage = {
      id;
      name;
      email;
      subject;
      message;
      receivedAt = Time.now();
    };
    messages.add(id, contactMessage);
    contactMessage;
  };

  public func deleteContactMessage(messages : Map.Map<Types.Id, Types.ContactMessage>, id : Types.Id) : Bool {
    switch (messages.get(id)) {
      case (?_) {
        messages.remove(id);
        true;
      };
      case null { false };
    };
  };
};
