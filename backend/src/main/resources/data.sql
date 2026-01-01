-- Insert sample users (password: password123)
INSERT INTO users (first_name, last_name, email, password, role, created_at) VALUES
('John', 'Doe', 'john.doe@email.com', '$2a$10$e0MYzXyjpJS7Pd0RVvHqHOxHH9wMr9qFbThM27yOPKlG4GJJxPLhG', 'ADMIN', NOW()),
('Jane', 'Smith', 'jane.smith@email.com', '$2a$10$e0MYzXyjpJS7Pd0RVvHqHOxHH9wMr9qFbThM27yOPKlG4GJJxPLhG', 'USER', NOW());

-- Insert sample doctors with realistic coordinates (Bangalore HBR Layout and surrounding areas)
INSERT INTO doctors (name, specialty, latitude, longitude, address, phone, created_at) VALUES
-- HBR Layout area doctors
('Dr. Rajesh Kumar', 'Cardiology', 13.0358, 77.6394, 'HBR Layout 1st Block, Bengaluru, Karnataka 560043', '+91 98765 43210', NOW()),
('Dr. Priya Sharma', 'Dermatology', 13.0342, 77.6422, 'HBR Layout 2nd Block, Bengaluru, Karnataka 560043', '+91 98765 43211', NOW()),
('Dr. Arun Patel', 'Orthopedics', 13.0376, 77.6381, 'HBR Layout 3rd Block, Bengaluru, Karnataka 560043', '+91 98765 43212', NOW()),
('Dr. Deepika Reddy', 'Pediatrics', 13.0329, 77.6445, 'Hennur Road, Bengaluru, Karnataka 560043', '+91 98765 43213', NOW()),
('Dr. Suresh Gowda', 'Neurology', 13.0389, 77.6357, 'Kalyan Nagar, Bengaluru, Karnataka 560043', '+91 98765 43214', NOW()),
('Dr. Kavitha Rao', 'Gynecology', 13.0312, 77.6468, 'Banaswadi Main Road, Bengaluru, Karnataka 560043', '+91 98765 43215', NOW()),
('Dr. Ramesh Iyer', 'Psychiatry', 13.0365, 77.6408, 'HBR Layout 4th Block, Bengaluru, Karnataka 560043', '+91 98765 43216', NOW()),
('Dr. Sunita Joshi', 'Ophthalmology', 13.0351, 77.6434, 'Horamavu Main Road, Bengaluru, Karnataka 560043', '+91 98765 43217', NOW()),
('Dr. Vikram Singh', 'Oncology', 13.0323, 77.6456, 'Kammanahalli Main Road, Bengaluru, Karnataka 560043', '+91 98765 43218', NOW()),
('Dr. Meera Nair', 'Family Medicine', 13.0382, 77.6371, 'Hebbal Ring Road, Bengaluru, Karnataka 560024', '+91 98765 43219', NOW()),

-- Nearby areas - Hebbal, Kalyan Nagar, RT Nagar
('Dr. Anand Kumar', 'Emergency Medicine', 13.0355, 77.5917, 'Hebbal Main Road, Bengaluru, Karnataka 560024', '+91 98765 43220', NOW()),
('Dr. Lakshmi Devi', 'Radiology', 13.0281, 77.6234, 'RT Nagar Main Road, Bengaluru, Karnataka 560032', '+91 98765 43221', NOW()),
('Dr. Murali Krishna', 'Cardiology', 13.0412, 77.6156, 'Kalyan Nagar Main Road, Bengaluru, Karnataka 560043', '+91 98765 43222', NOW()),
('Dr. Shalini Menon', 'Dermatology', 13.0298, 77.6387, 'Lingarajapuram Main Road, Bengaluru, Karnataka 560084', '+91 98765 43223', NOW()),
('Dr. Arjun Reddy', 'Orthopedics', 13.0445, 77.6234, 'Yelahanka New Town, Bengaluru, Karnataka 560064', '+91 98765 43224', NOW()),

-- Extended coverage - surrounding areas
('Dr. Bhavani Shankar', 'Pediatrics', 13.0198, 77.6445, 'Ramamurthy Nagar, Bengaluru, Karnataka 560016', '+91 98765 43225', NOW()),
('Dr. Geetha Subramanian', 'Neurology', 13.0512, 77.6089, 'Yelahanka Old Town, Bengaluru, Karnataka 560063', '+91 98765 43226', NOW()),
('Dr. Santosh Kumar', 'Gynecology', 13.0167, 77.6512, 'New Thippasandra, Bengaluru, Karnataka 560075', '+91 98765 43227', NOW()),
('Dr. Radha Krishnan', 'Psychiatry', 13.0423, 77.5967, 'Nagawara, Bengaluru, Karnataka 560045', '+91 98765 43228', NOW()),
('Dr. Mahesh Babu', 'Ophthalmology', 13.0234, 77.6623, 'CV Raman Nagar, Bengaluru, Karnataka 560093', '+91 98765 43229', NOW()),

-- Additional specialties and coverage
('Dr. Usha Rani', 'Oncology', 13.0489, 77.6123, 'Yelahanka Main Road, Bengaluru, Karnataka 560064', '+91 98765 43230', NOW()),
('Dr. Prasad Rao', 'Family Medicine', 13.0145, 77.6578, 'Marathahalli, Bengaluru, Karnataka 560037', '+91 98765 43231', NOW()),
('Dr. Nandini Gowda', 'Emergency Medicine', 13.0278, 77.6189, 'RT Nagar 2nd Cross, Bengaluru, Karnataka 560032', '+91 98765 43232', NOW()),
('Dr. Kiran Kumar', 'Radiology', 13.0367, 77.6456, 'Horamavu Agara, Bengaluru, Karnataka 560043', '+91 98765 43233', NOW()),

-- Additional New York doctors for variety (keeping some for testing)
('Dr. Michael Johnson', 'Cardiology', 40.7614, -73.9776, '123 Heart St, New York, NY 10001', '(555) 123-4567', NOW()),
('Dr. Sarah Williams', 'Dermatology', 40.7505, -73.9934, '456 Skin Ave, New York, NY 10001', '(555) 234-5678', NOW()),
('Dr. David Brown', 'Orthopedics', 40.7282, -74.0776, '789 Bone Blvd, New York, NY 10002', '(555) 345-6789', NOW()),
('Dr. Emily Davis', 'Pediatrics', 40.7831, -73.9712, '321 Kids Lane, New York, NY 10003', '(555) 456-7890', NOW()),
('Dr. Robert Miller', 'Neurology', 40.7589, -73.9851, '654 Brain St, New York, NY 10004', '(555) 567-8901', NOW()),
('Dr. Lisa Wilson', 'Gynecology', 40.7411, -74.0024, '987 Women Way, New York, NY 10005', '(555) 678-9012', NOW());

-- Sample appointments for testing
INSERT INTO appointments (user_id, doctor_id, appointment_date, appointment_time, status, created_at) VALUES
(1, 13, CURRENT_DATE + INTERVAL '3 days', '10:00:00', 'BOOKED', NOW()),
(1, 15, CURRENT_DATE + INTERVAL '5 days', '14:30:00', 'BOOKED', NOW()),
(2, 14, CURRENT_DATE + INTERVAL '2 days', '09:15:00', 'BOOKED', NOW());