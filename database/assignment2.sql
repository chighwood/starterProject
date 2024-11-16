--- Select a single record by primary key ---
SELECT * FROM table_name WHERE primary_key_column = value;

--- Insert a new record ---
INSERT INTO table_name (column1, column2, column3) VALUES (value1, value2, value3);

--- Update a single record ---
UPDATE table_name SET column1 = new_value1, column2 = new_value2 WHERE primary_key_column = value;

--- Delete a single record ---
DELETE FROM table_name WHERE primary_key_column = value;


--- Add Tony Stark ---
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password) 
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n'); 

--- Update Tony Stark to Admin ---
UPDATE public.account 
SET account_type = 'Admin' 
WHERE account_id = 1;

--- Delete Tony Stark from account table ---
DELETE FROM public.account 
WHERE account_id = 1;

--- Change inv description for Hummer ---
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_id = 10;

--- Inner Join to find make and model fields that belong to the sport category ---
SELECT inv_make, inv_model
FROM public.inventory
INNER JOIN public.classification
	ON classification.classification_id = inventory.classification_id
WHERE classification_name = 'Sport';

--- Update inv_image and inv_thumbnail but putting in a vehicles folder ---
UPDATE public.inventory
SET 
	inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
WHERE inv_image LIKE '/images/%' AND inv_thumbnail LIKE '/images/%';