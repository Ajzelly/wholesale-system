categories	id	int	NO	PRI	auto_increment
categories	name	varchar(100)	NO	UNI	
messages	id	int	NO	PRI	auto_increment
messages	user_id	int	YES	MUL	
messages	message	text	NO		
messages	created_at	timestamp	YES		DEFAULT_GENERATED
order_items	id	int	NO	PRI	auto_increment
order_items	order_id	int	YES	MUL	
order_items	product_id	int	YES	MUL	
order_items	quantity	int	NO		
order_items	price	decimal(10,2)	NO		
orders	id	int	NO	PRI	auto_increment
orders	user_id	int	YES	MUL	
orders	total_amount	decimal(12,2)	YES		
orders	status	enum('pending','confirmed','delivered','cancelled')	YES		
orders	order_date	timestamp	YES		DEFAULT_GENERATED
payments	id	int	NO	PRI	auto_increment
payments	order_id	int	YES	MUL	
payments	amount	decimal(12,2)	YES		
payments	method	enum('cash','mpesa','bank','card')	YES		
payments	status	enum('pending','paid','failed')	YES		
payments	paid_at	timestamp	YES		
products	id	int	NO	PRI	auto_increment
products	category_id	int	YES	MUL	
products	name	varchar(150)	NO		
products	description	text	YES		
products	price	decimal(10,2)	NO		
products	stock	int	YES		
products	image	varchar(255)	YES		
products	created_at	timestamp	YES		DEFAULT_GENERATED
products	is_hot	tinyint(1)	YES		
products	is_sale	tinyint(1)	YES		
users	id	int	NO	PRI	auto_increment
users	name	varchar(100)	NO		
users	email	varchar(100)	YES	UNI	
users	phone	varchar(20)	YES		
users	password	varchar(255)	NO		
users	role	enum('admin','staff','customer')	YES		
users	created_at	timestamp	YES		DEFAULT_GENERATED