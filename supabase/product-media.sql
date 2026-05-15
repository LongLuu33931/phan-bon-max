update public.products set
  thumbnail_url = '/product-images/rootmax-npk8000/rootmax.jpg',
  images = '[{"url":"/product-images/rootmax-npk8000/rootmax.jpg","alt":"RootMax NPK8000","isPrimary":true},{"url":"/product-images/rootmax-npk8000/16640ca628dca982f0cd.jpg","alt":"RootMax NPK8000"}]'::jsonb,
  updated_at = now()
where slug = 'rootmax-npk8000';

update public.products set
  thumbnail_url = '/product-images/soil-max-8000/soil-max.jpg',
  images = '[{"url":"/product-images/soil-max-8000/soil-max.jpg","alt":"Soil Max 8000","isPrimary":true},{"url":"/product-images/soil-max-8000/Anh-chup-Man-hinh-2026-05-06-luc-15-02-01.png","alt":"Soil Max 8000"}]'::jsonb,
  updated_at = now()
where slug = 'soil-max-8000';

update public.products set
  thumbnail_url = '/product-images/recover-max-8000/RECOVER-MAX-8000.jpg',
  images = '[{"url":"/product-images/recover-max-8000/RECOVER-MAX-8000.jpg","alt":"Recover Max 8000","isPrimary":true},{"url":"/product-images/recover-max-8000/Anh-chup-Man-hinh-2026-05-06-luc-15-19-35.png","alt":"Recover Max 8000"}]'::jsonb,
  updated_at = now()
where slug = 'recover-max-8000';

update public.products set
  thumbnail_url = '/product-images/grow-max-8000/GROW-MAX-8000.jpg',
  images = '[{"url":"/product-images/grow-max-8000/GROW-MAX-8000.jpg","alt":"Grow Max 8000","isPrimary":true},{"url":"/product-images/grow-max-8000/Anh-chup-Man-hinh-2026-05-06-luc-16-40-36.png","alt":"Grow Max 8000"}]'::jsonb,
  updated_at = now()
where slug in ('grow-max-8000', 'grow-max-npk-8000');

update public.products set
  thumbnail_url = '/product-images/shoot-max-8000/z7662479580439-bba693d61637eaa2cb402b525a5ad6ff.jpg',
  images = '[{"url":"/product-images/shoot-max-8000/z7662479580439-bba693d61637eaa2cb402b525a5ad6ff.jpg","alt":"Shoot Max 8000","isPrimary":true}]'::jsonb,
  updated_at = now()
where slug in ('shoot-max-8000', 'shoot-max-npk-8000');

update public.products set
  thumbnail_url = '/product-images/leaf-max-8000/LEAF-MAX-8000.jpg',
  images = '[{"url":"/product-images/leaf-max-8000/LEAF-MAX-8000.jpg","alt":"Leaf Max 8000","isPrimary":true},{"url":"/product-images/leaf-max-8000/Anh-chup-Man-hinh-2026-05-06-luc-16-15-04.png","alt":"Leaf Max 8000"}]'::jsonb,
  updated_at = now()
where slug in ('leaf-max-8000', 'leaf-max-npk-8000');

update public.products set
  thumbnail_url = '/product-images/fruit-max-npk-8000/FRUIT-MAX-8000.jpg',
  images = '[{"url":"/product-images/fruit-max-npk-8000/FRUIT-MAX-8000.jpg","alt":"Fruit Max NPK 8000","isPrimary":true},{"url":"/product-images/fruit-max-npk-8000/Anh-chup-Man-hinh-2026-05-06-luc-17-31-11.png","alt":"Fruit Max NPK 8000"}]'::jsonb,
  updated_at = now()
where slug = 'fruit-max-npk-8000';

update public.products set
  thumbnail_url = '/product-images/stem-max-npk-8000/STEM-MAX-8000.jpg',
  images = '[{"url":"/product-images/stem-max-npk-8000/STEM-MAX-8000.jpg","alt":"Stem Max NPK 8000","isPrimary":true},{"url":"/product-images/stem-max-npk-8000/Anh-chup-Man-hinh-2026-05-06-luc-17-21-06.png","alt":"Stem Max NPK 8000"}]'::jsonb,
  updated_at = now()
where slug in ('stem-max-8000', 'stem-max-npk-8000');

update public.products set
  thumbnail_url = '/product-images/flower-max-8000/FLOWER-MAX-8000.jpg',
  images = '[{"url":"/product-images/flower-max-8000/FLOWER-MAX-8000.jpg","alt":"Flower Max 8000","isPrimary":true},{"url":"/product-images/flower-max-8000/Anh-chup-Man-hinh-2026-05-06-luc-16-55-54.png","alt":"Flower Max 8000"}]'::jsonb,
  updated_at = now()
where slug = 'flower-max-8000';

update public.products set
  thumbnail_url = '/product-images/cal-max-8000/CAL-MAX-8000.jpg',
  images = '[{"url":"/product-images/cal-max-8000/CAL-MAX-8000.jpg","alt":"Cal Max 8000","isPrimary":true},{"url":"/product-images/cal-max-8000/Anh-chup-Man-hinh-2026-05-06-luc-17-06-23.png","alt":"Cal Max 8000"}]'::jsonb,
  updated_at = now()
where slug = 'cal-max-8000';
