
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "public": {
          Tables: {
            "app_settings": {
                  Row: {
                    "key": string,"updated_at": string | null,"updated_by": string | null,"value": NonNullable<Json>
                  }
                  ComputedFields: never
                  Insert: {
                    "key": string,"updated_at"?: string | null,"updated_by"?: string | null,"value": NonNullable<Json>
                  }
                  Update: {
                    "key"?: string,"updated_at"?: string | null,"updated_by"?: string | null,"value"?: NonNullable<Json>
                  }
                  Relationships: [
                    {
      foreignKeyName: "app_settings_updated_by_fkey"
      columns: ["updated_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "app_settings_updated_by_fkey"
      columns: ["updated_by"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"areas": {
                  Row: {
                    "city_id": number,"id": number,"name_en": string,"name_ur": string | null,"slug": string
                  }
                  ComputedFields: never
                  Insert: {
                    "city_id": number,"id"?: number,"name_en": string,"name_ur"?: string | null,"slug": string
                  }
                  Update: {
                    "city_id"?: number,"id"?: number,"name_en"?: string,"name_ur"?: string | null,"slug"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "areas_city_id_fkey"
      columns: ["city_id"]
isOneToOne: false
      referencedRelation: "cities"
      referencedColumns: ["id"]
    }
                  ]
                },"audit_log": {
                  Row: {
                    "action": string,"actor_id": string | null,"after": Json | null,"before": Json | null,"created_at": string | null,"id": number,"ip": unknown,"target_id": string,"target_type": string
                  }
                  ComputedFields: never
                  Insert: {
                    "action": string,"actor_id"?: string | null,"after"?: Json | null,"before"?: Json | null,"created_at"?: string | null,"id"?: number,"ip"?: unknown,"target_id": string,"target_type": string
                  }
                  Update: {
                    "action"?: string,"actor_id"?: string | null,"after"?: Json | null,"before"?: Json | null,"created_at"?: string | null,"id"?: number,"ip"?: unknown,"target_id"?: string,"target_type"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "audit_log_actor_id_fkey"
      columns: ["actor_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "audit_log_actor_id_fkey"
      columns: ["actor_id"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"blocks": {
                  Row: {
                    "blocked_id": string,"blocker_id": string,"created_at": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "blocked_id": string,"blocker_id": string,"created_at"?: string | null
                  }
                  Update: {
                    "blocked_id"?: string,"blocker_id"?: string,"created_at"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "blocks_blocked_id_fkey"
      columns: ["blocked_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "blocks_blocked_id_fkey"
      columns: ["blocked_id"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "blocks_blocker_id_fkey"
      columns: ["blocker_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "blocks_blocker_id_fkey"
      columns: ["blocker_id"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"brands": {
                  Row: {
                    "id": number,"is_active": boolean | null,"logo_url": string | null,"name": string,"parent_brand_id": number | null,"slug": string,"sort_order": number | null
                  }
                  ComputedFields: never
                  Insert: {
                    "id"?: number,"is_active"?: boolean | null,"logo_url"?: string | null,"name": string,"parent_brand_id"?: number | null,"slug": string,"sort_order"?: number | null
                  }
                  Update: {
                    "id"?: number,"is_active"?: boolean | null,"logo_url"?: string | null,"name"?: string,"parent_brand_id"?: number | null,"slug"?: string,"sort_order"?: number | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "brands_parent_brand_id_fkey"
      columns: ["parent_brand_id"]
isOneToOne: false
      referencedRelation: "brands"
      referencedColumns: ["id"]
    }
                  ]
                },"campaign_banners": {
                  Row: {
                    "approved_at": string | null,"created_at": string,"created_by": string | null,"cta_en": string,"cta_ur": string,"cta_url": string,"description_en": string,"description_ur": string,"desktop_image_url": string | null,"ends_at": string,"id": string,"is_active": boolean,"mobile_image_url": string | null,"placement": string,"priority": number,"starts_at": string,"status": string,"subtitle_en": string,"subtitle_ur": string,"theme": string,"title_en": string,"title_ur": string,"updated_at": string,"updated_by": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "approved_at"?: string | null,"created_at"?: string,"created_by"?: string | null,"cta_en": string,"cta_ur": string,"cta_url": string,"description_en"?: string,"description_ur"?: string,"desktop_image_url"?: string | null,"ends_at": string,"id"?: string,"is_active"?: boolean,"mobile_image_url"?: string | null,"placement": string,"priority"?: number,"starts_at": string,"status"?: string,"subtitle_en"?: string,"subtitle_ur"?: string,"theme"?: string,"title_en": string,"title_ur": string,"updated_at"?: string,"updated_by"?: string | null
                  }
                  Update: {
                    "approved_at"?: string | null,"created_at"?: string,"created_by"?: string | null,"cta_en"?: string,"cta_ur"?: string,"cta_url"?: string,"description_en"?: string,"description_ur"?: string,"desktop_image_url"?: string | null,"ends_at"?: string,"id"?: string,"is_active"?: boolean,"mobile_image_url"?: string | null,"placement"?: string,"priority"?: number,"starts_at"?: string,"status"?: string,"subtitle_en"?: string,"subtitle_ur"?: string,"theme"?: string,"title_en"?: string,"title_ur"?: string,"updated_at"?: string,"updated_by"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "campaign_banners_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "campaign_banners_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "campaign_banners_updated_by_fkey"
      columns: ["updated_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "campaign_banners_updated_by_fkey"
      columns: ["updated_by"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"campaign_media": {
                  Row: {
                    "bytes": number,"created_at": string,"created_by": string,"height": number,"id": string,"storage_path": string,"width": number
                  }
                  ComputedFields: never
                  Insert: {
                    "bytes": number,"created_at"?: string,"created_by"?: string,"height": number,"id"?: string,"storage_path": string,"width": number
                  }
                  Update: {
                    "bytes"?: number,"created_at"?: string,"created_by"?: string,"height"?: number,"id"?: string,"storage_path"?: string,"width"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "campaign_media_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "campaign_media_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"cities": {
                  Row: {
                    "id": number,"is_major": boolean | null,"name_en": string,"name_ur": string,"province": string,"slug": string,"sort_order": number | null
                  }
                  ComputedFields: never
                  Insert: {
                    "id"?: number,"is_major"?: boolean | null,"name_en": string,"name_ur": string,"province": string,"slug": string,"sort_order"?: number | null
                  }
                  Update: {
                    "id"?: number,"is_major"?: boolean | null,"name_en"?: string,"name_ur"?: string,"province"?: string,"slug"?: string,"sort_order"?: number | null
                  }
                  Relationships: [
                    
                  ]
                },"contact_reveals": {
                  Row: {
                    "channel": string,"created_at": string | null,"id": number,"listing_id": string,"viewer_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "channel": string,"created_at"?: string | null,"id"?: number,"listing_id": string,"viewer_id": string
                  }
                  Update: {
                    "channel"?: string,"created_at"?: string | null,"id"?: number,"listing_id"?: string,"viewer_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "contact_reveals_listing_id_fkey"
      columns: ["listing_id"]
isOneToOne: false
      referencedRelation: "listings"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "contact_reveals_viewer_id_fkey"
      columns: ["viewer_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "contact_reveals_viewer_id_fkey"
      columns: ["viewer_id"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"content_blocks": {
                  Row: {
                    "body_en": string,"body_ur": string | null,"key": string,"updated_at": string | null,"updated_by": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "body_en": string,"body_ur"?: string | null,"key": string,"updated_at"?: string | null,"updated_by"?: string | null
                  }
                  Update: {
                    "body_en"?: string,"body_ur"?: string | null,"key"?: string,"updated_at"?: string | null,"updated_by"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "content_blocks_updated_by_fkey"
      columns: ["updated_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "content_blocks_updated_by_fkey"
      columns: ["updated_by"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"conversations": {
                  Row: {
                    "buyer_id": string,"buyer_unread": number | null,"created_at": string | null,"id": string,"is_archived_buyer": boolean | null,"is_archived_seller": boolean | null,"last_message_at": string | null,"last_message_preview": string | null,"listing_id": string,"seller_id": string,"seller_unread": number | null
                  }
                  ComputedFields: never
                  Insert: {
                    "buyer_id": string,"buyer_unread"?: number | null,"created_at"?: string | null,"id"?: string,"is_archived_buyer"?: boolean | null,"is_archived_seller"?: boolean | null,"last_message_at"?: string | null,"last_message_preview"?: string | null,"listing_id": string,"seller_id": string,"seller_unread"?: number | null
                  }
                  Update: {
                    "buyer_id"?: string,"buyer_unread"?: number | null,"created_at"?: string | null,"id"?: string,"is_archived_buyer"?: boolean | null,"is_archived_seller"?: boolean | null,"last_message_at"?: string | null,"last_message_preview"?: string | null,"listing_id"?: string,"seller_id"?: string,"seller_unread"?: number | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "conversations_buyer_id_fkey"
      columns: ["buyer_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "conversations_buyer_id_fkey"
      columns: ["buyer_id"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "conversations_listing_id_fkey"
      columns: ["listing_id"]
isOneToOne: false
      referencedRelation: "listings"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "conversations_seller_id_fkey"
      columns: ["seller_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "conversations_seller_id_fkey"
      columns: ["seller_id"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"favorites": {
                  Row: {
                    "created_at": string | null,"listing_id": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string | null,"listing_id": string,"user_id": string
                  }
                  Update: {
                    "created_at"?: string | null,"listing_id"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "favorites_listing_id_fkey"
      columns: ["listing_id"]
isOneToOne: false
      referencedRelation: "listings"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "favorites_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "favorites_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"listing_images": {
                  Row: {
                    "created_at": string | null,"height": number | null,"id": string,"listing_id": string,"phash": string | null,"sort_order": number,"storage_path": string,"width": number | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string | null,"height"?: number | null,"id"?: string,"listing_id": string,"phash"?: string | null,"sort_order"?: number,"storage_path": string,"width"?: number | null
                  }
                  Update: {
                    "created_at"?: string | null,"height"?: number | null,"id"?: string,"listing_id"?: string,"phash"?: string | null,"sort_order"?: number,"storage_path"?: string,"width"?: number | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "listing_images_listing_id_fkey"
      columns: ["listing_id"]
isOneToOne: false
      referencedRelation: "listings"
      referencedColumns: ["id"]
    }
                  ]
                },"listing_private": {
                  Row: {
                    "created_at": string | null,"imei1_enc": string,"imei1_hash": string,"imei2_enc": string | null,"imei2_hash": string | null,"listing_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string | null,"imei1_enc": string,"imei1_hash": string,"imei2_enc"?: string | null,"imei2_hash"?: string | null,"listing_id": string
                  }
                  Update: {
                    "created_at"?: string | null,"imei1_enc"?: string,"imei1_hash"?: string,"imei2_enc"?: string | null,"imei2_hash"?: string | null,"listing_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "listing_private_listing_id_fkey"
      columns: ["listing_id"]
isOneToOne: true
      referencedRelation: "listings"
      referencedColumns: ["id"]
    }
                  ]
                },"listings": {
                  Row: {
                    "accessories": (string)[] | null,"area_id": number | null,"battery_health": number | null,"body_condition": Database["public"]['Enums']["body_condition"] | null,"box_status": Database["public"]['Enums']["box_status"] | null,"brand_id": number | null,"bumped_at": string | null,"buyer_id": string | null,"city_id": number | null,"color_id": number | null,"completion_score": number | null,"condition": Database["public"]['Enums']["phone_condition"],"contact_call": boolean | null,"contact_chat": boolean | null,"contact_count": number | null,"contact_whatsapp": boolean | null,"cover_image_path": string | null,"created_at": string | null,"custom_brand": string | null,"custom_model": string | null,"daam_band": Database["public"]['Enums']["daam_band"] | null,"daam_computed_at": string | null,"daam_median_pkr": number | null,"daam_p25_pkr": number | null,"daam_p75_pkr": number | null,"description": string | null,"expires_at": string | null,"favorite_count": number | null,"featured_until": string | null,"functional_issues": (string)[] | null,"hold_reasons": (string)[] | null,"id": string,"image_count": number | null,"imei_last4": string | null,"is_featured": boolean | null,"is_negotiable": boolean | null,"model_id": number | null,"moderation_note": string | null,"network_lock": Database["public"]['Enums']["network_lock"],"price_pkr": number,"pta_check_source": Database["public"]['Enums']["pta_check_source"],"pta_checked_at": string | null,"pta_checked_by": string | null,"pta_reg_type": Database["public"]['Enums']["pta_reg_type"] | null,"pta_status": Database["public"]['Enums']["pta_status"],"published_at": string | null,"purchase_month": string | null,"repair_history": (string)[] | null,"screen_condition": Database["public"]['Enums']["screen_condition"] | null,"search_vector": unknown,"seller_id": string,"shop_id": string | null,"short_id": string,"slug": string,"sold_at": string | null,"sold_via": Database["public"]['Enums']["sold_via"] | null,"status": Database["public"]['Enums']["listing_status"],"title": string,"updated_at": string | null,"variant_id": number | null,"view_count": number | null,"warranty_months_left": number | null,"warranty_type": Database["public"]['Enums']["warranty_type"] | null
                  }
                  ComputedFields: never
                  Insert: {
                    "accessories"?: (string)[] | null,"area_id"?: number | null,"battery_health"?: number | null,"body_condition"?: Database["public"]['Enums']["body_condition"] | null,"box_status"?: Database["public"]['Enums']["box_status"] | null,"brand_id"?: number | null,"bumped_at"?: string | null,"buyer_id"?: string | null,"city_id"?: number | null,"color_id"?: number | null,"completion_score"?: number | null,"condition": Database["public"]['Enums']["phone_condition"],"contact_call"?: boolean | null,"contact_chat"?: boolean | null,"contact_count"?: number | null,"contact_whatsapp"?: boolean | null,"cover_image_path"?: string | null,"created_at"?: string | null,"custom_brand"?: string | null,"custom_model"?: string | null,"daam_band"?: Database["public"]['Enums']["daam_band"] | null,"daam_computed_at"?: string | null,"daam_median_pkr"?: number | null,"daam_p25_pkr"?: number | null,"daam_p75_pkr"?: number | null,"description"?: string | null,"expires_at"?: string | null,"favorite_count"?: number | null,"featured_until"?: string | null,"functional_issues"?: (string)[] | null,"hold_reasons"?: (string)[] | null,"id"?: string,"image_count"?: number | null,"imei_last4"?: string | null,"is_featured"?: boolean | null,"is_negotiable"?: boolean | null,"model_id"?: number | null,"moderation_note"?: string | null,"network_lock"?: Database["public"]['Enums']["network_lock"],"price_pkr": number,"pta_check_source"?: Database["public"]['Enums']["pta_check_source"],"pta_checked_at"?: string | null,"pta_checked_by"?: string | null,"pta_reg_type"?: Database["public"]['Enums']["pta_reg_type"] | null,"pta_status"?: Database["public"]['Enums']["pta_status"],"published_at"?: string | null,"purchase_month"?: string | null,"repair_history"?: (string)[] | null,"screen_condition"?: Database["public"]['Enums']["screen_condition"] | null,"search_vector"?: unknown,"seller_id": string,"shop_id"?: string | null,"short_id": string,"slug": string,"sold_at"?: string | null,"sold_via"?: Database["public"]['Enums']["sold_via"] | null,"status"?: Database["public"]['Enums']["listing_status"],"title": string,"updated_at"?: string | null,"variant_id"?: number | null,"view_count"?: number | null,"warranty_months_left"?: number | null,"warranty_type"?: Database["public"]['Enums']["warranty_type"] | null
                  }
                  Update: {
                    "accessories"?: (string)[] | null,"area_id"?: number | null,"battery_health"?: number | null,"body_condition"?: Database["public"]['Enums']["body_condition"] | null,"box_status"?: Database["public"]['Enums']["box_status"] | null,"brand_id"?: number | null,"bumped_at"?: string | null,"buyer_id"?: string | null,"city_id"?: number | null,"color_id"?: number | null,"completion_score"?: number | null,"condition"?: Database["public"]['Enums']["phone_condition"],"contact_call"?: boolean | null,"contact_chat"?: boolean | null,"contact_count"?: number | null,"contact_whatsapp"?: boolean | null,"cover_image_path"?: string | null,"created_at"?: string | null,"custom_brand"?: string | null,"custom_model"?: string | null,"daam_band"?: Database["public"]['Enums']["daam_band"] | null,"daam_computed_at"?: string | null,"daam_median_pkr"?: number | null,"daam_p25_pkr"?: number | null,"daam_p75_pkr"?: number | null,"description"?: string | null,"expires_at"?: string | null,"favorite_count"?: number | null,"featured_until"?: string | null,"functional_issues"?: (string)[] | null,"hold_reasons"?: (string)[] | null,"id"?: string,"image_count"?: number | null,"imei_last4"?: string | null,"is_featured"?: boolean | null,"is_negotiable"?: boolean | null,"model_id"?: number | null,"moderation_note"?: string | null,"network_lock"?: Database["public"]['Enums']["network_lock"],"price_pkr"?: number,"pta_check_source"?: Database["public"]['Enums']["pta_check_source"],"pta_checked_at"?: string | null,"pta_checked_by"?: string | null,"pta_reg_type"?: Database["public"]['Enums']["pta_reg_type"] | null,"pta_status"?: Database["public"]['Enums']["pta_status"],"published_at"?: string | null,"purchase_month"?: string | null,"repair_history"?: (string)[] | null,"screen_condition"?: Database["public"]['Enums']["screen_condition"] | null,"search_vector"?: unknown,"seller_id"?: string,"shop_id"?: string | null,"short_id"?: string,"slug"?: string,"sold_at"?: string | null,"sold_via"?: Database["public"]['Enums']["sold_via"] | null,"status"?: Database["public"]['Enums']["listing_status"],"title"?: string,"updated_at"?: string | null,"variant_id"?: number | null,"view_count"?: number | null,"warranty_months_left"?: number | null,"warranty_type"?: Database["public"]['Enums']["warranty_type"] | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "listings_area_id_fkey"
      columns: ["area_id"]
isOneToOne: false
      referencedRelation: "areas"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "listings_brand_id_fkey"
      columns: ["brand_id"]
isOneToOne: false
      referencedRelation: "brands"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "listings_buyer_id_fkey"
      columns: ["buyer_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "listings_buyer_id_fkey"
      columns: ["buyer_id"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "listings_city_id_fkey"
      columns: ["city_id"]
isOneToOne: false
      referencedRelation: "cities"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "listings_color_id_fkey"
      columns: ["color_id"]
isOneToOne: false
      referencedRelation: "model_colors"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "listings_model_id_fkey"
      columns: ["model_id"]
isOneToOne: false
      referencedRelation: "models"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "listings_pta_checked_by_fkey"
      columns: ["pta_checked_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "listings_pta_checked_by_fkey"
      columns: ["pta_checked_by"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "listings_seller_id_fkey"
      columns: ["seller_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "listings_seller_id_fkey"
      columns: ["seller_id"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "listings_shop_id_fkey"
      columns: ["shop_id"]
isOneToOne: false
      referencedRelation: "public_shops"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "listings_shop_id_fkey"
      columns: ["shop_id"]
isOneToOne: false
      referencedRelation: "shops"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "listings_variant_id_fkey"
      columns: ["variant_id"]
isOneToOne: false
      referencedRelation: "model_variants"
      referencedColumns: ["id"]
    }
                  ]
                },"messages": {
                  Row: {
                    "attachment_path": string | null,"body": string | null,"conversation_id": string,"created_at": string | null,"flag_reasons": (string)[] | null,"flagged": boolean | null,"id": string,"kind": Database["public"]['Enums']["message_kind"],"offer_pkr": number | null,"read_at": string | null,"sender_id": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "attachment_path"?: string | null,"body"?: string | null,"conversation_id": string,"created_at"?: string | null,"flag_reasons"?: (string)[] | null,"flagged"?: boolean | null,"id"?: string,"kind"?: Database["public"]['Enums']["message_kind"],"offer_pkr"?: number | null,"read_at"?: string | null,"sender_id"?: string | null
                  }
                  Update: {
                    "attachment_path"?: string | null,"body"?: string | null,"conversation_id"?: string,"created_at"?: string | null,"flag_reasons"?: (string)[] | null,"flagged"?: boolean | null,"id"?: string,"kind"?: Database["public"]['Enums']["message_kind"],"offer_pkr"?: number | null,"read_at"?: string | null,"sender_id"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "messages_conversation_id_fkey"
      columns: ["conversation_id"]
isOneToOne: false
      referencedRelation: "conversations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "messages_sender_id_fkey"
      columns: ["sender_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "messages_sender_id_fkey"
      columns: ["sender_id"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"model_aliases": {
                  Row: {
                    "alias": string,"id": number,"model_id": number
                  }
                  ComputedFields: never
                  Insert: {
                    "alias": string,"id"?: number,"model_id": number
                  }
                  Update: {
                    "alias"?: string,"id"?: number,"model_id"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "model_aliases_model_id_fkey"
      columns: ["model_id"]
isOneToOne: false
      referencedRelation: "models"
      referencedColumns: ["id"]
    }
                  ]
                },"model_colors": {
                  Row: {
                    "hex": string | null,"id": number,"model_id": number,"name": string
                  }
                  ComputedFields: never
                  Insert: {
                    "hex"?: string | null,"id"?: number,"model_id": number,"name": string
                  }
                  Update: {
                    "hex"?: string | null,"id"?: number,"model_id"?: number,"name"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "model_colors_model_id_fkey"
      columns: ["model_id"]
isOneToOne: false
      referencedRelation: "models"
      referencedColumns: ["id"]
    }
                  ]
                },"model_variants": {
                  Row: {
                    "id": number,"is_active": boolean | null,"model_id": number,"ram_gb": number | null,"storage_gb": number
                  }
                  ComputedFields: never
                  Insert: {
                    "id"?: number,"is_active"?: boolean | null,"model_id": number,"ram_gb"?: number | null,"storage_gb": number
                  }
                  Update: {
                    "id"?: number,"is_active"?: boolean | null,"model_id"?: number,"ram_gb"?: number | null,"storage_gb"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "model_variants_model_id_fkey"
      columns: ["model_id"]
isOneToOne: false
      referencedRelation: "models"
      referencedColumns: ["id"]
    }
                  ]
                },"models": {
                  Row: {
                    "brand_id": number,"id": number,"image_url": string | null,"is_active": boolean | null,"name": string,"popularity": number | null,"release_year": number | null,"series_id": number | null,"slug": string,"specs": Json | null,"supports_battery_health": boolean | null
                  }
                  ComputedFields: never
                  Insert: {
                    "brand_id": number,"id"?: number,"image_url"?: string | null,"is_active"?: boolean | null,"name": string,"popularity"?: number | null,"release_year"?: number | null,"series_id"?: number | null,"slug": string,"specs"?: Json | null,"supports_battery_health"?: boolean | null
                  }
                  Update: {
                    "brand_id"?: number,"id"?: number,"image_url"?: string | null,"is_active"?: boolean | null,"name"?: string,"popularity"?: number | null,"release_year"?: number | null,"series_id"?: number | null,"slug"?: string,"specs"?: Json | null,"supports_battery_health"?: boolean | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "models_brand_id_fkey"
      columns: ["brand_id"]
isOneToOne: false
      referencedRelation: "brands"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "models_series_id_fkey"
      columns: ["series_id"]
isOneToOne: false
      referencedRelation: "series"
      referencedColumns: ["id"]
    }
                  ]
                },"notifications": {
                  Row: {
                    "body": string | null,"created_at": string | null,"data": Json | null,"id": string,"link": string | null,"read_at": string | null,"title": string,"type": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "body"?: string | null,"created_at"?: string | null,"data"?: Json | null,"id"?: string,"link"?: string | null,"read_at"?: string | null,"title": string,"type": string,"user_id": string
                  }
                  Update: {
                    "body"?: string | null,"created_at"?: string | null,"data"?: Json | null,"id"?: string,"link"?: string | null,"read_at"?: string | null,"title"?: string,"type"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "notifications_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "notifications_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"payments": {
                  Row: {
                    "amount_pkr": number,"created_at": string | null,"id": string,"method": Database["public"]['Enums']["payment_method"],"proof_path": string | null,"purpose": Database["public"]['Enums']["payment_purpose"],"reference": string | null,"reviewed_at": string | null,"reviewed_by": string | null,"status": Database["public"]['Enums']["payment_status"],"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "amount_pkr": number,"created_at"?: string | null,"id"?: string,"method": Database["public"]['Enums']["payment_method"],"proof_path"?: string | null,"purpose": Database["public"]['Enums']["payment_purpose"],"reference"?: string | null,"reviewed_at"?: string | null,"reviewed_by"?: string | null,"status"?: Database["public"]['Enums']["payment_status"],"user_id": string
                  }
                  Update: {
                    "amount_pkr"?: number,"created_at"?: string | null,"id"?: string,"method"?: Database["public"]['Enums']["payment_method"],"proof_path"?: string | null,"purpose"?: Database["public"]['Enums']["payment_purpose"],"reference"?: string | null,"reviewed_at"?: string | null,"reviewed_by"?: string | null,"status"?: Database["public"]['Enums']["payment_status"],"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "payments_reviewed_by_fkey"
      columns: ["reviewed_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "payments_reviewed_by_fkey"
      columns: ["reviewed_by"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "payments_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "payments_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"price_references": {
                  Row: {
                    "condition_band": string,"high_pkr": number,"id": number,"low_pkr": number,"pta_group": string,"source_note": string | null,"typical_pkr": number,"updated_at": string | null,"updated_by": string | null,"variant_id": number
                  }
                  ComputedFields: never
                  Insert: {
                    "condition_band": string,"high_pkr": number,"id"?: number,"low_pkr": number,"pta_group": string,"source_note"?: string | null,"typical_pkr": number,"updated_at"?: string | null,"updated_by"?: string | null,"variant_id": number
                  }
                  Update: {
                    "condition_band"?: string,"high_pkr"?: number,"id"?: number,"low_pkr"?: number,"pta_group"?: string,"source_note"?: string | null,"typical_pkr"?: number,"updated_at"?: string | null,"updated_by"?: string | null,"variant_id"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "price_references_updated_by_fkey"
      columns: ["updated_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "price_references_updated_by_fkey"
      columns: ["updated_by"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "price_references_variant_id_fkey"
      columns: ["variant_id"]
isOneToOne: false
      referencedRelation: "model_variants"
      referencedColumns: ["id"]
    }
                  ]
                },"profiles": {
                  Row: {
                    "account_type": Database["public"]['Enums']["account_type"],"area_id": number | null,"avatar_url": string | null,"bio": string | null,"city_id": number | null,"cnic_last4": string | null,"created_at": string | null,"display_name": string,"id": string,"id_verified_at": string | null,"is_suspended": boolean | null,"last_seen_at": string | null,"locale": string | null,"phone_e164": string,"phone_verified_at": string | null,"rating_avg": number | null,"rating_count": number | null,"role": Database["public"]['Enums']["user_role"],"strikes": number | null,"suspended_reason": string | null,"updated_at": string | null,"username": string | null,"whatsapp_enabled": boolean | null
                  }
                  ComputedFields: never
                  Insert: {
                    "account_type"?: Database["public"]['Enums']["account_type"],"area_id"?: number | null,"avatar_url"?: string | null,"bio"?: string | null,"city_id"?: number | null,"cnic_last4"?: string | null,"created_at"?: string | null,"display_name": string,"id": string,"id_verified_at"?: string | null,"is_suspended"?: boolean | null,"last_seen_at"?: string | null,"locale"?: string | null,"phone_e164": string,"phone_verified_at"?: string | null,"rating_avg"?: number | null,"rating_count"?: number | null,"role"?: Database["public"]['Enums']["user_role"],"strikes"?: number | null,"suspended_reason"?: string | null,"updated_at"?: string | null,"username"?: string | null,"whatsapp_enabled"?: boolean | null
                  }
                  Update: {
                    "account_type"?: Database["public"]['Enums']["account_type"],"area_id"?: number | null,"avatar_url"?: string | null,"bio"?: string | null,"city_id"?: number | null,"cnic_last4"?: string | null,"created_at"?: string | null,"display_name"?: string,"id"?: string,"id_verified_at"?: string | null,"is_suspended"?: boolean | null,"last_seen_at"?: string | null,"locale"?: string | null,"phone_e164"?: string,"phone_verified_at"?: string | null,"rating_avg"?: number | null,"rating_count"?: number | null,"role"?: Database["public"]['Enums']["user_role"],"strikes"?: number | null,"suspended_reason"?: string | null,"updated_at"?: string | null,"username"?: string | null,"whatsapp_enabled"?: boolean | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "profiles_area_id_fkey"
      columns: ["area_id"]
isOneToOne: false
      referencedRelation: "areas"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "profiles_city_id_fkey"
      columns: ["city_id"]
isOneToOne: false
      referencedRelation: "cities"
      referencedColumns: ["id"]
    }
                  ]
                },"promotions": {
                  Row: {
                    "created_at": string | null,"created_by": string | null,"ends_at": string,"id": string,"listing_id": string,"payment_id": string | null,"starts_at": string,"type": Database["public"]['Enums']["promo_type"]
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string | null,"created_by"?: string | null,"ends_at": string,"id"?: string,"listing_id": string,"payment_id"?: string | null,"starts_at": string,"type": Database["public"]['Enums']["promo_type"]
                  }
                  Update: {
                    "created_at"?: string | null,"created_by"?: string | null,"ends_at"?: string,"id"?: string,"listing_id"?: string,"payment_id"?: string | null,"starts_at"?: string,"type"?: Database["public"]['Enums']["promo_type"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "promotions_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "promotions_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "promotions_listing_id_fkey"
      columns: ["listing_id"]
isOneToOne: false
      referencedRelation: "listings"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "promotions_payment_id_fkey"
      columns: ["payment_id"]
isOneToOne: false
      referencedRelation: "payments"
      referencedColumns: ["id"]
    }
                  ]
                },"reports": {
                  Row: {
                    "created_at": string | null,"details": string | null,"handled_at": string | null,"handled_by": string | null,"id": string,"listing_id": string | null,"message_id": string | null,"reason": Database["public"]['Enums']["report_reason"],"reporter_id": string,"resolution_note": string | null,"status": Database["public"]['Enums']["report_status"],"target_type": Database["public"]['Enums']["report_target"],"user_id": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string | null,"details"?: string | null,"handled_at"?: string | null,"handled_by"?: string | null,"id"?: string,"listing_id"?: string | null,"message_id"?: string | null,"reason": Database["public"]['Enums']["report_reason"],"reporter_id": string,"resolution_note"?: string | null,"status"?: Database["public"]['Enums']["report_status"],"target_type": Database["public"]['Enums']["report_target"],"user_id"?: string | null
                  }
                  Update: {
                    "created_at"?: string | null,"details"?: string | null,"handled_at"?: string | null,"handled_by"?: string | null,"id"?: string,"listing_id"?: string | null,"message_id"?: string | null,"reason"?: Database["public"]['Enums']["report_reason"],"reporter_id"?: string,"resolution_note"?: string | null,"status"?: Database["public"]['Enums']["report_status"],"target_type"?: Database["public"]['Enums']["report_target"],"user_id"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "reports_handled_by_fkey"
      columns: ["handled_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reports_handled_by_fkey"
      columns: ["handled_by"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reports_listing_id_fkey"
      columns: ["listing_id"]
isOneToOne: false
      referencedRelation: "listings"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reports_message_id_fkey"
      columns: ["message_id"]
isOneToOne: false
      referencedRelation: "messages"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reports_reporter_id_fkey"
      columns: ["reporter_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reports_reporter_id_fkey"
      columns: ["reporter_id"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reports_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reports_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"reviews": {
                  Row: {
                    "comment": string | null,"created_at": string | null,"direction": string,"id": string,"is_hidden": boolean | null,"listing_id": string,"rating": number,"reviewee_id": string,"reviewer_id": string,"tags": (string)[] | null
                  }
                  ComputedFields: never
                  Insert: {
                    "comment"?: string | null,"created_at"?: string | null,"direction": string,"id"?: string,"is_hidden"?: boolean | null,"listing_id": string,"rating": number,"reviewee_id": string,"reviewer_id": string,"tags"?: (string)[] | null
                  }
                  Update: {
                    "comment"?: string | null,"created_at"?: string | null,"direction"?: string,"id"?: string,"is_hidden"?: boolean | null,"listing_id"?: string,"rating"?: number,"reviewee_id"?: string,"reviewer_id"?: string,"tags"?: (string)[] | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "reviews_listing_id_fkey"
      columns: ["listing_id"]
isOneToOne: false
      referencedRelation: "listings"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reviews_reviewee_id_fkey"
      columns: ["reviewee_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reviews_reviewee_id_fkey"
      columns: ["reviewee_id"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reviews_reviewer_id_fkey"
      columns: ["reviewer_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reviews_reviewer_id_fkey"
      columns: ["reviewer_id"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"saved_searches": {
                  Row: {
                    "created_at": string | null,"id": string,"notify": boolean | null,"query": NonNullable<Json>,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string | null,"id"?: string,"notify"?: boolean | null,"query": NonNullable<Json>,"user_id": string
                  }
                  Update: {
                    "created_at"?: string | null,"id"?: string,"notify"?: boolean | null,"query"?: NonNullable<Json>,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "saved_searches_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "saved_searches_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"series": {
                  Row: {
                    "brand_id": number,"id": number,"name": string,"slug": string
                  }
                  ComputedFields: never
                  Insert: {
                    "brand_id": number,"id"?: number,"name": string,"slug": string
                  }
                  Update: {
                    "brand_id"?: number,"id"?: number,"name"?: string,"slug"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "series_brand_id_fkey"
      columns: ["brand_id"]
isOneToOne: false
      referencedRelation: "brands"
      referencedColumns: ["id"]
    }
                  ]
                },"shops": {
                  Row: {
                    "address": string,"area_id": number | null,"city_id": number,"cover_url": string | null,"created_at": string | null,"description": string | null,"id": string,"is_founding_shop": boolean | null,"lat": number | null,"lng": number | null,"logo_url": string | null,"maps_url": string | null,"market_name": string | null,"name": string,"opening_hours": Json | null,"owner_id": string,"phone_e164": string | null,"plan": Database["public"]['Enums']["shop_plan"],"plan_expires_at": string | null,"slug": string,"tier": Database["public"]['Enums']["shop_tier"],"updated_at": string | null,"verified_at": string | null,"whatsapp_e164": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "address": string,"area_id"?: number | null,"city_id": number,"cover_url"?: string | null,"created_at"?: string | null,"description"?: string | null,"id"?: string,"is_founding_shop"?: boolean | null,"lat"?: number | null,"lng"?: number | null,"logo_url"?: string | null,"maps_url"?: string | null,"market_name"?: string | null,"name": string,"opening_hours"?: Json | null,"owner_id": string,"phone_e164"?: string | null,"plan"?: Database["public"]['Enums']["shop_plan"],"plan_expires_at"?: string | null,"slug": string,"tier"?: Database["public"]['Enums']["shop_tier"],"updated_at"?: string | null,"verified_at"?: string | null,"whatsapp_e164"?: string | null
                  }
                  Update: {
                    "address"?: string,"area_id"?: number | null,"city_id"?: number,"cover_url"?: string | null,"created_at"?: string | null,"description"?: string | null,"id"?: string,"is_founding_shop"?: boolean | null,"lat"?: number | null,"lng"?: number | null,"logo_url"?: string | null,"maps_url"?: string | null,"market_name"?: string | null,"name"?: string,"opening_hours"?: Json | null,"owner_id"?: string,"phone_e164"?: string | null,"plan"?: Database["public"]['Enums']["shop_plan"],"plan_expires_at"?: string | null,"slug"?: string,"tier"?: Database["public"]['Enums']["shop_tier"],"updated_at"?: string | null,"verified_at"?: string | null,"whatsapp_e164"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "shops_area_id_fkey"
      columns: ["area_id"]
isOneToOne: false
      referencedRelation: "areas"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "shops_city_id_fkey"
      columns: ["city_id"]
isOneToOne: false
      referencedRelation: "cities"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "shops_owner_id_fkey"
      columns: ["owner_id"]
isOneToOne: true
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "shops_owner_id_fkey"
      columns: ["owner_id"]
isOneToOne: true
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"stolen_device_reports": {
                  Row: {
                    "brand_id": number | null,"created_at": string | null,"details": string | null,"id": string,"imei_hash": string,"imei_last4": string,"model_id": number | null,"police_report_ref": string | null,"reporter_id": string,"status": string
                  }
                  ComputedFields: never
                  Insert: {
                    "brand_id"?: number | null,"created_at"?: string | null,"details"?: string | null,"id"?: string,"imei_hash": string,"imei_last4": string,"model_id"?: number | null,"police_report_ref"?: string | null,"reporter_id": string,"status"?: string
                  }
                  Update: {
                    "brand_id"?: number | null,"created_at"?: string | null,"details"?: string | null,"id"?: string,"imei_hash"?: string,"imei_last4"?: string,"model_id"?: number | null,"police_report_ref"?: string | null,"reporter_id"?: string,"status"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "stolen_device_reports_brand_id_fkey"
      columns: ["brand_id"]
isOneToOne: false
      referencedRelation: "brands"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "stolen_device_reports_model_id_fkey"
      columns: ["model_id"]
isOneToOne: false
      referencedRelation: "models"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "stolen_device_reports_reporter_id_fkey"
      columns: ["reporter_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "stolen_device_reports_reporter_id_fkey"
      columns: ["reporter_id"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"verification_requests": {
                  Row: {
                    "cnic_last4": string | null,"created_at": string | null,"decision_note": string | null,"docs_purge_after": string | null,"documents": NonNullable<Json>,"id": string,"kind": Database["public"]['Enums']["verification_kind"],"reviewed_at": string | null,"reviewer_id": string | null,"shop_id": string | null,"status": Database["public"]['Enums']["verification_status"],"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "cnic_last4"?: string | null,"created_at"?: string | null,"decision_note"?: string | null,"docs_purge_after"?: string | null,"documents": NonNullable<Json>,"id"?: string,"kind": Database["public"]['Enums']["verification_kind"],"reviewed_at"?: string | null,"reviewer_id"?: string | null,"shop_id"?: string | null,"status"?: Database["public"]['Enums']["verification_status"],"user_id": string
                  }
                  Update: {
                    "cnic_last4"?: string | null,"created_at"?: string | null,"decision_note"?: string | null,"docs_purge_after"?: string | null,"documents"?: NonNullable<Json>,"id"?: string,"kind"?: Database["public"]['Enums']["verification_kind"],"reviewed_at"?: string | null,"reviewer_id"?: string | null,"shop_id"?: string | null,"status"?: Database["public"]['Enums']["verification_status"],"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "verification_requests_reviewer_id_fkey"
      columns: ["reviewer_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "verification_requests_reviewer_id_fkey"
      columns: ["reviewer_id"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "verification_requests_shop_id_fkey"
      columns: ["shop_id"]
isOneToOne: false
      referencedRelation: "public_shops"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "verification_requests_shop_id_fkey"
      columns: ["shop_id"]
isOneToOne: false
      referencedRelation: "shops"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "verification_requests_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "verification_requests_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            "public_profiles": {
                  Row: {
                    "account_type": Database["public"]['Enums']["account_type"],"area_id": number | null,"avatar_url": string | null,"bio": string | null,"city_id": number | null,"created_at": string | null,"display_name": string,"id": string,"id_verified_at": string | null,"rating_avg": number | null,"rating_count": number | null,"username": string | null
                  }
                  ComputedFields: never
                  Insert: {
                           "account_type"?: Database["public"]['Enums']["account_type"] | null,"area_id"?: number | null,"avatar_url"?: string | null,"bio"?: string | null,"city_id"?: number | null,"created_at"?: string | null,"display_name"?: string | null,"id"?: string | null,"id_verified_at"?: string | null,"rating_avg"?: number | null,"rating_count"?: number | null,"username"?: string | null
                         }
                        Update: {
                           "account_type"?: Database["public"]['Enums']["account_type"] | null,"area_id"?: number | null,"avatar_url"?: string | null,"bio"?: string | null,"city_id"?: number | null,"created_at"?: string | null,"display_name"?: string | null,"id"?: string | null,"id_verified_at"?: string | null,"rating_avg"?: number | null,"rating_count"?: number | null,"username"?: string | null
                         }
                        Relationships: [
                    {
      foreignKeyName: "profiles_area_id_fkey"
      columns: ["area_id"]
isOneToOne: false
      referencedRelation: "areas"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "profiles_city_id_fkey"
      columns: ["city_id"]
isOneToOne: false
      referencedRelation: "cities"
      referencedColumns: ["id"]
    }
                  ]
                },"public_shops": {
                  Row: {
                    "address": string,"area_id": number | null,"city_id": number,"cover_url": string | null,"created_at": string | null,"description": string | null,"id": string,"is_founding_shop": boolean | null,"lat": number | null,"lng": number | null,"logo_url": string | null,"maps_url": string | null,"market_name": string | null,"name": string,"opening_hours": Json | null,"owner_id": string,"plan": Database["public"]['Enums']["shop_plan"],"slug": string,"tier": Database["public"]['Enums']["shop_tier"],"updated_at": string | null,"verified_at": string | null
                  }
                  ComputedFields: never
                  Insert: {
                           "address"?: string | null,"area_id"?: number | null,"city_id"?: number | null,"cover_url"?: string | null,"created_at"?: string | null,"description"?: string | null,"id"?: string | null,"is_founding_shop"?: boolean | null,"lat"?: number | null,"lng"?: number | null,"logo_url"?: string | null,"maps_url"?: string | null,"market_name"?: string | null,"name"?: string | null,"opening_hours"?: Json | null,"owner_id"?: string | null,"plan"?: Database["public"]['Enums']["shop_plan"] | null,"slug"?: string | null,"tier"?: Database["public"]['Enums']["shop_tier"] | null,"updated_at"?: string | null,"verified_at"?: string | null
                         }
                        Update: {
                           "address"?: string | null,"area_id"?: number | null,"city_id"?: number | null,"cover_url"?: string | null,"created_at"?: string | null,"description"?: string | null,"id"?: string | null,"is_founding_shop"?: boolean | null,"lat"?: number | null,"lng"?: number | null,"logo_url"?: string | null,"maps_url"?: string | null,"market_name"?: string | null,"name"?: string | null,"opening_hours"?: Json | null,"owner_id"?: string | null,"plan"?: Database["public"]['Enums']["shop_plan"] | null,"slug"?: string | null,"tier"?: Database["public"]['Enums']["shop_tier"] | null,"updated_at"?: string | null,"verified_at"?: string | null
                         }
                        Relationships: [
                    {
      foreignKeyName: "shops_area_id_fkey"
      columns: ["area_id"]
isOneToOne: false
      referencedRelation: "areas"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "shops_city_id_fkey"
      columns: ["city_id"]
isOneToOne: false
      referencedRelation: "cities"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "shops_owner_id_fkey"
      columns: ["owner_id"]
isOneToOne: true
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "shops_owner_id_fkey"
      columns: ["owner_id"]
isOneToOne: true
      referencedRelation: "public_profiles"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Functions: {
            "campaign_media_is_public":
{ Args: { "p_path": string }; Returns: boolean
                           },
"can_access_chat_path":
{ Args: { "p_path": string }; Returns: boolean
                           },
"can_access_conversation":
{ Args: { "p_conversation_id": string }; Returns: boolean
                           },
"can_mutate_listing_image":
{ Args: { "p_path": string }; Returns: boolean
                           },
"can_open_conversation":
{ Args: { "p_listing_id": string,"p_seller_id": string }; Returns: boolean
                           },
"check_listing_risk":
{ Args: { "p_listing_id": string }; Returns: undefined
                           },
"compute_daam_meter":
{ Args: { "p_listing_id": string }; Returns: undefined
                           },
"is_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"is_moderator":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"moderate_listing":
{ Args: { "p_listing_id": string,"p_note": string,"p_status": Database["public"]['Enums']["listing_status"] }; Returns: undefined
                           },
"moderate_report":
{ Args: { "p_note": string,"p_report_id": string,"p_status": Database["public"]['Enums']["report_status"] }; Returns: undefined
                           },
"moderation_listing":
{ Args: { "p_listing_id": string }; Returns: {
              "accessories": (string)[] | null,
"area_id": number | null,
"battery_health": number | null,
"body_condition": Database["public"]['Enums']["body_condition"] | null,
"box_status": Database["public"]['Enums']["box_status"] | null,
"brand_id": number | null,
"bumped_at": string | null,
"buyer_id": string | null,
"city_id": number | null,
"color_id": number | null,
"completion_score": number | null,
"condition": Database["public"]['Enums']["phone_condition"],
"contact_call": boolean | null,
"contact_chat": boolean | null,
"contact_count": number | null,
"contact_whatsapp": boolean | null,
"cover_image_path": string | null,
"created_at": string | null,
"custom_brand": string | null,
"custom_model": string | null,
"daam_band": Database["public"]['Enums']["daam_band"] | null,
"daam_computed_at": string | null,
"daam_median_pkr": number | null,
"daam_p25_pkr": number | null,
"daam_p75_pkr": number | null,
"description": string | null,
"expires_at": string | null,
"favorite_count": number | null,
"featured_until": string | null,
"functional_issues": (string)[] | null,
"hold_reasons": (string)[] | null,
"id": string,
"image_count": number | null,
"imei_last4": string | null,
"is_featured": boolean | null,
"is_negotiable": boolean | null,
"model_id": number | null,
"moderation_note": string | null,
"network_lock": Database["public"]['Enums']["network_lock"],
"price_pkr": number,
"pta_check_source": Database["public"]['Enums']["pta_check_source"],
"pta_checked_at": string | null,
"pta_checked_by": string | null,
"pta_reg_type": Database["public"]['Enums']["pta_reg_type"] | null,
"pta_status": Database["public"]['Enums']["pta_status"],
"published_at": string | null,
"purchase_month": string | null,
"repair_history": (string)[] | null,
"screen_condition": Database["public"]['Enums']["screen_condition"] | null,
"search_vector": unknown,
"seller_id": string,
"shop_id": string | null,
"short_id": string,
"slug": string,
"sold_at": string | null,
"sold_via": Database["public"]['Enums']["sold_via"] | null,
"status": Database["public"]['Enums']["listing_status"],
"title": string,
"updated_at": string | null,
"variant_id": number | null,
"view_count": number | null,
"warranty_months_left": number | null,
"warranty_type": Database["public"]['Enums']["warranty_type"] | null
            }[]
                          SetofOptions: {
        from: "*"
        to: "listings"
        isOneToOne: false
        isSetofReturn: true
      } },
"owns_verification_paths":
{ Args: { "p_documents": Json,"p_user": string }; Returns: boolean
                           },
"safe_campaign_url":
{ Args: { "value": string }; Returns: boolean
                           },
"show_limit":
{ Args: Record<PropertyKey, never>; Returns: number
                           },
"show_trgm":
{ Args: { "": string }; Returns: (string)[]
                           },
"submit_review":
{ Args: { "p_comment": string,"p_listing_id": string,"p_rating": number,"p_tags": (string)[] }; Returns: string
                           }
          }
          Enums: {
            "account_type": "individual"|"shop","body_condition": "flawless"|"minor_marks"|"visible_marks"|"dents_or_cracks","box_status": "box_matching_imei"|"box_not_matching"|"no_box","daam_band": "great"|"fair"|"high"|"unknown","listing_status": "draft"|"pending_review"|"active"|"on_hold"|"sold"|"expired"|"rejected"|"removed","message_kind": "text"|"image"|"offer"|"system"|"safety","network_lock": "factory_unlocked"|"carrier_locked"|"jv"|"unknown","payment_method": "jazzcash"|"easypaisa"|"bank_transfer"|"card"|"manual","payment_purpose": "promotion"|"subscription","payment_status": "pending"|"confirmed"|"rejected"|"refunded","phone_condition": "brand_new"|"open_box"|"like_new"|"grade_9"|"grade_8"|"grade_7"|"used"|"refurbished"|"for_parts","promo_type": "featured"|"bump"|"city_top","pta_check_source": "seller_declared"|"daam_checked","pta_reg_type": "official_import"|"individual_tax_paid"|"unknown","pta_status": "pta_approved"|"non_pta"|"cpid_patched"|"unknown","report_reason": "fake_listing"|"wrong_pta_status"|"stolen_device"|"scam_or_fraud"|"misleading_price"|"duplicate"|"offensive"|"prohibited_item"|"other","report_status": "open"|"reviewing"|"actioned"|"dismissed","report_target": "listing"|"user"|"message","screen_condition": "flawless"|"minor_scratches"|"visible_scratches"|"cracked"|"replaced","shop_plan": "free"|"pro"|"elite","shop_tier": "none"|"verified"|"trusted","sold_via": "daam"|"elsewhere","user_role": "user"|"support"|"moderator"|"admin"|"super_admin","verification_kind": "individual_id"|"shop","verification_status": "pending"|"approved"|"rejected"|"needs_more_info","warranty_type": "none"|"official_brand"|"shop"|"other"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "public": {
          Enums: {
            "account_type": ["individual", "shop"],"body_condition": ["flawless", "minor_marks", "visible_marks", "dents_or_cracks"],"box_status": ["box_matching_imei", "box_not_matching", "no_box"],"daam_band": ["great", "fair", "high", "unknown"],"listing_status": ["draft", "pending_review", "active", "on_hold", "sold", "expired", "rejected", "removed"],"message_kind": ["text", "image", "offer", "system", "safety"],"network_lock": ["factory_unlocked", "carrier_locked", "jv", "unknown"],"payment_method": ["jazzcash", "easypaisa", "bank_transfer", "card", "manual"],"payment_purpose": ["promotion", "subscription"],"payment_status": ["pending", "confirmed", "rejected", "refunded"],"phone_condition": ["brand_new", "open_box", "like_new", "grade_9", "grade_8", "grade_7", "used", "refurbished", "for_parts"],"promo_type": ["featured", "bump", "city_top"],"pta_check_source": ["seller_declared", "daam_checked"],"pta_reg_type": ["official_import", "individual_tax_paid", "unknown"],"pta_status": ["pta_approved", "non_pta", "cpid_patched", "unknown"],"report_reason": ["fake_listing", "wrong_pta_status", "stolen_device", "scam_or_fraud", "misleading_price", "duplicate", "offensive", "prohibited_item", "other"],"report_status": ["open", "reviewing", "actioned", "dismissed"],"report_target": ["listing", "user", "message"],"screen_condition": ["flawless", "minor_scratches", "visible_scratches", "cracked", "replaced"],"shop_plan": ["free", "pro", "elite"],"shop_tier": ["none", "verified", "trusted"],"sold_via": ["daam", "elsewhere"],"user_role": ["user", "support", "moderator", "admin", "super_admin"],"verification_kind": ["individual_id", "shop"],"verification_status": ["pending", "approved", "rejected", "needs_more_info"],"warranty_type": ["none", "official_brand", "shop", "other"]
          }
        }
} as const
