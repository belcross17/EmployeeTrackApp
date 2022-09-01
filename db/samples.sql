SELECT
employee.id,
name,
job_id,
title,
salary,
first_name,
last_name,
manager_id
FROM ((department
JOIN roles ON department.id = roles.department_id)
JOIN employee ON roles.id = employee.roles.id)