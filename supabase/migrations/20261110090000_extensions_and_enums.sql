-- Daam schema: extensions + enums (master plan §17.1).
-- RLS is enabled on every table in later migrations; deny by default.

create extension if not exists pg_trgm;
create extension if not exists citext;

create type user_role            as enum ('user','support','moderator','admin','super_admin');
create type account_type         as enum ('individual','shop');
create type verification_kind    as enum ('individual_id','shop');
create type verification_status  as enum ('pending','approved','rejected','needs_more_info');
create type shop_tier            as enum ('none','verified','trusted');
create type shop_plan            as enum ('free','pro','elite');
create type pta_status           as enum ('pta_approved','non_pta','cpid_patched','unknown');
create type network_lock         as enum ('factory_unlocked','carrier_locked','jv','unknown');
create type pta_reg_type         as enum ('official_import','individual_tax_paid','unknown');
create type pta_check_source     as enum ('seller_declared','daam_checked');
create type phone_condition      as enum ('brand_new','open_box','like_new','grade_9','grade_8','grade_7','used','refurbished','for_parts');
create type screen_condition     as enum ('flawless','minor_scratches','visible_scratches','cracked','replaced');
create type body_condition       as enum ('flawless','minor_marks','visible_marks','dents_or_cracks');
create type box_status           as enum ('box_matching_imei','box_not_matching','no_box');
create type warranty_type        as enum ('none','official_brand','shop','other');
create type listing_status       as enum ('draft','pending_review','active','on_hold','sold','expired','rejected','removed');
create type daam_band            as enum ('great','fair','high','unknown');
create type sold_via             as enum ('daam','elsewhere');
create type report_target        as enum ('listing','user','message');
create type report_reason        as enum ('fake_listing','wrong_pta_status','stolen_device','scam_or_fraud','misleading_price','duplicate','offensive','prohibited_item','other');
create type report_status        as enum ('open','reviewing','actioned','dismissed');
create type message_kind         as enum ('text','image','offer','system','safety');
create type promo_type           as enum ('featured','bump','city_top');
create type payment_method       as enum ('jazzcash','easypaisa','bank_transfer','card','manual');
create type payment_status       as enum ('pending','confirmed','rejected','refunded');
create type payment_purpose      as enum ('promotion','subscription');
