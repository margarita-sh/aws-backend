/**
  Fill data with carts
 */
INSERT INTO public.carts (id, user_id, created_at, updated_at) values
('5ea0871b-c372-424c-bc88-ab7a535f0c61', 'e1cd46d9-d590-4638-8082-d5bffab2a010', '2022-11-20', '2022-11-20'),
('78e6a091-bc28-4892-8666-6cf8943da80d','72945f5e-c3c2-4636-ab45-db77f4913c1b', '2022-11-21', '2022-11-21')

/**
  Fill data with cart_items
 */

INSERT INTO public.cart_items (cart_id, product_id, count) values
('5ea0871b-c372-424c-bc88-ab7a535f0c61', '56fa0e17-6330-4faf-94e7-08c95bf33893', 1),
('5ea0871b-c372-424c-bc88-ab7a535f0c61', '95333149-c0f6-4629-a1bb-b60ab004d689', 2),
('5ea0871b-c372-424c-bc88-ab7a535f0c61', '8654f4a1-5958-4e6a-b960-c3ae0df6322d', 3),
('78e6a091-bc28-4892-8666-6cf8943da80d', '157f963a-c5cc-42f1-9aae-ff8d4190cd16', 1),
('78e6a091-bc28-4892-8666-6cf8943da80d', 'd31c78bc-711c-4cc0-a2ba-ceceeb992a0e', 2)