create table carts(                          
id uuid primary key default uuid_generate_v4(),
created_at DATE NOT NULL,                    
updated_at DATE NOT NULL)                    
                                             
                                             
create table cart_items(                     
cart_id uuid,                                
product_id uuid,                             
count integer,                               
foreign key("cart_id") references "carts" ("id"))
                                             
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  