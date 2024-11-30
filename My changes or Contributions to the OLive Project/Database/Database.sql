-- Create the scholarships database
CREATE DATABASE OLive_database;

-- Use the database and display its structure
USE OLive_database;

-- Table to store user information (students, institutions)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,               -- Unique ID for each user
    email VARCHAR(255) UNIQUE NOT NULL,                   -- Email address (shared by all users)
    password VARCHAR(255) NOT NULL,                       -- Password (shared by all users)
    role ENUM('student', 'institution') NOT NULL,         -- Role of the user
    date_joined DATE DEFAULT (CURRENT_DATE),              -- Date when the user joined
    first_name VARCHAR(255),                             -- First name of the user
    last_name VARCHAR(255),                              -- Last name of the user
    date_of_birth DATE,                                  -- Date of birth of the user
    age INT,                                             -- Age of the user
    location VARCHAR(255),                               -- Location of the user
    contact_info VARCHAR(255),                           -- Contact information of the user
    description TEXT,                                     -- Description or personal biography
    profile_image VARCHAR(255) DEFAULT NULL
);



-- Table to store student's information
CREATE TABLE students (
    student_id INT PRIMARY KEY,                                             -- Student ID (linked to user_id in users table)
    first_name VARCHAR(255) NOT NULL,                                       -- First name of the student
    last_name VARCHAR(255) NOT NULL,                                        -- Last name of the student
    major VARCHAR(255) NULL,                                                -- Major of study (optional, especially in sign-up)
    grade_level ENUM('freshman', 'sophomore', 'junior', 'senior') NULL,     -- Grade level (optional, especially in sign-up)
    gpa DECIMAL(3, 2) NULL,                                                 -- GPA of the student (optional, especially in sign-up)
    university_name VARCHAR(255) NULL,                                      -- Name of the student's university (optional, especially in sign-up)
    date_of_birth DATE NOT NULL,                                            -- Date of birth
    FOREIGN KEY (student_id) REFERENCES users(user_id)                      -- Link to users table
);


CREATE TABLE institutions (
    institution_id INT AUTO_INCREMENT PRIMARY KEY,                  -- Institution ID, auto-increment for uniqueness
    institution_name VARCHAR(255) NOT NULL,                        -- Name of the institution
    nature VARCHAR(255) NULL,                                      -- Type or nature of the institution
    address VARCHAR(255) NULL,                                     -- Address of the institution (optional)
    phone VARCHAR(50) NULL,                                        -- Contact phone number
    website_url VARCHAR(255) NOT NULL,                             -- Website URL of the institution
    campus VARCHAR(255) NULL,                                      -- Campus details
    establishment_date DATE NULL,                                  -- Date of establishment
    founder VARCHAR(255) NULL,                                     -- Name of the founder
    ceo VARCHAR(255) NULL,                                         -- Current CEO
    affiliations VARCHAR(255) NULL,                                -- Affiliations
    logo_path VARCHAR(255) DEFAULT '../images/default-logo.png',   -- Path to the institution's logo
    banner_path VARCHAR(255) NULL,                                 -- Path to the institution's banner
    email VARCHAR(255) NULL 
);


-- Table to categorize scholarships
CREATE TABLE scholarship_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,  				-- Unique ID for each category
    category_name VARCHAR(255) NOT NULL,         				-- Name of the scholarship category
    scholarship_description TEXT                             	-- Description of the category
);

-- Table to store scholarship's information
CREATE TABLE scholarships (
    scholarship_id INT AUTO_INCREMENT PRIMARY KEY,  								-- Unique ID for each scholarship
    title VARCHAR(255) NOT NULL,                    								-- Title of the scholarship
    scholarship_description TEXT,                               					-- Description of the scholarship
    amount DECIMAL(10, 2),                         								    -- Amount of scholarship
    eligibility_criteria TEXT,                      								-- Eligibility criteria for the scholarship
    application_deadline DATE,                      								-- Deadline to apply for the scholarship
    category_id INT,                               		 							-- Category ID
    institution_id INT,                             								-- Institution offering the scholarship
    FOREIGN KEY (category_id) REFERENCES scholarship_categories(category_id),  		-- Foreign key, linking to categories table
    FOREIGN KEY (institution_id) REFERENCES institutions(institution_id)       		-- Foreign key, linking to institutions table
);

