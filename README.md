# Application Overview

## Purpose
This application is designed to enhance operational efficiency within an organization by streamlining access to information across different departments. It aims to improve time management, reduce inquiries to the secretariat and human resources, and provide quick answers from uploaded documents.

## Key Features

### Basic Functionalities
- **Google Authentication:** Secure log-in capabilities.
- **Role-Specific Custom Screens:** Tailored user interface depending on the user's role.
- **CRUD Operations:** Full management of all entities within the application.
- **Sticky Notes:** Users can jot down important information.
- **Appointment Scheduling:** Facilitates the setting of meetings according to members' availability.

### Advanced Functionalities
- **Virtual Assistant:** Provides answers using an integrated OpenAI API and LangChain framework.
- **Document-Driven Information:** Extracts and provides information solely from uploaded documents.
- **Automatic Document Summarization:** Utilizes BART models for quick content summarization.
- **Role-Based Privacy:** Ensures information security through custom role-based permissions.
- **Personalized Calendars:** Displays daily availability and helps in scheduling department-specific meetings.
- **Automated Leave Management:** Streamlines the process of requesting and approving leave.
- **Email Notifications:** Keeps everyone updated on meeting schedules and changes.
- **Application Security:** Maintains high standards of data integrity and security.

## Technologies Used
- **NestJS**
- **ReactJS**
- **Langchain**
- **Python and Flask**
- **BART Model**
- **GPT-3.5 Turbo Model**

## Implementation Details
During the application's development, we used OpenAI's API along with the LangChain framework to handle inquiries and extract data from documents efficiently. Documents are processed into text format and segmented into fragments. These fragments are then managed in a vectorized database powered by FAISS (Facebook AI Similarity Search) to enhance search capabilities. The use of natural language processing techniques is pivotal in identifying leave periods and generating summaries.



