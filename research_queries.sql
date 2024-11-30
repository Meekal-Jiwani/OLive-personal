 SELECT DISTINCT s.title, c.category_name, s.amount, s.application_deadline, i.institution_name
FROM scholarships s
LEFT JOIN scholarship_categories c ON s.category_id = c.category_id
LEFT JOIN institutions i ON s.institution_id = i.institution_id
WHERE ('{name}' != '' OR '{category}' != '' OR '{criteria}' != '' OR '{grade_level}' != '')
  AND (s.title LIKE '%{name}%' OR '{name}' = '')
  AND (c.category_name LIKE '%{category}%' OR '{category}' = '')
  AND (s.eligibility_criteria LIKE '%{criteria}%' OR '{criteria}' = '')
  AND (s.grade_level LIKE '%{grade_level}%' OR '{grade_level}' = '');


SELECT DISTINCT i.institution_name, i.website_url, i.address, u.date_joined
FROM institutions i
JOIN users u ON i.institution_id = u.user_id
WHERE ('{name}' != '' OR '{address}' != '')
  AND (institution_name LIKE '%{name}%' OR '{name}' = '')
  AND (address LIKE '%{address}%' OR '{address}' = '');


