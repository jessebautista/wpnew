[
  {
    "table_name": "blog_posts",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "blog_posts",
    "column_name": "title",
    "data_type": "character varying"
  },
  {
    "table_name": "blog_posts",
    "column_name": "slug",
    "data_type": "character varying"
  },
  {
    "table_name": "blog_posts",
    "column_name": "content",
    "data_type": "text"
  },
  {
    "table_name": "blog_posts",
    "column_name": "excerpt",
    "data_type": "text"
  },
  {
    "table_name": "blog_posts",
    "column_name": "featured_image",
    "data_type": "text"
  },
  {
    "table_name": "blog_posts",
    "column_name": "category",
    "data_type": "character varying"
  },
  {
    "table_name": "blog_posts",
    "column_name": "tags",
    "data_type": "ARRAY"
  },
  {
    "table_name": "blog_posts",
    "column_name": "author_id",
    "data_type": "uuid"
  },
  {
    "table_name": "blog_posts",
    "column_name": "published",
    "data_type": "boolean"
  },
  {
    "table_name": "blog_posts",
    "column_name": "featured",
    "data_type": "boolean"
  },
  {
    "table_name": "blog_posts",
    "column_name": "allow_comments",
    "data_type": "boolean"
  },
  {
    "table_name": "blog_posts",
    "column_name": "view_count",
    "data_type": "integer"
  },
  {
    "table_name": "blog_posts",
    "column_name": "reading_time",
    "data_type": "integer"
  },
  {
    "table_name": "blog_posts",
    "column_name": "meta_title",
    "data_type": "character varying"
  },
  {
    "table_name": "blog_posts",
    "column_name": "meta_description",
    "data_type": "text"
  },
  {
    "table_name": "blog_posts",
    "column_name": "moderation_status",
    "data_type": "USER-DEFINED"
  },
  {
    "table_name": "blog_posts",
    "column_name": "moderated_by",
    "data_type": "uuid"
  },
  {
    "table_name": "blog_posts",
    "column_name": "moderated_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "blog_posts",
    "column_name": "published_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "blog_posts",
    "column_name": "created_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "blog_posts",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "blog_posts",
    "column_name": "legacy_id",
    "data_type": "character varying"
  },
  {
    "table_name": "comments",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "comments",
    "column_name": "content",
    "data_type": "text"
  },
  {
    "table_name": "comments",
    "column_name": "content_type",
    "data_type": "character varying"
  },
  {
    "table_name": "comments",
    "column_name": "content_id",
    "data_type": "uuid"
  },
  {
    "table_name": "comments",
    "column_name": "author_id",
    "data_type": "uuid"
  },
  {
    "table_name": "comments",
    "column_name": "parent_id",
    "data_type": "uuid"
  },
  {
    "table_name": "comments",
    "column_name": "likes_count",
    "data_type": "integer"
  },
  {
    "table_name": "comments",
    "column_name": "is_edited",
    "data_type": "boolean"
  },
  {
    "table_name": "comments",
    "column_name": "edited_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "comments",
    "column_name": "moderation_status",
    "data_type": "USER-DEFINED"
  },
  {
    "table_name": "comments",
    "column_name": "moderated_by",
    "data_type": "uuid"
  },
  {
    "table_name": "comments",
    "column_name": "moderated_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "comments",
    "column_name": "created_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "comments",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "comments",
    "column_name": "legacy_id",
    "data_type": "character varying"
  },
  {
    "table_name": "comments",
    "column_name": "author_name",
    "data_type": "text"
  },
  {
    "table_name": "event_attendees",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "event_attendees",
    "column_name": "event_id",
    "data_type": "uuid"
  },
  {
    "table_name": "event_attendees",
    "column_name": "user_id",
    "data_type": "uuid"
  },
  {
    "table_name": "event_attendees",
    "column_name": "status",
    "data_type": "character varying"
  },
  {
    "table_name": "event_attendees",
    "column_name": "registered_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "event_attendees",
    "column_name": "checked_in",
    "data_type": "boolean"
  },
  {
    "table_name": "event_attendees",
    "column_name": "checked_in_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "event_interests",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "event_interests",
    "column_name": "event_id",
    "data_type": "uuid"
  },
  {
    "table_name": "event_interests",
    "column_name": "user_id",
    "data_type": "uuid"
  },
  {
    "table_name": "event_interests",
    "column_name": "interested",
    "data_type": "boolean"
  },
  {
    "table_name": "event_interests",
    "column_name": "created_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "events",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "events",
    "column_name": "title",
    "data_type": "character varying"
  },
  {
    "table_name": "events",
    "column_name": "description",
    "data_type": "text"
  },
  {
    "table_name": "events",
    "column_name": "date",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "events",
    "column_name": "end_date",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "events",
    "column_name": "location_name",
    "data_type": "character varying"
  },
  {
    "table_name": "events",
    "column_name": "address",
    "data_type": "text"
  },
  {
    "table_name": "events",
    "column_name": "latitude",
    "data_type": "numeric"
  },
  {
    "table_name": "events",
    "column_name": "longitude",
    "data_type": "numeric"
  },
  {
    "table_name": "events",
    "column_name": "piano_id",
    "data_type": "uuid"
  },
  {
    "table_name": "events",
    "column_name": "category",
    "data_type": "character varying"
  },
  {
    "table_name": "events",
    "column_name": "max_attendees",
    "data_type": "integer"
  },
  {
    "table_name": "events",
    "column_name": "current_attendees",
    "data_type": "integer"
  },
  {
    "table_name": "events",
    "column_name": "is_virtual",
    "data_type": "boolean"
  },
  {
    "table_name": "events",
    "column_name": "meeting_url",
    "data_type": "text"
  },
  {
    "table_name": "events",
    "column_name": "ticket_price",
    "data_type": "numeric"
  },
  {
    "table_name": "events",
    "column_name": "status",
    "data_type": "USER-DEFINED"
  },
  {
    "table_name": "events",
    "column_name": "organizer_id",
    "data_type": "uuid"
  },
  {
    "table_name": "events",
    "column_name": "contact_email",
    "data_type": "text"
  },
  {
    "table_name": "events",
    "column_name": "contact_phone",
    "data_type": "character varying"
  },
  {
    "table_name": "events",
    "column_name": "moderation_status",
    "data_type": "USER-DEFINED"
  },
  {
    "table_name": "events",
    "column_name": "moderated_by",
    "data_type": "uuid"
  },
  {
    "table_name": "events",
    "column_name": "moderated_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "events",
    "column_name": "created_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "events",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "events",
    "column_name": "legacy_id",
    "data_type": "character varying"
  },
  {
    "table_name": "events",
    "column_name": "attendee_count",
    "data_type": "integer"
  },
  {
    "table_name": "events",
    "column_name": "created_by",
    "data_type": "uuid"
  },
  {
    "table_name": "events",
    "column_name": "verified_by",
    "data_type": "uuid"
  },
  {
    "table_name": "events",
    "column_name": "organizer",
    "data_type": "text"
  },
  {
    "table_name": "events",
    "column_name": "verified",
    "data_type": "boolean"
  },
  {
    "table_name": "events",
    "column_name": "piano_count",
    "data_type": "integer"
  },
  {
    "table_name": "events",
    "column_name": "piano_type",
    "data_type": "character varying"
  },
  {
    "table_name": "events",
    "column_name": "piano_condition",
    "data_type": "character varying"
  },
  {
    "table_name": "events",
    "column_name": "piano_special_features",
    "data_type": "ARRAY"
  },
  {
    "table_name": "events",
    "column_name": "piano_accessibility",
    "data_type": "text"
  },
  {
    "table_name": "events",
    "column_name": "piano_images",
    "data_type": "ARRAY"
  },
  {
    "table_name": "geography_columns",
    "column_name": "f_table_catalog",
    "data_type": "name"
  },
  {
    "table_name": "geography_columns",
    "column_name": "f_table_schema",
    "data_type": "name"
  },
  {
    "table_name": "geography_columns",
    "column_name": "f_table_name",
    "data_type": "name"
  },
  {
    "table_name": "geography_columns",
    "column_name": "f_geography_column",
    "data_type": "name"
  },
  {
    "table_name": "geography_columns",
    "column_name": "coord_dimension",
    "data_type": "integer"
  },
  {
    "table_name": "geography_columns",
    "column_name": "srid",
    "data_type": "integer"
  },
  {
    "table_name": "geography_columns",
    "column_name": "type",
    "data_type": "text"
  },
  {
    "table_name": "geometry_columns",
    "column_name": "f_table_catalog",
    "data_type": "character varying"
  },
  {
    "table_name": "geometry_columns",
    "column_name": "f_table_schema",
    "data_type": "name"
  },
  {
    "table_name": "geometry_columns",
    "column_name": "f_table_name",
    "data_type": "name"
  },
  {
    "table_name": "geometry_columns",
    "column_name": "f_geometry_column",
    "data_type": "name"
  },
  {
    "table_name": "geometry_columns",
    "column_name": "coord_dimension",
    "data_type": "integer"
  },
  {
    "table_name": "geometry_columns",
    "column_name": "srid",
    "data_type": "integer"
  },
  {
    "table_name": "geometry_columns",
    "column_name": "type",
    "data_type": "character varying"
  },
  {
    "table_name": "newsletter_subscriptions",
    "column_name": "id",
    "data_type": "character varying"
  },
  {
    "table_name": "newsletter_subscriptions",
    "column_name": "email",
    "data_type": "character varying"
  },
  {
    "table_name": "newsletter_subscriptions",
    "column_name": "status",
    "data_type": "character varying"
  },
  {
    "table_name": "newsletter_subscriptions",
    "column_name": "source",
    "data_type": "character varying"
  },
  {
    "table_name": "piano_favorites",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "piano_favorites",
    "column_name": "user_id",
    "data_type": "uuid"
  },
  {
    "table_name": "piano_favorites",
    "column_name": "event_id",
    "data_type": "uuid"
  },
  {
    "table_name": "piano_favorites",
    "column_name": "created_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "piano_images",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "piano_images",
    "column_name": "event_id",
    "data_type": "uuid"
  },
  {
    "table_name": "piano_images",
    "column_name": "image_url",
    "data_type": "text"
  },
  {
    "table_name": "piano_images",
    "column_name": "alt_text",
    "data_type": "text"
  },
  {
    "table_name": "piano_images",
    "column_name": "caption",
    "data_type": "text"
  },
  {
    "table_name": "piano_images",
    "column_name": "created_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "piano_visits",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "piano_visits",
    "column_name": "user_id",
    "data_type": "uuid"
  },
  {
    "table_name": "piano_visits",
    "column_name": "event_id",
    "data_type": "uuid"
  },
  {
    "table_name": "piano_visits",
    "column_name": "visit_date",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "piano_visits",
    "column_name": "notes",
    "data_type": "text"
  },
  {
    "table_name": "piano_visits",
    "column_name": "created_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "reports",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "reports",
    "column_name": "content_type",
    "data_type": "character varying"
  },
  {
    "table_name": "reports",
    "column_name": "content_id",
    "data_type": "uuid"
  },
  {
    "table_name": "reports",
    "column_name": "reason",
    "data_type": "text"
  },
  {
    "table_name": "reports",
    "column_name": "reported_by",
    "data_type": "uuid"
  },
  {
    "table_name": "reports",
    "column_name": "status",
    "data_type": "USER-DEFINED"
  },
  {
    "table_name": "reports",
    "column_name": "created_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "reports",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "reviews",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "reviews",
    "column_name": "user_id",
    "data_type": "uuid"
  },
  {
    "table_name": "reviews",
    "column_name": "event_id",
    "data_type": "uuid"
  },
  {
    "table_name": "reviews",
    "column_name": "rating",
    "data_type": "integer"
  },
  {
    "table_name": "reviews",
    "column_name": "comment",
    "data_type": "text"
  },
  {
    "table_name": "reviews",
    "column_name": "created_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "reviews",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "spatial_ref_sys",
    "column_name": "srid",
    "data_type": "integer"
  },
  {
    "table_name": "spatial_ref_sys",
    "column_name": "auth_name",
    "data_type": "character varying"
  },
  {
    "table_name": "spatial_ref_sys",
    "column_name": "auth_srid",
    "data_type": "integer"
  },
  {
    "table_name": "spatial_ref_sys",
    "column_name": "srtext",
    "data_type": "text"
  },
  {
    "table_name": "spatial_ref_sys",
    "column_name": "proj4text",
    "data_type": "text"
  },
  {
    "table_name": "users",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "users",
    "column_name": "email",
    "data_type": "character varying"
  },
  {
    "table_name": "users",
    "column_name": "username",
    "data_type": "character varying"
  },
  {
    "table_name": "users",
    "column_name": "full_name",
    "data_type": "character varying"
  },
  {
    "table_name": "users",
    "column_name": "avatar_url",
    "data_type": "text"
  },
  {
    "table_name": "users",
    "column_name": "created_at",
    "data_type": "timestamp with time zone"
  },
  {
    "table_name": "users",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone"
  }
]
