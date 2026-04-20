# Movie Seat Booking System

A web-based movie seat booking application built with Flask and Redis.

## Description

This application allows users to browse movies, view available seats, and book seats for movie showings. It features session-based seat holding to prevent double bookings and a simple web interface for seat selection.

## Features

- Browse available movies
- View seat layouts for each movie
- Hold seats temporarily during booking process
- Confirm seat bookings
- Release held seats if booking is cancelled
- Real-time seat availability updates

## Todo
- Release seat on failure
- Add async booking processing using redis streams
- Add auth
- Add payment service
- Restore saved sessions
- Update UI

## Prerequisites

- Python 3.11+
- Redis server
- Docker and Docker Compose (optional, for containerized setup)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd booking-system
   ```

2. Create a virtual environment:
   ```bash
   python3 -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start Redis server:
   ```bash
   # Using Docker Compose (recommended)
   docker-compose up -d redis

   # Or install Redis locally and start it
   redis-server
   ```

5. Seed the database with sample data:
   ```bash
   python seed_redis.py
   ```

## Running the Application

1. Start the Flask application:
   ```bash
   python app.py
   ```

2. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

- `GET /` - Home page
- `GET /movies` - Get all movies
- `GET /movies/<movie_id>/seats` - Get seats for a specific movie
- `POST /movies/<movie_id>/seats/<seat_id>/hold` - Hold a seat (create session)
- `PUT /sessions/<session_id>/confirm` - Confirm a seat booking
- `DELETE /sessions/<session_id>` - Release a held seat

## Technologies Used

- **Backend**: Flask (Python web framework)
- **Database**: Redis (in-memory data store)
- **Frontend**: HTML, CSS, JavaScript
- **Containerization**: Docker, Docker Compose

## Development

The application consists of several modules:

- `app.py` - Main Flask application with API routes
- `seats_service.py` - Seat management logic
- `session_service.py` - Session handling for seat holds
- `redis_util.py` - Redis connection utilities
- `seed_redis.py` - Database seeding script

## License

This project is licensed under the MIT License.