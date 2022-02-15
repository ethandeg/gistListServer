INSERT INTO users (username, password, email, profile_pic) 
VALUES
('ethandeg', 'ethan', 'ethandeg@gmail.com', 'https://d17fnq9dkz9hgj.cloudfront.net/uploads/2020/04/shelter-dog-cropped-1.jpg'),
('billybob','thorton','billy@yahoo.com', NULL);

INSERT INTO lists(name, description, user_id)
VALUES
('my shopping list', 'list for shopping', 1),
('chritmas list', 'what i want this year for christmas',1),
('dolly stuff', 'stuff for dolly', 2);


INSERT INTO list_items(item, item_link, list_id)
VALUES
('bread',NULL,1),
('milk',NULL,1),
('eggs','https://www.walmart.com/ip/Great-Value-Large-White-Eggs-12-Count/145051970?wmlspartner=wlpa&selectedSellerId=0',1),
('dolly', NULL, 3);
