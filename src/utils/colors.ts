export function getDensityColor(d: number) {
    return d > 10 ? '#800026' :
        d > 9 ? '#BD0026' :
            d > 8 ? '#E31A1C' :
                d > 7 ? '#FC4E2A' :
                    d > 6 ? '#FD8D3C' :
                        d > 4 ? '#FEB24C' :
                            d > 2 ? '#FED976' :
                                '#FFEDA0';
}

export function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