-- Table to store scholarship's applications
CREATE TABLE applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,  								-- Unique ID for each application
    student_id INT,                                 								-- applying Student
    scholarship_id INT,                             								-- Scholarship being applied to 
    application_status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending', 	-- Status of the application
    submission_date DATE DEFAULT (CURRENT_DATE),    								-- Date of submission
    reason_for_rejection TEXT,                      								-- Reason for rejection, if applicable

    FOREIGN KEY (student_id) REFERENCES students(student_id),  						-- foreign key, linking to students table

    FOREIGN KEY (student_id) REFERENCES students(student_id),  						-- foreign key, linking to students table

    FOREIGN KEY (student_id) REFERENCES students(student_id),  						-- usersforeign key, linking to students table

    FOREIGN KEY (scholarship_id) REFERENCES scholarships(scholarship_id),  			-- foreign key, linking to scholarships table
    UNIQUE (student_id, scholarship_id)                                             -- Unique constraint to prevent duplicate applications
);

-- Table to store documents submitted with applications
CREATE TABLE application_documents (
    document_id INT AUTO_INCREMENT PRIMARY KEY,     							-- Unique ID for each document
    application_id INT,															-- Application the document is associated with
    file_name VARCHAR(255) NOT NULL,               			 					-- Name of the uploaded file
    file_path VARCHAR(255) NOT NULL,                							-- File path of the document 
    upload_date DATE DEFAULT (CURRENT_DATE),        							-- Date the document was uploaded
    FOREIGN KEY (application_id) REFERENCES applications(application_id) 		-- foreign key, linking to applications table
);

-- Table to store reviews for applications
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,       													-- Unique ID for each review
    application_id INT,                            			 											-- Reviewed application
    reviewer_id INT,                                													-- Reviewer 
    comments TEXT,                                  													-- Reviewer comments
    decision ENUM('approved', 'denied', 'more_info_needed', 'pending') NOT NULL DEFAULT 'pending', 		-- Decision on the application
    review_date DATE DEFAULT (CURRENT_DATE),        													-- Date the review was made
    FOREIGN KEY (application_id) REFERENCES applications(application_id),  								-- foreign key, linking to applications table
    FOREIGN KEY (reviewer_id) REFERENCES users(user_id)                    								-- foreign key, linking to users table (admin)
);

-- Table to store notifications for users
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY, 				-- Unique ID for each notification
    user_id INT,                                    				-- Receiver of the notification
    message TEXT NOT NULL,                          				-- Notification message
    is_read BOOLEAN DEFAULT FALSE,                  				-- To check whether the notification has been read
    posted_at DATETIME DEFAULT CURRENT_TIMESTAMP,  				-- Time the notification was created
    FOREIGN KEY (user_id) REFERENCES users(user_id) 				-- foreign key, linking to users table
);

-- Table to store tags for scholarships
CREATE TABLE scholarship_tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,          							-- Unique ID for each tag
    scholarship_id INT,                             							-- Scholarship associated with the tag
    tag_name VARCHAR(255) NOT NULL,                 							-- tag name
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(scholarship_id) 		-- foreign key, linking to scholarships table
);


-- Table to store payment information for applications
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,      									-- Unique ID for each payment
    application_id INT,                            							 			-- Application associated with the payment
    amount_paid DECIMAL(10, 2) NOT NULL,            									-- Amount paid
    payment_date DATE DEFAULT (CURRENT_DATE),       									-- Date of the payment
    payment_method ENUM('credit_card', 'paypal'),   									-- Payment method
    transaction_status ENUM('success', 'failed', 'pending') DEFAULT 'pending',  		-- Status of the transaction
    FOREIGN KEY (application_id) REFERENCES applications(application_id) 				-- foreign key, linking to applications table
);

CREATE TABLE password_resets (
    reset_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(64) NOT NULL,
    expiry DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    UNIQUE (user_id)
);

CREATE TABLE user_documents (
    document_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    file_name VARCHAR(255),
    file_path VARCHAR(255),
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    relevant_links TEXT,
    title VARCHAR(255),
    type ENUM('document', 'link') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
