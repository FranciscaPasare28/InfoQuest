# Application Overview

## Purpose
The application serves to assist members of an organization from various departments, enhancing efficiency by providing quick access to information, improving time management, and reducing the number of inquiries directed towards the secretariat, human resources, or other responsible personnel.

## Key Features

### Basic Functionalities
- **Google Authentication:** Secure and reliable login process.
- **Customized Screens Based on Role:** Ensures that the user interface is appropriate for the user’s role and access rights.
- **CRUD Operations:** Comprehensive management options for all entities.
- **Sticky Notes:** Enables users to note down important pieces of information, which helps in avoiding repetitive queries.
- **Appointment Setting:** Allows the creation and management of appointments based on the availability shown in personalized calendars.

### Advanced Functionalities
- **Virtual Assistant Integration:** Uses the OpenAI API and LangChain framework to answer questions directly from uploaded documents.
- **Information Security through Role-Based Permissions:** Access to information is controlled via custom permissions, ensuring privacy and security.
- **Automatic Summarization of Documents:** Leverages a BART model to provide concise summaries of documents for quicker information retrieval.
- **Personalized Calendars:** Generates custom calendars that display daily availability and facilitate department-specific scheduling.
- **Automated Leave Management:** Simplifies the leave request process by automatically generating and sending requests to administrators.
- **Email Notifications:** Sends notifications to keep all members informed about new meetings and changes to schedules.
- **Application Security:** High standards of security are upheld to protect data integrity and confidentiality.

## Technologies Used
- **NestJS**
- **ReactJS**
- **Langchain**
- **Python and Flask**
- **BART Model**
- **GPT-3.5 Turbo Model**

## Implementation Details
The implementation leverages the OpenAI API integrated with the LangChain framework to provide responses from documents, which are converted into text format and segmented into manageable fragments. These fragments are stored in a vectorized database using FAISS (Facebook AI Similarity Search) for efficient vector storage and retrieval. Natural language processing techniques identify leave periods and generate document summaries.

## Additional Notes
- **Privacy and Access Management:** The application manages access to information through custom role-based permissions. If users do not have the necessary access, the application provides details about the contacts if they are included in the documents.
- **Efficient Information Browsing:** The application's document summarization feature facilitates the quick identification of relevant information, enhancing usability and efficiency.

