const cityData = {
  London: [
    {
      id: 1,
      name: 'Big Ben',
      category: 'Landmark',
      image: 'images/London/bigben.png',
      description:
        'An iconic clock tower located at the Palace of Westminster.',
      lat: 51.5007,
      lng: -0.1246,
      wiki: 'https://en.wikipedia.org/wiki/Big_Ben'
    },
    {
      id: 2,
      name: 'Hyde Park',
      category: 'Park',
      image: 'images/London/hydepark.jpg',
      description:
        "One of London's largest green spaces, popular for walking, relaxing, and public events.",
      lat: 51.5073,
      lng: -0.1657,
      wiki: 'https://en.wikipedia.org/wiki/Hyde_Park,_London'
    },
    {
      id: 3,
      name: 'British Museum',
      category: 'Museum',
      image: 'images/London/museum.jpg',
      description:
        'A world-famous museum housing artefacts from ancient civilisations, including the Rosetta Stone.',
      lat: 51.5194,
      lng: -0.127,
      wiki: 'https://en.wikipedia.org/wiki/British_Museum'
    },
    {
      id: 4,
      name: 'Tower Bridge',
      category: 'Landmark',
      image: 'images/London/towerbridge.jpg',
      description:
        'The most famous bridge in the world. You can walk across the glass floor walkways.',
      lat: 51.5055,
      lng: -0.0754,
      wiki: 'https://en.wikipedia.org/wiki/Tower_Bridge'
    },
    {
      id: 5,
      name: 'Borough Market',
      category: 'Market',
      image: 'images/London/camden.jpg',
      description:
        'Alternative fashion, vintage clothes, and incredible street food by the canal.',
      lat: 51.5055,
      lng: -0.091,
      wiki: 'https://en.wikipedia.org/wiki/Borough_Market'
    },
    {
      id: 6,
      name: 'The Shard',
      category: 'Viewpoint',
      image: 'images/London/shard.jpg',
      description:
        'The tallest building in the UK with 360-degree views of the entire city.',
      lat: 51.5045,
      lng: -0.0865,
      wiki: 'https://en.wikipedia.org/wiki/The_Shard'
    },
    {
      id: 7,
      name: 'Natural History Museum',
      category: 'Museum',
      image: 'images/London/nhm.jpg',
      description:
        'Home to Hope the Whale and dinosaurs. The building itself is a work of art.',
      lat: 51.4967,
      lng: -0.1764,
      wiki: 'https://en.wikipedia.org/wiki/Natural_History_Museum,_London'
    },
    {
      id: 8,
      name: 'Sky Garden',
      category: 'Viewpoint',
      image: 'images/London/skygarden.jpg',
      description:
        "London's highest public garden. Great views and completely free to enter.",
      lat: 51.5107,
      lng: -0.0834,
      wiki: 'https://en.wikipedia.org/wiki/20_Fenchurch_Street'
    },
    {
      id: 9,
      name: "St Paul's Cathedral",
      category: 'History',
      image: 'images/London/stpauls.jpg',
      description:
        'An iconic part of the skyline. The Whispering Gallery is a must-try experience.',
      lat: 51.5138,
      lng: -0.0984,
      wiki: 'https://en.wikipedia.org/wiki/St_Paul%27s_Cathedral'
    },
    {
      id: 10,
      name: 'Tate Modern',
      category: 'Art',
      image: 'images/London/tate.jpg',
      description:
        'Contemporary art housed in an old power station. Industrial and cool.',
      lat: 51.5076,
      lng: -0.0994,
      wiki: 'https://en.wikipedia.org/wiki/Tate_Modern'
    },
    {
      id: 11,
      name: 'Covent Garden',
      category: 'Shopping',
      image: 'images/London/coventgarden.jpg',
      description:
        'Street performers, luxury shopping, and a vibrant atmosphere in the West End.',
      lat: 51.5117,
      lng: -0.124,
      wiki: 'https://en.wikipedia.org/wiki/Covent_Garden'
    },
    {
      id: 12,
      name: 'Buckingham Palace',
      category: 'History',
      image: 'images/London/palace.jpg',
      description:
        "The King's official London residence. Watch the Changing of the Guard.",
      lat: 51.5014,
      lng: -0.1419,
      wiki: 'https://en.wikipedia.org/wiki/Buckingham_Palace'
    },
  ],

  'New York': [
    {
      id: 101,
      name: 'Russ & Daughters',
      category: 'Restaurant',
      image: 'images/NY/Russ.jpg',
      description:
        'A legendary Jewish deli on the Lower East Side, famous for smoked fish, bagels, and classic New York appetising since 1914.',
      lat: 40.7226,
      lng: -73.9885,
      wiki: 'https://en.wikipedia.org/wiki/Russ_%26_Daughters'
    },
    {
      id: 102,
      name: 'Times Square',
      category: 'Landmark',
      image: 'images/NY/timesSquare.jpg',
      description:
        'Bright lights, giant billboards, and the heart of New York entertainment.',
      lat: 40.7580,
      lng: -73.9855,
      wiki: 'https://en.wikipedia.org/wiki/Times_Square'
    },
    {
      id: 103,
      name: 'Central Park',
      category: 'Park',
      image: 'images/NY/centralPark.jpg',
      description:
        'A massive green oasis in Manhattan, perfect for walking, relaxing, and cycling.',
      lat: 40.7829,
      lng: -73.9654,
      wiki: 'https://en.wikipedia.org/wiki/Central_Park'
    },
    {
      id: 104,
      name: 'Brooklyn Bridge',
      category: 'Landmark',
      image: 'images/NY/brooklynBr.jpg',
      description:
        'Iconic suspension bridge connecting Manhattan and Brooklyn with amazing skyline views.',
      lat: 40.7061,
      lng: -73.9969,
      wiki: 'https://en.wikipedia.org/wiki/Brooklyn_Bridge'
    },
    {
      id: 105,
      name: 'Empire State Building',
      category: 'Viewpoint',
      image: 'images/NY/empireState.jpg',
      description:
        'Classic New York skyscraper offering panoramic views from its observation deck.',
      lat: 40.7484,
      lng: -73.9857,
      wiki: 'https://en.wikipedia.org/wiki/Empire_State_Building'
    },
    {
      id: 106,
      name: 'Top of the Rock',
      category: 'Viewpoint',
      image: 'images/NY/topOfTheRock.jpg',
      description:
        'Observation deck at Rockefeller Center with incredible views of Central Park and Midtown.',
      lat: 40.7587,
      lng: -73.9787,
      wiki: 'https://en.wikipedia.org/wiki/30_Rockefeller_Plaza'
    },
    {
      id: 107,
      name: 'The Metropolitan Museum of Art',
      category: 'Museum',
      image: 'images/NY/theMetropolitanMuseumOfArt.jpg',
      description:
        'One of the largest and most important art museums in the world.',
      lat: 40.7794,
      lng: -73.9632,
      wiki: 'https://en.wikipedia.org/wiki/Metropolitan_Museum_of_Art'
    },
    {
      id: 108,
      name: '9/11 Memorial & Museum',
      category: 'History',
      image: 'images/NY/Memorial.jpg',
      description:
        'A moving memorial and museum honoring the victims of September 11.',
      lat: 40.7115,
      lng: -74.0134,
      wiki: 'https://en.wikipedia.org/wiki/National_September_11_Memorial_%26_Museum'
    },
    {
      id: 109,
      name: 'High Line',
      category: 'Park',
      image: 'images/NY/highLine.jpg',
      description:
        'An elevated park built on a former railway line with modern landscaping and city views.',
      lat: 40.7480,
      lng: -74.0048,
      wiki: 'https://en.wikipedia.org/wiki/High_Line'
    },
    {
      id: 110,
      name: 'Grand Central Terminal',
      category: 'History',
      image: 'images/NY/grandCentralTerminal.jpg',
      description:
        'Historic train terminal known for its beautiful architecture and famous main hall.',
      lat: 40.7527,
      lng: -73.9772,
      wiki: 'https://en.wikipedia.org/wiki/Grand_Central_Terminal'
    },
  ],

  Krakow: [
    {
      id: 301,
      name: 'Wawel Royal Castle',
      category: 'History',
      image: 'images/Krakow/WawelRoyal.jpg',
      description:
        'A stunning hilltop castle that served as the seat of Polish kings for centuries, overlooking the Vistula River.',
      lat: 50.0540,
      lng: 19.9352,
      wiki: 'https://en.wikipedia.org/wiki/Wawel_Castle'
    },
    {
      id: 302,
      name: 'Main Market Square',
      category: 'Landmark',
      image: 'images/Krakow/MainMarket.jpg',
      description:
        'The largest medieval town square in Europe, surrounded by historic buildings, cafes, and the famous Cloth Hall.',
      lat: 50.0617,
      lng: 19.9373,
      wiki: 'https://en.wikipedia.org/wiki/Main_Square,_Krak%C3%B3w'
    },
    {
      id: 303,
      name: "St Mary's Basilica",
      category: 'History',
      image: 'images/Krakow/StMarysBasilica.jpg',
      description:
        'A 14th-century Gothic church famous for its wooden altarpiece by Veit Stoss and the hourly trumpet call from its tower.',
      lat: 50.0616,
      lng: 19.9392,
      wiki: 'https://en.wikipedia.org/wiki/St._Mary%27s_Basilica,_Krak%C3%B3w'
    },
    {
      id: 304,
      name: 'Kazimierz District',
      category: 'Landmark',
      image: 'images/Krakow/KazimierzDistrict.jpg',
      description:
        'The historic Jewish quarter, now a vibrant neighbourhood full of art galleries, street art, bars, and cultural heritage.',
      lat: 50.0487,
      lng: 19.9453,
      wiki: 'https://en.wikipedia.org/wiki/Kazimierz'
    },
    {
      id: 305,
      name: 'Wawel Cathedral',
      category: 'History',
      image: 'images/Krakow/WawelCathedral.jpg',
      description:
        'One of the most sacred temples in Poland, where kings were crowned and laid to rest for centuries.',
      lat: 50.0543,
      lng: 19.9354,
      wiki: 'https://en.wikipedia.org/wiki/Wawel_Cathedral'
    },
    {
      id: 306,
      name: 'Planty Park',
      category: 'Park',
      image: 'images/Krakow/PlantyPark.jpg',
      description:
        'A green belt encircling the Old Town, perfect for a peaceful walk among flowers, fountains, and towering trees.',
      lat: 50.0614,
      lng: 19.9320,
      wiki: 'https://en.wikipedia.org/wiki/Planty_Park'
    },
    {
      id: 307,
      name: 'Rynek Underground Museum',
      category: 'Museum',
      image: 'images/Krakow/RynekMuseum.jpg',
      description:
        'A fascinating museum beneath the Main Square, revealing medieval market stalls and archaeological treasures.',
      lat: 50.0615,
      lng: 19.9373,
      wiki: 'https://en.wikipedia.org/wiki/Rynek_Underground'
    },
    {
      id: 308,
      name: 'Collegium Maius',
      category: 'Museum',
      image: 'images/Krakow/Collegium.jpg',
      description:
        'The oldest university building in Poland, dating back to the 14th century. Copernicus studied here. Features a stunning Gothic courtyard.',
      lat: 50.0614,
      lng: 19.9333,
      wiki: 'https://en.wikipedia.org/wiki/Collegium_Maius'
    },
    {
      id: 309,
      name: 'The Barbican',
      category: 'History',
      image: 'images/Krakow/barbican.jpg',
      description:
        'A well-preserved medieval fortress gatehouse and one of the finest remaining examples of European defensive architecture.',
      lat: 50.0654,
      lng: 19.9414,
      wiki: 'https://en.wikipedia.org/wiki/Krak%C3%B3w_Barbican'
    },
    {
      id: 310,
      name: 'Cloth Hall',
      category: 'Shopping',
      image: 'images/Krakow/cloth.jpg',
      description:
        'A Renaissance trading hall in the centre of the Main Square, now filled with souvenir shops and a gallery upstairs.',
      lat: 50.0618,
      lng: 19.9373,
      wiki: 'https://en.wikipedia.org/wiki/Sukiennice'
    },
    {
      id: 311,
      name: 'Old Synagogue',
      category: 'History',
      image: 'images/Krakow/Old.jpg',
      description:
        'The oldest surviving synagogue in Poland, built in the 15th century in the Kazimierz district. Now a museum of Jewish history and culture.',
      lat: 50.0491,
      lng: 19.9460,
      wiki: 'https://en.wikipedia.org/wiki/Old_Synagogue_(Krak%C3%B3w)'
    },
    {
      id: 312,
      name: "Dragon's Den",
      category: 'Landmark',
      image: 'images/Krakow/Dragon.jpg',
      description:
        'A legendary cave beneath Wawel Hill, said to have been home to a fearsome dragon. A fire-breathing statue guards the exit.',
      lat: 50.0531,
      lng: 19.9352,
      wiki: 'https://en.wikipedia.org/wiki/Dragon%27s_Den_(Krak%C3%B3w)'
    },
  ],

  Tokyo: [
    {
      id: 201,
      name: 'Senso-ji Temple',
      category: 'Temple',
      image: 'images/Tokyo/sensoji.jpg',
      description:
        'Tokyo\'s oldest Buddhist temple in the Asakusa district, famous for its giant red lantern at the entrance gate.',
      lat: 35.7148,
      lng: 139.7967,
      wiki: 'https://en.wikipedia.org/wiki/Sens%C5%8D-ji'
    },
    {
      id: 202,
      name: 'Tokyo Tower',
      category: 'Landmark',
      image: 'images/Tokyo/tokyoTower.jpg',
      description:
        'An iconic red and white communications tower inspired by the Eiffel Tower, offering panoramic city views.',
      lat: 35.6586,
      lng: 139.7454,
      wiki: 'https://en.wikipedia.org/wiki/Tokyo_Tower'
    },
    {
      id: 203,
      name: 'Shibuya Crossing',
      category: 'Landmark',
      image: 'images/Tokyo/shibuya.jpg',
      description:
        'The world\'s busiest pedestrian crossing, surrounded by giant screens and neon lights.',
      lat: 35.6595,
      lng: 139.7004,
      wiki: 'https://en.wikipedia.org/wiki/Shibuya_Crossing'
    },
    {
      id: 204,
      name: 'Meiji Shrine',
      category: 'Temple',
      image: 'images/Tokyo/meiji.jpg',
      description:
        'A peaceful Shinto shrine surrounded by a lush forest in the heart of the city, dedicated to Emperor Meiji.',
      lat: 35.6764,
      lng: 139.6993,
      wiki: 'https://en.wikipedia.org/wiki/Meiji_Shrine'
    },
    {
      id: 205,
      name: 'Tokyo Skytree',
      category: 'Viewpoint',
      image: 'images/Tokyo/skytree.jpg',
      description:
        'The tallest tower in Japan at 634 metres, with observation decks offering views across the entire Kanto region.',
      lat: 35.7101,
      lng: 139.8107,
      wiki: 'https://en.wikipedia.org/wiki/Tokyo_Skytree'
    },
    {
      id: 206,
      name: 'Shinjuku Gyoen',
      category: 'Park',
      image: 'images/Tokyo/shinjukugyoen.jpg',
      description:
        'A spacious national garden blending Japanese, English, and French garden styles, famous for cherry blossoms.',
      lat: 35.6852,
      lng: 139.7100,
      wiki: 'https://en.wikipedia.org/wiki/Shinjuku_Gyoen'
    },
    {
      id: 207,
      name: 'Akihabara',
      category: 'Shopping',
      image: 'images/Tokyo/akihabara.jpg',
      description:
        'Tokyo\'s electric town, packed with electronics shops, anime stores, and gaming arcades.',
      lat: 35.7023,
      lng: 139.7745,
      wiki: 'https://en.wikipedia.org/wiki/Akihabara'
    },
    {
      id: 208,
      name: 'Imperial Palace',
      category: 'History',
      image: 'images/Tokyo/imperialpalace.jpg',
      description:
        'The primary residence of the Emperor of Japan, surrounded by moats and beautiful stone walls.',
      lat: 35.6852,
      lng: 139.7528,
      wiki: 'https://en.wikipedia.org/wiki/Tokyo_Imperial_Palace'
    },
    {
      id: 209,
      name: 'Ueno Park',
      category: 'Park',
      image: 'images/Tokyo/ueno.jpg',
      description:
        'A large public park home to museums, a zoo, temples, and seasonal cherry blossom viewing spots.',
      lat: 35.7146,
      lng: 139.7732,
      wiki: 'https://en.wikipedia.org/wiki/Ueno_Park'
    },
    {
      id: 210,
      name: 'Tsukiji Outer Market',
      category: 'Market',
      image: 'images/Tokyo/tsukiji.jpg',
      description:
        'A vibrant street market offering the freshest sushi, seafood, and Japanese street food.',
      lat: 35.6654,
      lng: 139.7707,
      wiki: 'https://en.wikipedia.org/wiki/Tsukiji'
    },
    {
      id: 211,
      name: 'teamLab Borderless',
      category: 'Art',
      image: 'images/Tokyo/teamlab.jpg',
      description:
        'An immersive digital art museum where interactive light installations surround visitors in every direction.',
      lat: 35.6253,
      lng: 139.7769,
      wiki: 'https://en.wikipedia.org/wiki/TeamLab'
    },
    {
      id: 212,
      name: 'Tokyo National Museum',
      category: 'Museum',
      image: 'images/Tokyo/nationalmuseum.jpg',
      description:
        'Japan\'s oldest and largest museum, housing an extensive collection of art and antiquities from across Asia.',
      lat: 35.7189,
      lng: 139.7766,
      wiki: 'https://en.wikipedia.org/wiki/Tokyo_National_Museum'
    },
  ],
};