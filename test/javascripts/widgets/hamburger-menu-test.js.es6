import { moduleForWidget, widgetTest } from "helpers/widget-test";

moduleForWidget("hamburger-menu");

const maxCategoriesToDisplay = 6;
const topCategoryIds = [2, 3, 1];

widgetTest("prioritize faq", {
  template: '{{mount-widget widget="hamburger-menu"}}',

  beforeEach() {
    this.siteSettings.faq_url = "http://example.com/faq";
    this.currentUser.set("read_faq", false);
  },

  test(assert) {
    assert.ok(this.$(".faq-priority").length);
    assert.ok(!this.$(".faq-link").length);
  }
});

widgetTest("prioritize faq - user has read", {
  template: '{{mount-widget widget="hamburger-menu"}}',

  beforeEach() {
    this.siteSettings.faq_url = "http://example.com/faq";
    this.currentUser.set("read_faq", true);
  },

  test(assert) {
    assert.ok(!this.$(".faq-priority").length);
    assert.ok(this.$(".faq-link").length);
  }
});

widgetTest("staff menu - not staff", {
  template: '{{mount-widget widget="hamburger-menu"}}',

  beforeEach() {
    this.currentUser.set("staff", false);
  },

  test(assert) {
    assert.ok(!this.$(".admin-link").length);
  }
});

widgetTest("staff menu", {
  template: '{{mount-widget widget="hamburger-menu"}}',

  beforeEach() {
    this.currentUser.setProperties({
      staff: true,
      site_flagged_posts_count: 3
    });
  },

  test(assert) {
    assert.ok(this.$(".admin-link").length);
    assert.ok(this.$(".flagged-posts-link").length);
    assert.equal(this.$(".flagged-posts").text(), "3");
    assert.ok(!this.$(".settings-link").length);
  }
});

widgetTest("staff menu - admin", {
  template: '{{mount-widget widget="hamburger-menu"}}',

  beforeEach() {
    this.currentUser.setProperties({ staff: true, admin: true });
  },

  test(assert) {
    assert.ok(this.$(".settings-link").length);
  }
});

widgetTest("queued posts", {
  template: '{{mount-widget widget="hamburger-menu"}}',

  beforeEach() {
    this.currentUser.setProperties({
      staff: true,
      show_queued_posts: true,
      post_queue_new_count: 5
    });
  },

  test(assert) {
    assert.ok(this.$(".queued-posts-link").length);
    assert.equal(this.$(".queued-posts").text(), "5");
  }
});

widgetTest("queued posts - disabled", {
  template: '{{mount-widget widget="hamburger-menu"}}',

  beforeEach() {
    this.currentUser.setProperties({ staff: true, show_queued_posts: false });
  },

  test(assert) {
    assert.ok(!this.$(".queued-posts-link").length);
  }
});

widgetTest("logged in links", {
  template: '{{mount-widget widget="hamburger-menu"}}',

  test(assert) {
    assert.ok(this.$(".new-topics-link").length);
    assert.ok(this.$(".unread-topics-link").length);
  }
});

widgetTest("general links", {
  template: '{{mount-widget widget="hamburger-menu"}}',
  anonymous: true,

  test(assert) {
    assert.ok(this.$("li[class='']").length === 0);
    assert.ok(this.$(".latest-topics-link").length);
    assert.ok(!this.$(".new-topics-link").length);
    assert.ok(!this.$(".unread-topics-link").length);
    assert.ok(this.$(".top-topics-link").length);
    assert.ok(this.$(".badge-link").length);
    assert.ok(this.$(".category-link").length > 0);
  }
});

widgetTest("top categories - anonymous", {
  template: '{{mount-widget widget="hamburger-menu"}}',
  anonymous: true,

  test(assert) {
    const count = this.site.get("categoriesByCount").length;
    const maximum =
      count <= maxCategoriesToDisplay ? count : maxCategoriesToDisplay;
    assert.equal(find(".category-link").length, maximum);
  }
});

widgetTest("top categories", {
  template: '{{mount-widget widget="hamburger-menu"}}',

  beforeEach() {
    this.currentUser.set("top_category_ids", topCategoryIds);
  },

  test(assert) {
    assert.equal(find(".category-link").length, maxCategoriesToDisplay);

    const categoriesList = this.site
      .get("categoriesByCount")
      .reject(c => c.parent_category_id);
    let ids = topCategoryIds
      .concat(categoriesList.map(c => c.id))
      .uniq()
      .slice(0, maxCategoriesToDisplay);

    assert.equal(
      find(".category-link .category-name").text(),
      ids.map(i => categoriesList.find(c => c.id === i).name).join("")
    );
  }
});

widgetTest("badges link - disabled", {
  template: '{{mount-widget widget="hamburger-menu"}}',

  beforeEach() {
    this.siteSettings.enable_badges = false;
  },

  test(assert) {
    assert.ok(!this.$(".badge-link").length);
  }
});

widgetTest("badges link", {
  template: '{{mount-widget widget="hamburger-menu"}}',

  test(assert) {
    assert.ok(this.$(".badge-link").length);
  }
});

widgetTest("user directory link", {
  template: '{{mount-widget widget="hamburger-menu"}}',

  test(assert) {
    assert.ok(this.$(".user-directory-link").length);
  }
});

widgetTest("user directory link - disabled", {
  template: '{{mount-widget widget="hamburger-menu"}}',

  beforeEach() {
    this.siteSettings.enable_user_directory = false;
  },

  test(assert) {
    assert.ok(!this.$(".user-directory-link").length);
  }
});

widgetTest("general links", {
  template: '{{mount-widget widget="hamburger-menu"}}',

  test(assert) {
    assert.ok(this.$(".about-link").length);
    assert.ok(this.$(".keyboard-shortcuts-link").length);
  }
});
