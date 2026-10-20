# ZPantry-Frontend
GitHub repo dùng để lưu trữ code frontend
# ZPantry Frontend

## Super Admin bootstrap

The browser never contains an administrator password. Configure the deployed Java backend with
`ADMIN_EMAIL` and `ADMIN_PASSWORD` before its first startup, then sign in through `/login`. A
`super_admin` is redirected to `/admin` after a successful login. Admin pages read account
data from the Java backend; they do not use browser seed data.

`/admin/users` manages accounts and roles. `/admin/catalog` manages ingredients and recipes,
including allergens, image uploads, and ingredient aliases. The Mobile app has no Admin screens.
`/admin/revenue` shows paid PayOS revenue. The Admin dashboard checks Backend, AI and database
availability and links to ingredient details and catalog management.
