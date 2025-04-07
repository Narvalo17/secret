-- Insertion d'un utilisateur propriétaire de magasin
MERGE INTO users (email, password, first_name, last_name, role, active, email_verified, created_at, updated_at)
KEY(email)
VALUES ('store@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'John', 'Doe', 'STORE_OWNER', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insertion d'une catégorie
MERGE INTO categories (name, description, slug, is_active, type, created_at, updated_at)
KEY(slug)
VALUES ('Alimentation', 'Produits alimentaires', 'alimentation', true, 'STORE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insertion d'un magasin
MERGE INTO stores (name, slug, description, image_url, owner_id, address, phone, email, website, first_name, last_name, password, confirm_password, is_active, store_type, created_at, updated_at)
KEY(slug)
SELECT 'Épicerie Test', 'epicerie-test', 'Une épicerie de test pour le développement', 'https://example.com/store.jpg',
       (SELECT id FROM users WHERE email = 'store@example.com'),
       '123 Rue Test', '+33123456789', 'store@example.com', 'https://example.com',
       'John', 'Doe', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a',
       true, 'EPICERIE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP;

-- Insertion des statistiques du magasin
MERGE INTO store_statistics (store_id, total_orders, total_products, total_customers, total_revenue, average_order_value, average_rating, total_reviews, total_views, total_favorites, created_at, updated_at)
KEY(store_id)
SELECT s.id, 0, 0, 0, 0.0, 0.0, 0.0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM stores s
WHERE s.slug = 'epicerie-test'; 