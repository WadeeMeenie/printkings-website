-- Only exact-SKU verified and visually approved, locally hosted assets are inserted.
-- The statement is idempotent and never writes a raw supplier image URL to production.
with approved_assets(product_id, variant_id, storage_path, alt_text) as (
  values
    ('9dc108d2-cc04-4fd8-80b0-ea1833bf6b36', '5c19c765-b56c-4455-8129-73cde422eb17', 'images/products/flags-od184.webp', 'Bow Flag 2m Single product image'),
    ('65049c8c-67d1-46ea-bcb5-cb44f16bdf76', '5d4f54b3-5fe1-4e26-996e-565cd03b7658', 'images/products/flags-od189.webp', 'Bow Flag 4m Double product image'),
    ('4c85e884-d2e8-4423-8afd-fddf42549487', '18f816a9-3b68-4ea4-bfdf-785f4c8a51e1', 'images/products/flags-od318.webp', 'Flame Lantern 1.8m Ground Spikes product image'),
    ('9546ac87-ff20-4653-a8a2-330c754ad329', '2aadb42c-6e6d-41a1-94b8-4554aaeff9b0', 'images/products/flags-od181.webp', 'Sharkfin Deluxe Flag 2m Double product image'),
    ('803e8734-3567-485e-a668-53caeb65b0c4', '8892764f-76ce-4e18-808f-a99916c6710f', 'images/products/flags-od182.webp', 'Sharkfin Deluxe Flag 3m Double product image'),
    ('60f0fac6-87bf-4600-b3bf-b5d0b173cfd3', '58167a31-fdec-4f1b-bc72-78da65b91b69', 'images/products/flags-od179.webp', 'Sharkfin Deluxe Flag 3m Single product image'),
    ('d1cbc140-2562-4923-b408-083c341ad931', 'f19c6fe6-3dbe-4c25-a0e9-9eb473817332', 'images/products/flags-od180.webp', 'Sharkfin Deluxe Flag 4m Single product image'),
    ('525457f2-45bd-42b2-9b3b-c2f5fe144cc8', '1066cecd-0fa1-45bb-a230-303a95573952', 'images/products/flags-od282.webp', 'Starshade 14m product image'),
    ('76059e7d-fc6e-492f-9054-393e81663a65', '410e0cba-3cba-4966-9311-e12bd7675721', 'images/products/flags-od284.webp', 'Starshade 19m product image'),
    ('4c83bc97-b26c-416e-bb86-cf4fbc2e267c', '601cc9e3-903d-46ca-86c0-55744d670ad8', 'images/products/flags-od177.webp', 'Telescopic Flag 4m Double product image'),
    ('dfd1a186-c2d5-4a9e-924a-390eb661b054', 'd931ef7b-6334-44e4-89ce-15c2f8e59072', 'images/products/frames-components-fs049.webp', 'A1 Sandwich Board 28mm product image'),
    ('e3963f63-265c-424d-9f46-be300303b8de', '760b3a3a-b96b-4e22-a14c-628c5aa37cd5', 'images/products/furniture-id305.webp', 'Branded Standard Tablecloth 2.4x1.4m product image'),
    ('fd74788e-6164-4a02-89ea-89339b57d4d4', 'a7ef3ae5-d819-4922-8ef8-b44f4518209b', 'images/products/furniture-id258.webp', 'Branded Stretch Tablecloth 1800x760x690mm product image'),
    ('fc16bd35-d811-4deb-8e43-5eb3a8fa3111', '17a8d91f-9930-4506-8e52-053ddd065f1e', 'images/products/gazebos-kiosks-od151.webp', 'Premium Aluminium Gazebo 2x2m product image'),
    ('7f6886d1-fee7-46e5-bfa1-58d7f603f635', 'f95c1f78-64e6-418a-903c-e64182d5249f', 'images/products/gazebos-kiosks-od153.webp', 'Premium Aluminium Gazebo 3x3m product image'),
    ('b5d43799-cf29-4d98-a463-800164d345ac', '5be86906-5ec9-4500-a2f3-f913feaec4cf', 'images/products/gazebos-kiosks-od154.webp', 'Premium Aluminium Gazebo 3x4.5m product image'),
    ('be4a811e-c76a-498c-b543-42dda420e385', '04b1301f-23e1-44e8-ab76-e53d7a338df4', 'images/products/gazebos-kiosks-od155.webp', 'Premium Aluminium Gazebo 3x6m product image'),
    ('114a3397-ffc3-45b5-a0fb-bed6c0c28703', 'bf0cfc0f-eee4-4f57-b21a-ffaa2e6e8e84', 'images/products/gazebos-kiosks-od291.webp', 'Value Steel Gazebo 2x2m product image'),
    ('121a7dc3-04ef-4693-b806-85be7100898a', 'd44605a6-c0cc-4190-b1e6-52aa2b5e9dd5', 'images/products/gazebos-kiosks-od292.webp', 'Value Steel Gazebo 3x3m product image'),
    ('58ca6575-c856-4c07-ae36-2400d290e1bc', '7c511efe-613c-44ff-b4eb-f3cb711d7e60', 'images/products/indoor-branding-id232.webp', 'Deluxe Banner Wall 2.25x4.5m product image'),
    ('8a047cc4-312a-4cd9-a2f0-4173a274d122', '440cff04-1419-40a7-9e65-1084cf044c99', 'images/products/indoor-branding-id223.webp', 'Econo Pull-Up Banner 2x0.85m product image'),
    ('8d84e725-7b19-4df2-b0ea-9613c4102c61', '7d9e4192-3760-4193-a00c-6525ab6a7d8f', 'images/products/indoor-branding-id273.webp', 'Executive X-Banner 1.6x0.6m product image'),
    ('3b677900-b23a-4802-8427-9ef70959cda2', 'a5e8b2b9-f9a6-44b4-b719-3e3a8ff3089a', 'images/products/outdoor-displays-pr354.webp', 'PVC Outdoor Banner 2x1m product image'),
    ('c9c4297b-cd31-42ed-accd-ea9c2cf277b1', 'bd274535-246d-47e2-a2c1-9b6d6ed759c6', 'images/products/outdoor-displays-od210.webp', 'Round Pop-Up Banner 1x1m product image'),
    ('b145b761-3322-49b4-b993-dda123ee2229', '731c53f1-8e16-4140-981e-8bf7664cab99', 'images/products/promo-counters-id246.webp', 'Standard Promo Table 900x420x820mm product image'),
    ('5c67085d-35a1-4c84-8f48-2be21986cd52', '8686a775-a3fb-40f8-8689-54b5ccbb9de4', 'images/products/promo-counters-id248.webp', 'Standard Promo Table with Header 900x420x820mm product image'),
    ('0617c86d-6c37-412c-9336-3a61001dd697', 'ef5e9676-e3ee-4685-84f6-3c741e68d6a5', 'images/products/promo-counters-id293.webp', 'Value Promo Table 664x850x350mm product image')
)
insert into public.product_images (
  product_id,
  variant_id,
  storage_path,
  external_url,
  alt_text,
  sort_order,
  is_primary,
  approved
)
select
  product_id::uuid,
  variant_id::uuid,
  storage_path,
  null,
  alt_text,
  0,
  true,
  true
from approved_assets source
where not exists (
  select 1
  from public.product_images existing
  where existing.variant_id = source.variant_id::uuid
    and existing.storage_path = source.storage_path
)
returning product_id, variant_id, storage_path, approved;
