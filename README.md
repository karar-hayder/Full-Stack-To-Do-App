# To-Do App

This is a full-stack To-Do application built with a modern tech stack. The application allows users to manage their tasks efficiently.

## Features

- User authentication (login/logout)
- Create, read, update, and delete (CRUD) tasks
- Mark tasks as complete/incomplete
- Pagination for task lists

## Tech Stack

### Frontend

- React
- Next.js
- TypeScript
- Tailwind CSS

### Backend

- Django
- Django REST framework
- PostgreSQL

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Python
- PostgreSQL

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/karar-hayder/Full-Stack-To-Do-App.git
    cd todo-app
    ```

2. Install frontend dependencies:

    ```bash
    cd frontend
    npm install
    ```

3. Install backend dependencies:

    ```bash
    cd ../backend
    pip install -r requirements.txt
    ```

4. Create .env file in the backend directory and add the following environment variables:

    ```plaintext
    SECRET_KEY=your_secret_key
    DEBUG=True
    DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
    DJANGO_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
    ```

5. Create .env file in the frontend directory and add the following environment variables:

    ```plaintext
    DJANGO_PUBLIC_API_URL="http://localhost:8000/api/v1/"
    ```

6. Run database migrations:

    ```bash
    python manage.py migrate
    ```

7. Start the backend server:

    ```bash
    python manage.py runserver
    ```

8. Start the frontend development server:

    ```bash
    cd ../frontend
    npm run dev
    ```

## Usage

1. Open your browser and navigate to `http://localhost:3000` to access the frontend.
2. Use the application to manage your tasks.

## Folder Structure

```plaintext
todo-app/
├── backend/
│   ├── manage.py
│   ├── backend/
│   ├── core/
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
└── README.md
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, please contact [kararhaider.pro@gmail.com].
