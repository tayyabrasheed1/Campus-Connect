Final Year Project Long Proposal
Student Campus Connect Platform
M. Tayyab Rasheed (2212509)
Ahmed Ayan (2212490)
Abdullah Adeel (2212506)
Supervised by: Ms. Saira Shaheen
Department Computer Science
Faculty of Computing and Engineering Sciences
SZABIST University
Islamabad, Pakistan
Spring 2026
Revision History
Compiled By Checked By Date Description Version
M. Tayyab Rasheed Ms. Saira Shaheen 09 Feb 2026 Section 1 1.0
Ahmed Ayan Ms. Saira Shaheen 09 Feb 2026 Section 2 1.1
Abdullah Adeel Ms. Saira Shaheen 09 Feb 2026 Section 3 1.2
M. Tayyab Rasheed Ms. Saira Shaheen 10 Feb 2026 Section 4 1.3
Ahmed Ayan Ms. Saira Shaheen 10 Feb 2026 Section 5 1.4
Abdullah Adeel Ms. Saira Shaheen 10 Feb 2026 Section 6 1.5
M. Tayyab Rasheed Ms. Saira Shaheen 10 Feb 2026 Section 7 1.6
Ahmed Ayan Ms. Saira Shaheen 11 Feb 2026 Section 8 1.7
Abdullah Adeel Ms. Saira Shaheen 11 Feb 2026 Section 9 1.8
M. Tayyab Rasheed Ms. Saira Shaheen 11 Feb 2026 Section 10, 11 1.9
Ahmed Ayan Ms. Saira Shaheen 11 Feb 2026 Section 12, 13 2.0
1. Project Description
Modern university life is characterized by a critical disconnect between student needs
for centralized information and the fragmented, decentralized nature of current campus
communication channels. Academic and social interactions often occur across scattered
platforms, leading to significant inefficiencies in information retrieval and a lack of accountability in student engagement. Students face a paradox of high information volume
and low relevance, while the absence of moderated digital spaces and dedicated portals for
alumni results in a fragmented community where graduated students continue to receive
irrelevant academic updates. For campus administrators and faculty, this environment
creates heavy operational burdens, including manual management of resources and routine query handling, which prevents the university from fostering a cohesive, data driven
digital ecosystem.
The proposed Student Campus Connect Platform will be developed in four distinct
phases to ensure a streamlined implementation. The initial phase focuses on the core
infrastructure, establishing a secure User Authentication system that utilizes domain
locked logic to automatically differentiate between students, faculty, and alumni. This
phase also introduces the Campus Mapper for location based navigation and Department
Chats to create foundational communication circles. By categorizing users at the point
of entry, the platform ensures that alumni no longer receive current student schedules,
while faculty gain the authority to manage specific academic streams.
The second and third phases expand the platform’s utility and academic integration.
Students gain access to a Student Marketplace for peer to peer trade and a Student
Feedback module that utilizes sentiment analytics to summarize campus mood. A Study
Resource Hub is implemented to centralize academic materials, uniquely allowing faculty
to integrate external learning links and digital resources directly into the student workflow. To bridge the gap between current students and the professional world, a dedicated
Alumni Portal is established, providing a specialized role for graduates to share job leads
and mentorship. Furthermore, a Campus Assistant provides a searchable knowledge base
to handle institutional FAQs without the complexity of traditional administrative manual
labor.
The project culminates in a governance and oversight phase designed for institutional
sustainability. The Safety Reporting module empowers the community to flag misconduct, while the Activity Logs provide a transparent audit trail for all system interactions.
Finally, the Admin Dashboard offers high level oversight for SZABIST administration to
monitor platform health and engagement metrics. This structured roadmap transforms
the university experience by providing a unified, secure repository for academic resources
and real time responses to queries, effectively reducing administrative workload while
fostering a professional and adaptive networking environment for the entire SZABIST
community.
2. Real World Problem
The modern higher education landscape currently contends with rising student demand for centralized, real time information against a backdrop of fragmented and decentralized communication channels. University environments often face significant student
frustration driven by a lack of a unified platform for academic resources, event coordination, and administrative transparency. A sector wide reliance on unofficial social media
groups, physical notice boards, and generic email blasts creates a significant gap between
student expectations for a curated digital experience and the operational reality of campus management. This disconnect represents a critical challenge to student engagement,
administrative efficiency, and the overall quality of campus life for students, faculty, and
the growing alumni community.
This institutional gap manifests within the campus environment as a reliance on
manual processes for resource sharing and feedback collection, leading to operational
bottlenecks. Furthermore, the absence of specialized tools for secure, domain locked peer
interaction forces students and alumni into unmonitored digital spaces. Graduates often
remain trapped in active student communication loops, receiving irrelevant daily schedules while lacking a dedicated channel for professional networking. The manual handling
of student queries and the inability for faculty to easily share external learning links or
verify official announcements creates delays and misinformation. These symptoms result
in a fragmented user journey, increased administrative overhead, and a campus experience that fails to adapt to the security and informational needs of a modern academic
community.
Without the implementation of a unified platform like the Student Campus Connect
Platform, the institution will continue to experience decreased student participation and
escalating administrative costs. The organization risks falling behind institutional benchmarks for digital transformation, resulting in a erosion of student satisfaction and campus
safety. The failure to provide a dedicated space for alumni will result in a lost opportunity
for mentorship and professional growth, while the inability to enforce digital moderation
and automate oversight will impact administrative productivity. Ultimately, sustained
inaction will cement a state of reactive communication in an academic era increasingly
defined by intelligent, automated, and secure digital ecosystems.
3. Project Stream
Web-Based FYP Desktop Application
✓ Mobile App Game
Hardware-Based
4. Modules
Table 1 provides a breakdown of project modules and assigned students based on
deadlines, showcasing their roles and responsibilities.
Table 1: Module Breakdown and Assignment
Deadline Modules Student
P1 Mid User Authentication M. Tayyab Rasheed (2212509)
Campus Mapper Ahmed Ayan (2212490)
Department Chats Abdullah Adeel (2212506)
P1 Final Student Marketplace M. Tayyab Rasheed (2212509)
Student Feedback Ahmed Ayan (2212490)
Campus Events Abdullah Adeel (2212506)
P2 Mid Study Resource Hub M. Tayyab Rasheed (2212509)
Alumni Portal Ahmed Ayan (2212490)
Campus Assistant Abdullah Adeel (2212506)
P2 Final Safety Reporting M. Tayyab Rasheed (2212509)
Activity Logs Ahmed Ayan (2212490)
Admin Dashboard Abdullah Adeel (2212506)
5. Names of existing similar FYPs (if repeated)
None
6. New Functionalities (main) to be added Features
None
7. Development Environment
Frontend Tools: React Native, Expo, NativeWind, Supabase Client SDK,
LangChain, OpenAI and Gemini API, React Navigation
Backend Services: Supabase Edge Functions (TypeScript), PostgreSQL Triggers for
Automated Moderation and Audit Logging
Database: Supabase PostgreSQL with pgvector for Retrieval Augmented Generation Assistant
Platforms: Visual Studio Code, Android Studio, Xcode, Git and GitHub
Management: Jira (Agile and Scrum Methodologies), Slack
8. Introduction
Following a detailed analysis of the current university communication landscape and
persistent institutional challenges such as fragmented information channels, inefficient
resource discovery, and manual administrative bottlenecks, this formal proposal has been
prepared by our technology team. Its purpose is to present a structured and innovative
solution to the recognized gaps in modern campus interaction at SZABIST Islamabad.
The document establishes a clear foundation for transforming decentralized campus services into a dynamic, intelligent mobile platform that meets the evolving expectations of
the student body, faculty, university administration, and the alumni community.
This proposal introduces the Student Campus Connect Platform, a comprehensive
mobile solution designed to integrate professional networking and tiered security directly
into the university experience. The platform delivers a seamless, secure journey through
features such as a Campus Assistant for policy inquiries, Activity Logs for security transparency, and a domain locked peer interaction system. A critical innovation is the automated role based access control and safety layer, which utilizes email analysis to differentiate between student, faculty, and alumni accounts. This ensures that graduated
students have a dedicated space for professional growth while current students maintain
focus on academic activities, all while enforcing community standards through a robust
reporting system.
This document will first outline the core purpose of the platform and define its primary
target audience, which includes students, faculty members, alumni, and administrative
staff. Subsequently, the key functional modules—ranging from Campus Events management to Department Chats and a Study Resource Hub capable of hosting teacher
recommended external links—and the technological framework will be detailed to illustrate the solution capabilities. The proposal will then project the anticipated social and
industrial impact of successful implementation within the EdTech domain. Finally, the
document will conclude by reinforcing the strategic significance of adopting an automated
and secure approach to future proof campus management systems.
9. Application Review
To establish a strategic and targeted foundation for the Student Campus Connect
Platform, a structured review of three existing applications within the university ecosystem has been conducted. This analysis evaluates the incumbent systems architectures,
core functionalities, and interaction models against modern benchmarks for campus management. The assessment adopts a diagnostic, fact based approach to catalog operational
strengths, integration capabilities, and specific functional limitations. Its objective is to
identify precise opportunities for enhancement through automation, ensuring the proposed solution addresses the real world gaps in the SZABIST Islamabad digital landscape. The subsequent findings provide an objective baseline that directly informs the
feature prioritization and design of the proposed solution.
WhatsApp (Unofficial Student Groups): It serves as the primary, albeit unofficial, communication hub for students. It offers instant real time messaging, group chat
capabilities, and multimedia sharing. While it attracts a high user base due to its familiarity, it lacks any formal integration with university services. Information within these
groups is decentralized and prone to misinformation, with critical academic updates often
getting lost in high volume, unmoderated conversations. The platform does not support
domain locked security, meaning users can join without university email verification, and
it lacks a dedicated role for alumni, leading to irrelevant message spam for graduates.
There are no tools for resource management, automated query handling, or verified faculty student interaction, leading to a significant lack of accountability and unmonitored
behavior [1].
The main features of the Application are listed below:
• Real Time Messaging: Facilitates instant communication between students and peer
groups.
• Multimedia Sharing: Enables the exchange of images, documents, and voice notes.
• Group Coordination: Allows for the creation of specific batch and section groups.
• Instant Notifications: Delivers immediate alerts for new messages.
• Cross Platform Accessibility: Allows students to connect via mobile and desktop.
The limitations of the application are listed below:
• Lack of Verification: No domain locked authentication for group access.
• Information Fragmentation: Critical academic policies are easily lost in high volume
chat history.
• No Moderation and Safety: Lack of a formal reporting or ban system for misconduct.
• Manual Query Handling: Students rely on peers rather than verified automated
responses.
• Role Confusion: Graduates receive the same notifications as current students.
Google Classroom: It is widely used for academic resource sharing and assignment
submission. It provides a structured layout for course materials and announcements.
While it is efficient for academic tracking, it is not designed as a social or interactive
campus ecosystem. It lacks real time student networking, peer to peer marketplaces, and
alumni specific portals. Furthermore, while faculty can post files, it does not serve as a
centralized hub for all campus navigation or professional networking [2].
The main features of the Application are listed below:
• Resource Organization: Centralized storage for lecture slides and assignments.
• Assignment Tracking: Provides deadlines and submission portals for academic grading.
• Faculty Announcements: Enables teachers to post official course related updates to
students.
• Grading Dashboard: Offers a clear overview of student progress and task feedback.
• Workspace Integration: Connects with official academic productivity tools for collaboration.
The limitations of the application are listed below:
• Static Interaction: No real time social networking or departmental chat hubs for
student interaction.
• Academic Only Scope: Does not support campus wide features like marketplace or
event ticketing.
• No Professional Networking: Lacks a role based system for alumni mentorship.
• Limited Resource Variety: Not optimized for sharing and categorizing external
learning links.
• Limited Administrative Utility: Lacks tools for non academic campus management
and oversight.
Zabdesk (LMS Portal): It is the official student information system at SZABIST.
It manages core administrative data such as attendance and transcripts. While it is
the source of truth for academic records, it suffers from an outdated interface and lacks
mobile optimization. Interaction is purely administrative, with no features for student
engagement or modern security systems [3].
The main features of the Application are listed below:
• Academic Records: Provides access to official transcripts, attendance, and GPA.
• Enrollment Management: Handles the core registration processes for each semester.
• Official Data: Serves as the primary repository for student administrative information.
• Attendance Tracking: Allows students to monitor their class presence.
• Fee Status Management: Provides a portal for tracking university dues.
The limitations of the application are listed below:
• Poor Mobile Experience: Web based portal is not optimized for real time mobile
interaction.
• No Social Integration: Lacks student chat, peer marketplace, or alumni networking.
• Manual Information Access: Users must navigate complex menus to find university
policies.
• No Security Moderation: Does not include reporting tools for peer to peer misconduct.
• No Graduate Separation: Alumni still interact with the same interface as active
students.
Table 2 provides a side by side evaluation of campus tools versus the proposed solution.
Table 2: Applications Comparison
Features
Applications WhatsApp [1] Google Classroom [2] Zabdesk [3] Proposed System
Domain Locked Security ✗ ✓ ✓ ✓
Mobile First Interface ✓ ✓ ✗ ✓
Campus Assistant ✗ ✗ ✗ ✓
Continued on next page
Table 2 – Continued from previous page
Features
Applications WhatsApp [1] Google Classroom [2] Zabdesk [3] Proposed System
Department Chats ✓ ✗ ✗ ✓
Verified Faculty Links ✗ ✓ ✗ ✓
Student Marketplace ✗ ✗ ✗ ✓
Activity Logs ✗ ✗ ✗ ✓
Campus Events ✗ ✗ ✗ ✓
Safety Reporting ✗ ✗ ✗ ✓
Study Resource Hub ✗ ✓ ✗ ✓
Alumni Portal ✗ ✗ ✗ ✓
Admin Dashboard ✗ ✗ ✓ ✓
10. Problem Statement
The core problem is a technological and methodological fragmentation within the
current university communication landscape. Existing systems rely on decentralized,
unofficial social media groups and static, one way administrative portals that cannot facilitate integrated academic coordination or real time student engagement. This creates
a fundamental architectural disconnect between the multidimensional nature of university life—where secure resource sharing, peer to peer networking, and administrative
transparency are paramount—and the scattered, unverified interfaces currently used to
navigate it. This limitation is inherent to the lack of a unified campus technology stack
and defines a fundamental constraint on delivering a truly efficient and secure experience
for students, faculty, and the alumni community.
This architectural deficiency forces students and faculty to expend significant time
on manual information discovery, often leading to misinformation and missed academic
opportunities. Teachers lack a centralized hub to share external learning links, while
graduated students are forced into active student communication loops, receiving irrelevant schedule updates without a dedicated portal for professional networking. Campus
administration is consequently overwhelmed with repetitive queries regarding university
policies and event coordination, consuming resources that could be allocated to more
complex tasks. For university members, the unmonitored nature of unofficial digital
spaces allows for misconduct to persist without formal accountability, while the lack of
automated oversight makes real time adaptation to community needs impossible.
Consequently, institutions operating without a centralized digital ecosystem will fail
to capitalize on the strategic imperative of digital transformation and proactive student
engagement. They will consistently face operational bottlenecks in event management,
security auditing, and academic resource dissemination. This gap prevents the establishment of a cohesive campus community and locks the university into a cycle of reactive
communication rather than proactive innovation. Ultimately, the organization will forfeit
its ability to provide a modern, safe, and automated environment that aligns with the
technological and professional expectations of a contemporary academic community.
11. Scope
The scope of this project defines the precise deliverables and boundaries for the Student Campus Connect Platform. It encompasses the development and deployment of an
integrated mobile ecosystem designed for SZABIST Islamabad, focusing on three core
pillars: professional networking, academic resource integration, and administrative automation. The scope includes all stages from initial mobile architecture configuration
and backend system integration to comprehensive testing and administrator training.
Any modifications or additions requested after the formal approval of this document will
constitute a change in scope and will be managed through a structured change control
procedure.
The solution comprises the following core modules, each with its specified feature set:
Module: User Authentication
• Domain locked registration for Students, Faculty, and Alumni
• Automatic role assignment based on email analysis
• Secure session handling and profile settings
• Multi factor account recovery
• Integrated student and alumni profile management
Module: Campus Assistant
• Searchable knowledge base for campus FAQs
• Automated query handling for university policies
• Contextual academic guidance
• Institutional handbook integration
• Natural language search capabilities
Module: Safety Reporting
• Misconduct reporting tools for community safety
• Administrative review dashboard for flagged content
• Permanent account suspension for bad actors
• Evidence based moderation logs
• Community standards enforcement
Module: Department Chats
• Program based automated grouping
• Real time messaging for peer interaction
• Multimedia document and resource sharing
• Department level broadcasts
• Secure in domain communication
Module: Activity Logs
• Automated user activity tracking
• Administrative action logging for transparency
• Security event monitoring
• Immutable audit trails of platform interactions
• System configuration history
Module: Campus Events
• Digital ticket generation and QR distribution
• Quick response code scanning for attendance
• Automated participation logs and reports
• Society event coordination
• Real time event updates and alerts
Module: Student Marketplace
• Peer to peer academic item listings
• Category based product search for books and gear
• Secure in domain buyer seller chat
• Wishlist and save features
• Student seller verification
Module: Study Resource Hub
• Academic document and lecture slide storage
• Faculty moderated learning resource section
• Teacher recommended external learning links
• Pinned faculty official announcements
• Subject based organization and search
Module: Admin Dashboard
• Global user and role management
• Platform usage analytics and health metrics
• Content moderation and oversight tools
• Database maintenance and system settings
• High level administrative reporting
Module: Campus Mapper
• Digital directory of campus locations
• Departmental office and classroom search
• Facility location assistance
• Point of interest discovery
• Static route guidance for new students
Module: Student Feedback
• Instant survey and poll creation
• Real time result visualization
• Automated sentiment summaries of campus mood
• Interactive feedback loops for administration
• Campus wide opinion gathering
Module: Alumni Portal
• Specialized role for graduated students
• Professional networking and mentorship hub
• Job lead and career opportunity postings
• Alumni directory and interaction tools
• Verified graduate verification system
12. Significance
The significance of the proposed Platform lies in its ability to transform the fragmented digital landscape of SZABIST Islamabad into a unified, intelligent, and secure
academic ecosystem. By integrating advanced automation with institutional administrative workflows, the platform addresses critical gaps in communication efficiency, campus
safety, and community networking. The project serves as a strategic bridge between the
current reliance on unverified social media groups and the need for a centralized, domain
locked environment that fosters academic collaboration, administrative transparency, and
lifelong professional connection.
For the student body, the significance is found in the immediate access to verified
institutional knowledge through the Campus Assistant. This reduces the time spent
navigating complex policy handbooks and waiting for manual administrative responses.
Furthermore, features such as the Student Marketplace and the Study Resource Hub
empower students to share academic materials and physical resources within a secure,
university verified boundary. The addition of teacher recommended learning links ensures
that students are not only consuming internal materials but are also connected to global
academic trends through verified faculty guidance.
From an administrative and faculty perspective, the platform significantly reduces
the operational burden of manual query handling and event coordination. The Campus Events module automates the tracking of student participation, while the Admin
Dashboard and Activity Logs provide real time analytics into campus engagement and
platform security. A unique significance of this platform is the inclusion of a dedicated
Alumni Portal, which resolves the long standing issue of information overlap where graduates were receiving irrelevant student schedules. By providing a specialized role for
alumni, the platform creates a sustainable mentorship and job placement network. Ultimately, the project represents a major step toward the realization of a smart campus,
setting a benchmark for digital transformation in the regional higher education sector.
13. Tools and Technologies
The successful realization of the Student Campus Connect Platform necessitates a
carefully selected suite of modern tools and established techniques. The chosen technology stack is dictated by the project core requirements for real time interactivity, secure role based data management, and scalable automated integration. This approach
prioritizes a modular, cross platform architecture, ensuring that each component from
the mobile user interface to the backend database operates with high performance and
maintainability. The methodology is designed to guarantee system reliability, seamless
feature integration, and a foundation that supports future iterative enhancements within
the university ecosystem.
• Frontend Tools: React Native and the Expo framework provide high performance
cross platform mobile development for both iOS and Android. NativeWind manages responsive layout and styling through utility classes, while React Navigation
provides smooth screen transitions for an engaging experience. The Supabase Client
Software Development Kit handles all client server communication, supporting fast
updates and consistent interaction across the platform.
• Backend and Security: Supabase serves as the backend as a service provider
utilizing Edge Functions for serverless logic. Email Prefix Analysis and security
protocols enforce domain locked authentication and role based access control for
students, faculty, and alumni. Activity Logs are implemented via database triggers
to capture every administrative action and user interaction, providing a transparent
record of system activity.
• Database and Management: PostgreSQL acts as the primary relational database,
storing structured data for user profiles, departmental groupings, and resource
metadata. The pgvector extension stores and queries embeddings to support similarity searches for the Campus Assistant and Study Resource Hub. This setup
guarantees transactional accuracy, data integrity, and supports complex queries
necessary for academic information retrieval.
• Intelligent Techniques: The system applies automated knowledge retrieval to
power the Campus Assistant and Vector Similarity Search for the Student Marketplace and Study Resource Hub. Automated sentiment analysis is utilized to categorize and highlight feedback in the Student Feedback module. The development
lifecycle is managed using Jira Software through Agile and Scrum methodologies to
ensure iterative progress and alignment with institutional security requirements.
References
[1] WhatsApp LLC, ”WhatsApp Messenger Platform Features and Security Protocols.”
[Online]. Available: https://www.whatsapp.com [Accessed: 11 Feb 2026].
[2] Google LLC, ”Google Classroom: A Centralized Academic Learning Management
System.” [Online]. Available: https://classroom.google.com [Accessed: 11 Feb
2026].
[3] SZABIST, ”Zabdesk: Official Student Information System and LMS Portal.” [Online].
Available: https://zabdesk.szabist-isb.edu.pk [Accessed: 11 Feb 2026].