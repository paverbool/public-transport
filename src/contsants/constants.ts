export const mapboxToken = 'pk.eyJ1IjoicGF2ZXJib29sIiwiYSI6ImNrb2oxNDRhbjBwdDgycGp6YmFkczIwZzYifQ.WD3KuDeQxeOcVLzIlds_9w';

const defaultDesiredContour = {
    all: 6,
    'Метро': 10
};
export const citiesConfig = {
    'kharkiv': {
        position: {lat: 49.9927649, lng: 36.2727449},
        networks: ['Метро', 'Трамвай', 'Тролейбус', 'Автобус', 'Маршрутка', /*'Приміський'*/],
        defaultDesiredContour,
    },
    'lviv': {
        position: {lat: 49.848822, lng: 24.041425},
        networks: ['Трамвай', 'Тролейбус', 'Автобус', 'Маршрутка',],
        defaultDesiredContour,
    },
    'krakow': {
        position: {lat: 50.061610, lng: 19.937364},
        networks: ["Tramwaj",
            "Autobus",
            "Nocny tramwaj",
            "Nocny autobus",
            "Express autobus",
            "Linie aglomeracyjne",
            "SKA",],
        defaultDesiredContour,

    },
    'warsaw': {
        position: {lat: 52.253210, lng: 21.032184},
        networks: [
            'Tram',
            'Subway',
            'Bus',
            'Railway train'
        ],
        defaultDesiredContour: {
            all: 6,
            'Subway': 10,
            'Railway train': 10,
        },
    },
    'kyiv': {
        position: {lat: 50.442784, lng: 30.549048},
        networks: [
            "Трамвай",
            "Швидкісний трамвай",
            "Автобус",
            "Метро",
            "Маршрутка",
            // "Приміський",
            // "Потяги",
            // "Електрички"
        ],
        defaultDesiredContour,
    }
}

export type CitiesKeys = keyof typeof citiesConfig;
