// Configuration
export const CONFIG = {
    defaultApiKey: "", // Environment key
    model: 'gemini-2.5-flash-preview-09-2025'
};

// Genres by content type
export const GENRES_BY_TYPE = {
    'Movies': [
        "Sci-Fi", "Action", "Comedy", "Thriller", "Horror", "Drama", "Romance", 
        "Adventure", "Mystery", "Fantasy", "Animation", "Crime", "Documentary", 
        "War", "Western", "Musical", "Biographical", "Sports", "Cyberpunk", "Noir"
    ],
    'TV Series': [
        "Drama", "Sitcom", "Thriller", "Sci-Fi", "Crime", "Fantasy", "Reality TV", 
        "Miniseries", "Documentary", "Action", "Mystery", "Historical Drama", 
        "Teen Drama", "Medical Drama", "Political Drama", "Dark Comedy"
    ],
    'Anime': [
        "Shonen (Action/Adventure)", "Seinen (Adult/Serious)", "Shojo (Romance/Drama)", 
        "Isekai (Another World)", "Mecha (Robots)", "Slice of Life", "Sports", 
        "Psychological Thriller", "Dark Fantasy", "Cyberpunk", "RomCom", "Horror"
    ],
    'Web Shows': [
        "Sketch Comedy", "Vlogs/Lifestyle", "Web Series Drama", "Tech/Review", 
        "Educational", "Gaming", "True Crime", "Podcast (Video)", "Cooking", 
        "Travel", "Stand-up Specials", "Reality Competition"
    ]
};
