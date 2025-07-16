# Educational Companion App - Backend

This is the Node.js backend for the AI-Powered Educational Companion mobile app. It serves video data from a MongoDB database and uses the Google Gemini API to generate educational concepts from YouTube video transcripts.

## Tech Stack

-   **Backend**: Node.js, Express
-   **Database**: MongoDB with Mongoose
-   **AI**: Google Gemini API via `fetch`
-   **Transcript Fetching**: `youtube-transcript`

## Local Setup and Installation

To run this project on your local machine for development:

1.  **Clone the repository:**
    ```bash
    git clone <your-backend-repo-link>
    cd educational-app
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the root directory and add the following variables:
    ```
    MONGO_URI=<your_mongodb_connection_string>
    GOOGLE_API_KEY=<your_google_ai_api_key>
    YOUTUBE_API_KEY=<your_youtube_data_api_key>
    PORT=5000
    ```
4.  **Run the server locally:**
    ```bash
    npm start
    ```

## Deployment (Render)

The service is deployed on [Render](https://render.com/). The live service uses the same codebase but gets its environment variables from the Render dashboard.

For a successful deployment on Render, ensure the following **Environment Variables** are set in the service's settings:
-   `MONGO_URI`
-   `GOOGLE_API_KEY`
-   `YOUTUBE_API_KEY`

## API Endpoints

-   `GET /api/videos`: Returns a list of all videos in the database.
-   `GET /api/videos/:videoId`: Returns the details for a single video.
-   `GET /api/concepts/:videoId`: Fetches a video's transcript and returns AI-generated educational concepts.
-   `POST /api/videos/seed`: Wipes the database and seeds it with the sample videos defined in `controllers/videoController.js`.
