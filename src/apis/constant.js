export const API_ROUTES = {
   LOGIN: "users/login",
   SIGNUP: "users/signup",
   USER_LIST: "users/getAllUsersByType?type=3",
   USER_DELETE: "users/deleteUsers",
   USER_EDIT: "users/editUser/",
   EVENT_LIST: "event/getAllEvents?",
   PROFILE: "users/profile",
   EDIT_PROFILE: "users/updateProfile",
   ADD_EVENT: "event/addEvent",
   UPDATE_EVENT: "event/updateEvent/",
   DELETE_EVENT: "event/deleteEvent/",
   ACTIVITIESADMIN: "activities/getAllActivities",
   DASHBORADAPI: "dashboard/overview",
   ANALYTICSDATA: "analysis/type3?",
   ACTIVITIESUSER: "activities/getUserActivities",
   RESETPASSWORD: 'users/resetPassword',
   RESETCODE: "users/verifyResetCode",
   CREATE_ROOM:"accent/create-room",
   ROOMLINK_GENRATE:"accent/create_room",
   GET_ROOM_DETAILS: "accent/room/",
   LEAVE_ROOM: "accent/leave-room",
}

// Socket.IO Configuration
export const SOCKET_CONFIG = {
   BACKEND_URL: "https://talkbrush.com",
   SOCKET_PATH: "/accent/socket.io/",
   TRANSPORTS: ["websocket", "polling"],
   RECONNECTION: true,
   RECONNECTION_DELAY: 1000,
   RECONNECTION_ATTEMPTS: 5,
   TIMEOUT: 20000,
}

// Audio Configuration
export const AUDIO_CONFIG = {
   NATURAL_PAUSE_MS: 450,
   CHUNK_INTERVAL: 200,
   ECHO_CANCELLATION: true,
   NOISE_SUPPRESSION: true,
   AUTO_GAIN_CONTROL: true,
   SAMPLE_RATE: 48000,
   MIME_TYPE: 'audio/webm;codecs=opus',
   AUDIO_BITS_PER_SECOND: 128000,
}

// Accent Options
export const ACCENT_OPTIONS = [
   { value: 'american', label: 'American' },
   { value: 'british', label: 'British' },
   { value: 'australian', label: 'Australian' },
   { value: 'indian', label: 'Indian' },
   { value: 'irish', label: 'Irish' },
   { value: 'portuguese', label: 'Portuguese' },
   { value: 'canadian', label: 'Canadian' },
   { value: 'new_zealand', label: 'New Zealand' },
   { value: 'nigerian', label: 'Nigerian' },
   { value: 'polish', label: 'Polish' },
   { value: 'russian', label: 'Russian' },
   { value: 'german', label: 'German' },
   { value: 'spanish', label: 'Spanish' },
   { value: 'us_midwest', label: 'US – Midwest' },
   { value: 'us_new_york', label: 'US – New York' },
]

// Gender Options
export const GENDER_OPTIONS = [
   { value: 'male', label: 'Male' },
   { value: 'female', label: 'Female' },
]
