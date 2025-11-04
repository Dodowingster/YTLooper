## 📝 Software Requirements Specification (SRS)

### 1. Introduction

#### 1.1 Purpose
The purpose of this document is to define the requirements for the **YouTube Segment Looper**, a static web application designed to loop a specific, user-defined segment of any public YouTube video.

#### 1.2 Scope
The application is a **single-page web application** hosted on **GitHub Pages**. It will utilize the **YouTube IFrame Player API** and client-side JavaScript to control video playback. The scope is limited to controlling one embedded video at a time based on user-provided URL and timestamps.

#### 1.3 Definitions and Acronyms
| Acronym | Definition |
| :--- | :--- |
| **SRS** | Software Requirements Specification |
| **API** | Application Programming Interface |
| **IFrame** | Inline Frame (used to embed the YouTube player) |
| **GitHub Pages**| Web hosting service used for static files |

---

### 2. Overall Description

#### 2.1 Product Perspective
The YouTube Segment Looper is a standalone application. It does not interface with any external databases or require user authentication. All processing occurs locally in the user's browser.

#### 2.2 User Characteristics
The target users are general internet users who need to repeatedly view a specific portion of a YouTube video for purposes like transcription, learning, exercise, or entertainment.

---

### 3. Specific Requirements

#### 3.1 Functional Requirements

| ID | Requirement | Description |
| :--- | :--- | :--- |
| **FR-01** | **Video Input** | The system **MUST** provide a text input field for the user to enter a **valid YouTube Video URL** or **Video ID**. |
| **FR-02** | **Start Time Input** | The system **MUST** provide a numerical input field for the user to specify the **start time** (in seconds or in MM:SS format) of the segment to be looped. |
| **FR-03** | **End Time Input** | The system **MUST** provide a numerical input field for the user to specify the **end time** (in seconds or in MM:SS format) of the segment to be looped. |
| **FR-04** | **Player Initialization** | Upon submission, the application **MUST** load and display the YouTube video player, starting playback at the specified **Start Time**. |
| **FR-05** | **Core Looping Logic** | The application **MUST** continuously monitor the video playback. When the player reaches the specified **End Time**, it **MUST** automatically seek back to the **Start Time** and resume playback, creating a loop. |
| **FR-06** | **Control Buttons** | The application **SHOULD** provide buttons to **Start/Apply Loop** and **Stop/Clear Player**. |

#### 3.2 Non-Functional Requirements

| ID | Requirement | Description |
| :--- | :--- | :--- |
| **NFR-01** | **Performance** | The video player and looping mechanism **MUST** initialize and function with minimal latency, ideally within 2 seconds of button press. |
| **NFR-02** | **Usability** | The user interface **MUST** be intuitive and easy to use, requiring no prior knowledge of the YouTube API. |
| **NFR-03** | **Maintainability** | The code **SHOULD** be structured using clean HTML, CSS, and modular JavaScript to facilitate easy updates and maintenance. |
| **NFR-04** | **Browser Compatibility**| The application **MUST** function correctly on modern versions of Chrome, Firefox, Safari, and Edge. |
| **NFR-05** | **Hosting** | The application **MUST** be hostable as a static site on **GitHub Pages**. |

---

### 4. Interface Requirements

#### 4.1 User Interfaces

The main interface will include:
1.  A section for **input fields** (URL/ID, Start Time, End Time).
2.  A **Submit/Start Loop button**.
3.  The embedded **YouTube IFrame Player**.
4.  **Error messages** for invalid input (e.g., non-numeric times, invalid URL).

#### 4.2 Software Interfaces
* **YouTube IFrame Player API:** Used to embed the player and control the `play`, `pause`, and `seekTo()` methods based on the `onStateChange` event.
* **HTML/CSS/JavaScript:** Standard web technologies for the interface and logic.

---